import { InputType, Field } from '@nestjs/graphql';

@InputType('RecordCarViewInput')
export class RecordCarViewInput {
  @Field()
  carId!: string;
}
