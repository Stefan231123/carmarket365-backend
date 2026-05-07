import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginUserInput } from './dto/login-user.input';
import { RegisterInput } from '../user/dto/register-user.input';
import { AuthResponse } from './dto/auth-response.dto';
import { UserRole } from '../user/enums/user-role.enum';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private readonly googleClient = new OAuth2Client();

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    // Generate opaque refresh token, hash it, store in DB
    const refreshToken = crypto.randomBytes(40).toString('hex');
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.userService.updateProfile(user.id, { refreshToken: hashedRefresh } as any);

    return { accessToken, refreshToken };
  }

  async validateAndGenerateToken(input: LoginUserInput): Promise<AuthResponse> {
    const user = await this.userService.findByEmailOrPhone(input.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User logged in: ${user.email}`);
    const { accessToken, refreshToken } = await this.generateTokens(user);
    return { accessToken, refreshToken, user };
  }

  async register(input: RegisterInput): Promise<AuthResponse> {
    const existing = await this.userService.findByEmail(input.email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const user = await this.userService.create({
      email: input.email,
      password: input.password,
      name: input.name,
    });

    // If dealer info provided, update dealer fields
    if (input.dealerName) {
      await this.userService.updateProfile(user.id, {
        dealerName: input.dealerName,
        dealerAddress: input.dealerAddress,
        dealerCity: input.dealerCity,
        dealerPhoneNumber: input.dealerPhoneNumber,
        role: UserRole.DEALER,
      });
    }

    const fullUser = await this.userService.findOne(user.id);
    this.logger.log(`New user registered: ${input.email}`);
    const { accessToken, refreshToken } = await this.generateTokens(fullUser);
    return { accessToken, refreshToken, user: fullUser };
  }

  async socialLogin(provider: string, token: string, email: string, name?: string): Promise<AuthResponse> {
    // Verify the token with the identity provider
    let verifiedEmail: string;
    let verifiedName: string | undefined;

    if (provider === 'google') {
      try {
        const ticket = await this.googleClient.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload?.email) {
          throw new UnauthorizedException('Invalid Google token');
        }
        verifiedEmail = payload.email;
        verifiedName = payload.name || name;
      } catch (err) {
        if (err instanceof UnauthorizedException) throw err;
        throw new UnauthorizedException('Google token verification failed');
      }
    } else {
      throw new UnauthorizedException(`Unsupported provider: ${provider}`);
    }

    let user = await this.userService.findByEmail(verifiedEmail);

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString('hex');
      user = await this.userService.create({
        email: verifiedEmail,
        password: randomPassword,
        name: verifiedName || undefined,
      });
    }

    await this.userService.updateProfile(user.id, { lastLoginAt: new Date() });
    const fullUser = await this.userService.findOne(user.id);
    this.logger.log(`Social login: ${verifiedEmail} via ${provider}`);
    const { accessToken, refreshToken } = await this.generateTokens(fullUser);
    return { accessToken, refreshToken, user: fullUser };
  }

  async refreshByUserId(userId: string, refreshToken: string): Promise<AuthResponse> {
    const user = await this.userService.findOne(userId);
    if (!user.refreshToken) {
      throw new UnauthorizedException('No active session');
    }

    const isValid = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(user);
    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user };
  }

  async logout(userId: string): Promise<boolean> {
    // Clear the refresh token
    await this.userService.updateProfile(userId, { refreshToken: undefined } as any);
    return true;
  }
}
