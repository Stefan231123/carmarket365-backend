import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from './car.entity';
import { CarImage } from '../car-image/car-image.entity';
import { SavedCar } from '../saved-car/saved-car.entity';
import { CarInquiry } from '../car-inquiry/car-inquiry.entity';
import { CarService } from './car.service';
import { CarResolver } from './car.resolver';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([Car, CarImage, SavedCar, CarInquiry]), S3Module],
  providers: [CarService, CarResolver],
  exports: [CarService],
})
export class CarModule {}
