import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterUserInput {
  @Field()
  email: string;

  @Field()
  phoneNumber: string;

  @Field()
  password: string;

  @Field()
  fullName: string;
}
