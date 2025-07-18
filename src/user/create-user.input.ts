import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  phoneNumber: string;

  @Field()
  isDealer: boolean;

  @Field({ nullable: true })
  name?: string;
}