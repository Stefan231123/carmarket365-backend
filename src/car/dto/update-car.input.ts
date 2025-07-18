import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateCarInput } from './create-car.input';

@InputType()
export class UpdateCarInput extends PartialType(CreateCarInput) {
  @Field(() => Int)
  id: number;
}
