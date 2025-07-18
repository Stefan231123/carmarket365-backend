import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere, Like } from 'typeorm';
import { Car } from './car.entity';
import { CreateCarInput } from './dto/create-car.input';
import { UpdateCarInput } from './dto/update-car.input';
import { FilterCarsInput } from './dto/filter-cars.input';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
  ) {}

  create(createCarInput: CreateCarInput): Promise<Car> {
    const car = this.carRepository.create(createCarInput);
    return this.carRepository.save(car);
  }

  async findAll(filter?: FilterCarsInput): Promise<Car[]> {
    const where: FindOptionsWhere<Car> = {};

    if (filter) {
      if (filter.brand) where.brand = Like(`%${filter.brand}%`);
      if (filter.model) where.model = Like(`%${filter.model}%`);
      if (filter.fuelType) where.fuelType = filter.fuelType;
      if (filter.transmission) where.transmission = filter.transmission;
      if (filter.minPrice || filter.maxPrice)
        where.price = Between(filter.minPrice ?? 0, filter.maxPrice ?? 9999999);
      if (filter.minYear || filter.maxYear)
        where.year = Between(filter.minYear ?? 1900, filter.maxYear ?? 3000);
    }

    return this.carRepository.find({ where });
  }

  async update(updateCarInput: UpdateCarInput): Promise<Car> {
    const car = await this.carRepository.preload(updateCarInput);
    if (!car) {
      throw new Error(`Car with ID ${updateCarInput.id} not found`);
    }
    return this.carRepository.save(car);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.carRepository.delete(id);
    return !!result.affected;
  }
}



