import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User } from './entities/user.entity';
import { Car } from '../car/car.entity';
import { CarInquiry } from '../car-inquiry/car-inquiry.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Car, CarInquiry])],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}

