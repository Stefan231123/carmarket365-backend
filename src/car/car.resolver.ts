import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CarService } from './car.service';
import { Car } from './car.entity';
import { UpdateCarInput } from './dto/update-car.input';
import { CreateCarInput } from './dto/create-car.input';
import { FilterCarsInput } from './dto/filter-cars.input';

@Resolver(() => Car)
export class CarResolver {
  constructor(private readonly carService: CarService) {}

  @Query(() => [Car])
  getAllCars(@Args('filter', { nullable: true }) filter?: FilterCarsInput): Promise<Car[]> {
    return this.carService.findAll(filter);
  }

  @Mutation(() => Car)
  createCar(@Args('createCarInput') createCarInput: CreateCarInput): Promise<Car> {
    return this.carService.create(createCarInput);
  }

  @Mutation(() => Car)
  updateCar(@Args('updateCarInput') updateCarInput: UpdateCarInput): Promise<Car> {
    return this.carService.update(updateCarInput);
  }

  @Mutation(() => Boolean)
  deleteCar(@Args('id') id: number): Promise<boolean> {
    return this.carService.remove(id);
  }
}


