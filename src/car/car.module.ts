import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './car.entity';
import { CarService } from './car.service';
import { CarResolver } from './car.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Car])],
  providers: [CarService, CarResolver],
})
export class CarModule {}
