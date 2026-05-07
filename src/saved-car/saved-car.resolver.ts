import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { SavedCar } from './saved-car.entity';
import { SavedCarService } from './saved-car.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => SavedCar)
export class SavedCarResolver {
  constructor(private readonly savedCarService: SavedCarService) {}

  @Mutation(() => SavedCar)
  @UseGuards(JwtAuthGuard)
  async saveCar(
    @Args('carId') carId: string,
    @CurrentUser() currentUser: any,
  ): Promise<SavedCar> {
    return this.savedCarService.save(currentUser.userId, carId);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async unsaveCar(
    @Args('carId') carId: string,
    @CurrentUser() currentUser: any,
  ): Promise<boolean> {
    return this.savedCarService.unsave(currentUser.userId, carId);
  }

  @Query(() => [SavedCar], { name: 'getUserSavedCars' })
  @UseGuards(JwtAuthGuard)
  async getUserSavedCars(@CurrentUser() currentUser: any): Promise<SavedCar[]> {
    return this.savedCarService.findByUser(currentUser.userId);
  }
}
