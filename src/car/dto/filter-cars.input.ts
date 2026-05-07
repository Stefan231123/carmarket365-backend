import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType('CarFilterInput')
export class CarFilterInput {
  @Field({ nullable: true })
  make?: string;

  @Field({ nullable: true })
  model?: string;

  @Field({ nullable: true })
  fuelType?: string;

  @Field({ nullable: true })
  transmission?: string;

  @Field({ nullable: true })
  vehicleType?: string;

  @Field({ nullable: true })
  condition?: string;

  @Field({ nullable: true })
  drivetrain?: string;

  @Field({ nullable: true })
  color?: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  countryCode?: string;

  @Field(() => Float, { nullable: true })
  minPrice?: number;

  @Field(() => Float, { nullable: true })
  maxPrice?: number;

  @Field(() => Int, { nullable: true })
  minYear?: number;

  @Field(() => Int, { nullable: true })
  maxYear?: number;

  @Field(() => Int, { nullable: true })
  minMileage?: number;

  @Field(() => Int, { nullable: true })
  maxMileage?: number;

  @Field(() => Int, { nullable: true })
  minEngineSize?: number;

  @Field(() => Int, { nullable: true })
  maxEngineSize?: number;

  @Field(() => Int, { nullable: true })
  minHorsePower?: number;

  @Field(() => Int, { nullable: true })
  maxHorsePower?: number;

  @Field(() => Int, { nullable: true })
  doors?: number;

  @Field(() => Int, { nullable: true })
  seats?: number;

  @Field({ nullable: true })
  isFeatured?: boolean;

  @Field({ nullable: true })
  sellerId?: string;

  @Field({ nullable: true })
  sellerType?: string;

  @Field({ nullable: true })
  allowTestDrive?: boolean;

  @Field({ nullable: true })
  acceptsTradeIn?: boolean;

  @Field({ nullable: true })
  priceNegotiable?: boolean;

  @Field({ nullable: true })
  query?: string;

  @Field({ nullable: true })
  sortBy?: string;

  @Field({ nullable: true })
  sortOrder?: string;

  @Field(() => Int, { nullable: true, description: 'Max results to return (default 50, max 200)' })
  limit?: number;

  @Field(() => Int, { nullable: true, description: 'Number of results to skip' })
  offset?: number;
}
