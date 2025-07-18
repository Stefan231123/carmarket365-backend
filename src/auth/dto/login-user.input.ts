import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginUserInput {
  @Field()
  identifier: string; // email or phone

  @Field()
  password: string;
}