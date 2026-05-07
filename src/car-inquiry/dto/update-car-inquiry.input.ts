import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsEnum, IsString, MaxLength } from 'class-validator';
import { InquiryStatus } from '../car-inquiry.entity';

@InputType()
export class UpdateCarInquiryInput {
  @Field(() => InquiryStatus, { nullable: true })
  @IsOptional()
  @IsEnum(InquiryStatus)
  status?: InquiryStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  sellerResponse?: string;
}
