import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // TEMP query to satisfy GraphQL root Query requirement
  @Query(() => String)
  hello(): string {
    return 'Hello from carmarket365!';
  }

  @Query(() => [User])
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User, { name: 'getUser' })
  async findOne(@Args('id', { type: () => Number }) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return this.userService.create(createUserInput);
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@Context() context: any): Promise<User> {
    const userId = context.req.user.id;
    return this.userService.findOne(userId);
  }
}

















