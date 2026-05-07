import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class RecentActivity {
  @Field(() => ID)
  id!: string;

  @Field()
  action!: string;

  @Field()
  user!: string;

  @Field()
  time!: string;

  @Field({ nullable: true })
  details?: string;

  @Field()
  type!: string;

  @Field({ nullable: true })
  entityId?: string;
}
