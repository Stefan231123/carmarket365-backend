import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './car.entity';
import { CarImage } from '../car-image/car-image.entity';
import { CarService } from './car.service';
import { CarResolver } from './car.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Car, CarImage])],
  providers: [CarService, CarResolver],
  exports: [CarService],
})
export class CarModule {}
