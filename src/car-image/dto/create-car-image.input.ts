import { InputType, Field, Int } from '@nestjs/graphql';
import { IsUUID, IsUrl, IsOptional, IsBoolean, IsInt, IsString, Min, Max } from 'class-validator';

@InputType()
export class CreateCarImageInput {
  @Field()
  @IsUUID()
  carId!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  s3Key?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl()
  url?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  publicId?: string;

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isMain?: boolean;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(50)
  sortOrder?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fileName?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  fileSize?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  mimeType?: string;
}
