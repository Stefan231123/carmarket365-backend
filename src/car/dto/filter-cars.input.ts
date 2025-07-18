import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class FilterCarsInput {
  @Field({ nullable: true })
  brand?: string;

  @Field({ nullable: true })
  model?: string;

  @Field({ nullable: true })
  fuelType?: string;

  @Field({ nullable: true })
  transmission?: string;

  @Field({ nullable: true })
  minPrice?: number;

  @Field({ nullable: true })
  maxPrice?: number;

  @Field({ nullable: true })
  minYear?: number;

  @Field({ nullable: true })
  maxYear?: number;
}
