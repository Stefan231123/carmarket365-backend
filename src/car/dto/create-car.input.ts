import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class CreateCarInput {
  @Field()
  brand: string;

  @Field()
  model: string;

  @Field(() => Int)
  year: number;

  @Field()
  fuelType: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  mileage: number;

  @Field()
  transmission: string;
}
