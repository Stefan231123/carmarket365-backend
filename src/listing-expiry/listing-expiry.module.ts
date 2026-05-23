import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Car } from '../car/car.entity';
import { CarModule } from '../car/car.module';
import { ListingExpiryService } from './listing-expiry.service';
import { ExpoNotificationService } from './expo-notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Car]), CarModule],
  providers: [ListingExpiryService, ExpoNotificationService],
})
export class ListingExpiryModule {}
