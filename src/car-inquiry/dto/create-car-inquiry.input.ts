import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsUUID, IsOptional, IsEmail, MinLength, MaxLength, IsEnum } from 'class-validator';
import { InquiryType } from '../car-inquiry.entity';

@InputType()
export class CreateCarInquiryInput {
  @Field()
  @IsUUID()
  carId!: string;

  @Field(() => InquiryType, { nullable: true, defaultValue: 'GENERAL' })
  @IsOptional()
  @IsEnum(InquiryType)
  type?: InquiryType;

  @Field()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  message!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;
}
