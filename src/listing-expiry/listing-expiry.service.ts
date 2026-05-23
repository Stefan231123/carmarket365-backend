import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from '../car/car.entity';
import { CarService } from '../car/car.service';
import { ExpoNotificationService } from './expo-notification.service';

@Injectable()
export class ListingExpiryService {
  private readonly logger = new Logger(ListingExpiryService.name);

  constructor(
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    private readonly carService: CarService,
    private readonly expoNotificationService: ExpoNotificationService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async sendExpiryWarnings(): Promise<void> {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const listings = await this.carRepository
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.seller', 'seller')
      .where('car.expiresAt IS NOT NULL')
      .andWhere('car.expiresAt <= :in24Hours', { in24Hours })
      .andWhere('car.expiresAt > :now', { now })
      .andWhere('car.expiryNotifiedAt IS NULL')
      .andWhere('car.isAvailable = true')
      .getMany();

    if (listings.length === 0) return;

    this.logger.log(`Sending expiry warnings for ${listings.length} listing(s)`);

    const messages = listings
      .filter((car) => car.seller?.expoPushToken)
      .map((car) => ({
        to: car.seller.expoPushToken!,
        title: 'Your listing is expiring soon',
        body: `Your ${car.year} ${car.make} ${car.model} listing expires in 24 hours. Tap to renew it.`,
        data: { carId: car.id, action: 'RENEW_LISTING' } as Record<string, unknown>,
        sound: 'default' as const,
      }));

    await this.expoNotificationService.sendBatch(messages);

    const notifiedAt = new Date();
    await Promise.all(
      listings.map((car) =>
        this.carRepository.update(car.id, { expiryNotifiedAt: notifiedAt }),
      ),
    );

    this.logger.log(`Expiry warnings sent for ${messages.length} listing(s) with push tokens`);
  }

  @Cron('30 * * * *')
  async autoDeleteExpiredListings(): Promise<void> {
    const now = new Date();

    const expired = await this.carRepository
      .createQueryBuilder('car')
      .where('car.expiresAt IS NOT NULL')
      .andWhere('car.expiresAt <= :now', { now })
      .andWhere('car.isAvailable = true')
      .getMany();

    if (expired.length === 0) return;

    this.logger.log(`Auto-deleting ${expired.length} expired listing(s)`);

    for (const car of expired) {
      try {
        await this.carService.removeWithS3Cleanup(car.id);
      } catch (error) {
        this.logger.error(`Failed to auto-delete car ${car.id}: ${error}`);
      }
    }
  }
}
