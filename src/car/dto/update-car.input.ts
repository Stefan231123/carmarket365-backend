import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCarInput } from './create-car.input';

@InputType()
export class UpdateCarInput extends PartialType(CreateCarInput) {}
