import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CarService } from './car.service';
import { Car } from './car.entity';
import { CreateCarInput } from './dto/create-car.input';
import { UpdateCarInput } from './dto/update-car.input';
import { CarFilterInput } from './dto/filter-cars.input';
import { RecordCarViewInput } from './dto/record-car-view.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserRole } from '../user/enums/user-role.enum';

@Resolver(() => Car)
export class CarResolver {
  constructor(private readonly carService: CarService) {}

  @Query(() => [Car])
  getCars(
    @Args('filters', { nullable: true }) filters?: CarFilterInput,
  ): Promise<Car[]> {
    return this.carService.findAll(filters);
  }

  @Query(() => Car)
  getCarById(@Args('id') id: string): Promise<Car> {
    return this.carService.findOne(id);
  }

  @Query(() => [Car])
  getFeaturedCars(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit: number,
  ): Promise<Car[]> {
    return this.carService.findFeatured(limit);
  }

  @Query(() => [Car])
  @UseGuards(JwtAuthGuard)
  getMyListings(@CurrentUser() user: { userId: string }): Promise<Car[]> {
    return this.carService.findByUser(user.userId);
  }

  @Mutation(() => Car)
  @UseGuards(JwtAuthGuard)
  createCar(
    @Args('input') input: CreateCarInput,
    @CurrentUser() user: { userId: string },
  ): Promise<Car> {
    return this.carService.create(input, user.userId);
  }

  @Mutation(() => Car)
  @UseGuards(JwtAuthGuard)
  updateCar(
    @Args('id') id: string,
    @Args('input') input: UpdateCarInput,
    @CurrentUser() user: { userId: string; role?: string },
  ): Promise<Car> {
    return this.carService.update(id, input, user.userId, user.role);
  }

  @Query(() => [Car], { name: 'getAllListings' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getAllListings(): Promise<Car[]> {
    return this.carService.findAllListings();
  }

  @Query(() => [Car], { name: 'getExpressSaleOpportunities' })
  getExpressSaleOpportunities(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ): Promise<Car[]> {
    return this.carService.findExpressSale(limit, offset);
  }

  @Query(() => [String])
  getCarMakes(): Promise<string[]> {
    return this.carService.getDistinctMakes();
  }

  @Query(() => [String])
  getCarModels(@Args('make') make: string): Promise<string[]> {
    return this.carService.getModelsByMake(make);
  }

  @Query(() => [String])
  getAllCarMakes(): Promise<string[]> {
    return this.carService.getAllMakes();
  }

  @Query(() => [String])
  getAllCarModels(@Args('make') make: string): Promise<string[]> {
    return this.carService.getAllModels(make);
  }

  @Query(() => [Car])
  getCarsByMake(
    @Args('make') make: string,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ): Promise<Car[]> {
    return this.carService.findByMake(make, limit, offset);
  }

  @Mutation(() => Car)
  recordCarView(
    @Args('input') input: RecordCarViewInput,
  ): Promise<Car> {
    return this.carService.recordView(input.carId);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  deleteCar(
    @Args('id') id: string,
    @CurrentUser() user: { userId: string; role?: string },
  ): Promise<boolean> {
    return this.carService.remove(id, user.userId, user.role);
  }

  @Mutation(() => Car)
  @UseGuards(JwtAuthGuard)
  renewListing(
    @Args('carId') carId: string,
    @CurrentUser() user: { userId: string },
  ): Promise<Car> {
    return this.carService.renewListing(carId, user.userId);
  }
}
