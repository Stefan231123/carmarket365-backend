import { InputType, Field, Int, Float } from '@nestjs/graphql';
import {
  IsString, IsNumber, IsOptional, IsBoolean, IsArray,
  MinLength, MaxLength, Min, Max, IsLatitude, IsLongitude,
} from 'class-validator';

@InputType()
export class CreateCarInput {
  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  make!: string;

  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  model!: string;

  @Field(() => Int)
  @IsNumber()
  @Min(1900)
  @Max(2100)
  year!: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  @Max(100_000_000)
  price!: number;

  @Field(() => Int)
  @IsNumber()
  @Min(0)
  @Max(10_000_000)
  mileage!: number;

  @Field()
  @IsString()
  fuelType!: string;

  @Field()
  @IsString()
  transmission!: string;

  @Field()
  @IsString()
  @MaxLength(200)
  location!: string;

  // Optional fields
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  variant?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  condition?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  vehicleType?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  drivetrain?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(20000)
  engineSize?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5000)
  horsePower?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  interiorColor?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  doors?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(60)
  seats?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  features?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  safetyFeatures?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  contactPhone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  contactEmail?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  region?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  countryCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  priceNegotiable?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  acceptsTradeIn?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  allowTestDrive?: boolean;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  quickSale?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
