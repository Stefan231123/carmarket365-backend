import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field()
  @IsString()
  phone: string;

  @Field()
  @IsBoolean()
  isDealer: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;
}


