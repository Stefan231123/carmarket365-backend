import { ObjectType, Field, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class SystemHealth {
  @Field()
  status!: string;

  @Field(() => Float)
  cpuUsage!: number;

  @Field(() => Float)
  memoryUsage!: number;

  @Field(() => Float)
  diskUsage!: number;

  @Field(() => Int)
  activeConnections!: number;

  @Field(() => Float)
  responseTime!: number;

  @Field(() => Float)
  errorRate!: number;

  @Field()
  lastUpdated!: string;
}
