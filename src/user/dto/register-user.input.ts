import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, MinLength, IsOptional, IsString } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @MinLength(8)
  password!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  dealerName?: string;

  @Field({ nullable: true })
  @IsOptional()
  dealerAddress?: string;

  @Field({ nullable: true })
  @IsOptional()
  dealerCity?: string;

  @Field({ nullable: true })
  @IsOptional()
  dealerPhoneNumber?: string;
}
