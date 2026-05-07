import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class AdminStats {
  @Field(() => Int)
  totalUsers!: number;

  @Field(() => Int)
  totalDealers!: number;

  @Field(() => Int)
  totalListings!: number;

  @Field(() => Int)
  activeListings!: number;

  @Field(() => Int)
  pendingListings!: number;

  @Field(() => Int)
  flaggedListings!: number;

  @Field(() => Float)
  totalRevenue!: number;

  @Field(() => Int)
  newUsersThisMonth!: number;

  @Field(() => Int)
  newUsersThisWeek!: number;

  @Field(() => Int)
  totalViews!: number;

  @Field(() => Int)
  totalInquiries!: number;

  @Field(() => Float)
  averageListingPrice!: number;
}
