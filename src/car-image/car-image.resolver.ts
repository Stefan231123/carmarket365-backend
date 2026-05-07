import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CarImage } from './car-image.entity';
import { CarImageService } from './car-image.service';
import { CreateCarImageInput } from './dto/create-car-image.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => CarImage)
export class CarImageResolver {
  constructor(private readonly carImageService: CarImageService) {}

  @Query(() => [CarImage], { name: 'getAllCarImages' })
  @UseGuards(JwtAuthGuard)
  async getAllCarImages(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ): Promise<CarImage[]> {
    return this.carImageService.findAll(limit, offset);
  }

  @Mutation(() => CarImage)
  @UseGuards(JwtAuthGuard)
  async createCarImage(
    @Args('input') input: CreateCarImageInput,
    @CurrentUser() currentUser: any,
  ): Promise<CarImage> {
    return this.carImageService.create(input, currentUser.userId);
  }

  @Mutation(() => CarImage, { name: 'updateCarImageUrl' })
  @UseGuards(JwtAuthGuard)
  async updateCarImageUrl(
    @CurrentUser() currentUser: any,
    @Args('id') id: string,
    @Args('url') url: string,
    @Args('thumbnailUrl', { nullable: true }) thumbnailUrl?: string,
  ): Promise<CarImage> {
    return this.carImageService.updateUrl(id, url, thumbnailUrl, currentUser.userId);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async deleteCarImage(
    @Args('id') id: string,
    @CurrentUser() currentUser: any,
  ): Promise<boolean> {
    return this.carImageService.delete(id, currentUser.userId);
  }
}
