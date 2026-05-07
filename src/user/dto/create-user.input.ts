import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, IsBoolean, IsOptional } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @MinLength(8)
  password!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isDealer?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;
}
