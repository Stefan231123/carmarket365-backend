import { Resolver, Query, Mutation, Args, Int, ObjectType, Field } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CarImage } from './car-image.entity';
import { CarImageService } from './car-image.service';
import { CreateCarImageInput } from './dto/create-car-image.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ObjectType()
class ImageUploadUrl {
  @Field()
  uploadUrl!: string;

  @Field()
  key!: string;
}

@Resolver(() => CarImage)
export class CarImageResolver {
  constructor(private readonly carImageService: CarImageService) {}

  @Mutation(() => ImageUploadUrl)
  @UseGuards(JwtAuthGuard)
  async getImageUploadUrl(
    @Args('carId') carId: string,
    @Args('fileName') fileName: string,
    @CurrentUser() currentUser: any,
  ): Promise<ImageUploadUrl> {
    return this.carImageService.getPresignedUrl(carId, fileName, currentUser.userId);
  }

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
