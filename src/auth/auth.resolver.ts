import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginUserInput } from './dto/login-user.input';
import { AuthResponse } from './dto/auth-response.dto';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(@Args('loginUserInput') loginUserInput: LoginUserInput): Promise<AuthResponse> {
    return this.authService.validateAndGenerateToken(loginUserInput);
  }
}



