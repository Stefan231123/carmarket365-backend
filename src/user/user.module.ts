import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User } from './entities/user.entity';
import { Car } from '../car/car.entity';
import { CarInquiry } from '../car-inquiry/car-inquiry.entity';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Car, CarInquiry]), S3Module],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}

