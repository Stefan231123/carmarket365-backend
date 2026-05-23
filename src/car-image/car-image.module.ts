import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarImage } from './car-image.entity';
import { Car } from '../car/car.entity';
import { CarImageService } from './car-image.service';
import { CarImageResolver } from './car-image.resolver';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([CarImage, Car]), S3Module],
  providers: [CarImageService, CarImageResolver],
  exports: [CarImageService],
})
export class CarImageModule {}
