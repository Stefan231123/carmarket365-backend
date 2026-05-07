import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CarInquiry } from './car-inquiry.entity';
import { CarInquiryService } from './car-inquiry.service';
import { CreateCarInquiryInput } from './dto/create-car-inquiry.input';
import { UpdateCarInquiryInput } from './dto/update-car-inquiry.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => CarInquiry)
export class CarInquiryResolver {
  constructor(private readonly carInquiryService: CarInquiryService) {}

  @Query(() => [CarInquiry], { name: 'getSellerInquiries' })
  @UseGuards(JwtAuthGuard)
  async getSellerInquiries(
    @CurrentUser() currentUser: any,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ): Promise<CarInquiry[]> {
    return this.carInquiryService.findSellerInquiries(currentUser.userId, limit, offset);
  }

  @Mutation(() => CarInquiry, { name: 'createCarInquiry' })
  @UseGuards(JwtAuthGuard)
  async createCarInquiry(
    @Args('input') input: CreateCarInquiryInput,
    @CurrentUser() currentUser: any,
  ): Promise<CarInquiry> {
    return this.carInquiryService.create(input, currentUser.userId);
  }

  @Mutation(() => CarInquiry, { name: 'updateCarInquiry' })
  @UseGuards(JwtAuthGuard)
  async updateCarInquiry(
    @Args('id') id: string,
    @Args('input') input: UpdateCarInquiryInput,
    @CurrentUser() currentUser: any,
  ): Promise<CarInquiry> {
    return this.carInquiryService.update(id, input, currentUser.userId);
  }
}
