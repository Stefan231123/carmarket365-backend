import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginUserInput } from './dto/login-user.input';
import { RegisterInput } from '../user/dto/register-user.input';
import { AuthResponse } from './dto/auth-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  @UseGuards(ThrottlerGuard)
  async login(@Args('input') input: LoginUserInput): Promise<AuthResponse> {
    return this.authService.validateAndGenerateToken(input);
  }

  @Mutation(() => AuthResponse)
  @UseGuards(ThrottlerGuard)
  async register(@Args('input') input: RegisterInput): Promise<AuthResponse> {
    return this.authService.register(input);
  }

  @Mutation(() => AuthResponse)
  @UseGuards(ThrottlerGuard)
  async socialLogin(
    @Args('provider') provider: string,
    @Args('token') token: string,
    @Args('email') email: string,
    @Args('name', { nullable: true }) name?: string,
  ): Promise<AuthResponse> {
    return this.authService.socialLogin(provider, token, email, name);
  }

  @Mutation(() => AuthResponse)
  @UseGuards(ThrottlerGuard)
  async refreshToken(
    @Args('userId') userId: string,
    @Args('refreshToken') refreshToken: string,
  ): Promise<AuthResponse> {
    return this.authService.refreshByUserId(userId, refreshToken);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() currentUser: any): Promise<boolean> {
    return this.authService.logout(currentUser.userId);
  }
}
