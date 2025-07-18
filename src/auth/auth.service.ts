import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginUserInput } from './dto/login-user.input';
import * as bcrypt from 'bcrypt';
import { AuthResponse } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateAndGenerateToken(loginUserInput: LoginUserInput): Promise<AuthResponse> {
    const user = await this.userService.findByEmailOrPhone(loginUserInput.identifier);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(loginUserInput.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { sub: user.id };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user,
    };
  }
}










