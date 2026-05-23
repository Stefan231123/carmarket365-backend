import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './car.entity';
import { CarImage } from '../car-image/car-image.entity';
import { CreateCarInput } from './dto/create-car.input';
import { UpdateCarInput } from './dto/update-car.input';
import { CarFilterInput } from './dto/filter-cars.input';
import { S3Service } from '../s3/s3.service';

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

function clampLimit(limit?: number): number {
  return Math.min(limit ?? DEFAULT_LIMIT, MAX_LIMIT);
}

@Injectable()
export class CarService {
  private readonly logger = new Logger(CarService.name);

  constructor(
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
    @InjectRepository(CarImage)
    private carImageRepository: Repository<CarImage>,
    private readonly s3Service: S3Service,
  ) {}

  async create(input: CreateCarInput, sellerId: string): Promise<Car> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    const car = this.carRepository.create({ ...input, sellerId, expiresAt });
    const saved = await this.carRepository.save(car);
    this.logger.log(`Car created: ${saved.id} by user ${sellerId}, expires: ${expiresAt.toISOString()}`);
    return saved;
  }

  async findAll(filter?: CarFilterInput): Promise<Car[]> {
    const qb = this.carRepository.createQueryBuilder('car')
      .leftJoinAndSelect('car.seller', 'seller')
      .leftJoinAndSelect('car.images', 'images')
      .where('car.isAvailable = :available', { available: true });

    if (filter) {
      if (filter.make) qb.andWhere('LOWER(car.make) = LOWER(:make)', { make: filter.make });
      if (filter.model) qb.andWhere('LOWER(car.model) = LOWER(:model)', { model: filter.model });
      if (filter.fuelType) qb.andWhere('car.fuelType = :fuelType', { fuelType: filter.fuelType });
      if (filter.transmission) qb.andWhere('car.transmission = :transmission', { transmission: filter.transmission });
      if (filter.vehicleType) qb.andWhere('car.vehicleType = :vehicleType', { vehicleType: filter.vehicleType });
      if (filter.condition) qb.andWhere('car.condition = :condition', { condition: filter.condition });
      if (filter.drivetrain) qb.andWhere('car.drivetrain = :drivetrain', { drivetrain: filter.drivetrain });
      if (filter.color) qb.andWhere('LOWER(car.color) = LOWER(:color)', { color: filter.color });
      if (filter.location) qb.andWhere('LOWER(car.location) LIKE LOWER(:location)', { location: `%${filter.location}%` });
      if (filter.countryCode) qb.andWhere('car.countryCode = :countryCode', { countryCode: filter.countryCode });
      if (filter.sellerId) qb.andWhere('car.sellerId = :sellerId', { sellerId: filter.sellerId });
      if (filter.isFeatured !== undefined && filter.isFeatured !== null) {
        qb.andWhere('car.isFeatured = :isFeatured', { isFeatured: filter.isFeatured });
      }

      // Range filters
      if (filter.minPrice != null) qb.andWhere('car.price >= :minPrice', { minPrice: filter.minPrice });
      if (filter.maxPrice != null) qb.andWhere('car.price <= :maxPrice', { maxPrice: filter.maxPrice });
      if (filter.minYear != null) qb.andWhere('car.year >= :minYear', { minYear: filter.minYear });
      if (filter.maxYear != null) qb.andWhere('car.year <= :maxYear', { maxYear: filter.maxYear });
      if (filter.minMileage != null) qb.andWhere('car.mileage >= :minMileage', { minMileage: filter.minMileage });
      if (filter.maxMileage != null) qb.andWhere('car.mileage <= :maxMileage', { maxMileage: filter.maxMileage });
      if (filter.minEngineSize != null) qb.andWhere('car.engineSize >= :minEngineSize', { minEngineSize: filter.minEngineSize });
      if (filter.maxEngineSize != null) qb.andWhere('car.engineSize <= :maxEngineSize', { maxEngineSize: filter.maxEngineSize });
      if (filter.minHorsePower != null) qb.andWhere('car.horsePower >= :minHorsePower', { minHorsePower: filter.minHorsePower });
      if (filter.maxHorsePower != null) qb.andWhere('car.horsePower <= :maxHorsePower', { maxHorsePower: filter.maxHorsePower });
      if (filter.doors != null) qb.andWhere('car.doors = :doors', { doors: filter.doors });
      if (filter.seats != null) qb.andWhere('car.seats = :seats', { seats: filter.seats });

      // Boolean filters
      if (filter.allowTestDrive !== undefined && filter.allowTestDrive !== null) {
        qb.andWhere('car.allowTestDrive = :allowTestDrive', { allowTestDrive: filter.allowTestDrive });
      }
      if (filter.acceptsTradeIn !== undefined && filter.acceptsTradeIn !== null) {
        qb.andWhere('car.acceptsTradeIn = :acceptsTradeIn', { acceptsTradeIn: filter.acceptsTradeIn });
      }
      if (filter.priceNegotiable !== undefined && filter.priceNegotiable !== null) {
        qb.andWhere('car.priceNegotiable = :priceNegotiable', { priceNegotiable: filter.priceNegotiable });
      }

      // Seller type filter
      if (filter.sellerType) {
        qb.andWhere('seller.role = :sellerType', { sellerType: filter.sellerType.toUpperCase() });
      }

      // Full-text search on make, model, description
      if (filter.query) {
        qb.andWhere(
          '(LOWER(car.make) LIKE LOWER(:q) OR LOWER(car.model) LIKE LOWER(:q) OR LOWER(car.description) LIKE LOWER(:q))',
          { q: `%${filter.query}%` },
        );
      }

      // Sorting
      const sortBy = filter.sortBy || 'createdAt';
      const sortOrder = (filter.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC') as 'ASC' | 'DESC';
      const allowedSortFields = ['price', 'year', 'mileage', 'createdAt', 'viewCount'];
      if (allowedSortFields.includes(sortBy)) {
        qb.orderBy(`car.${sortBy}`, sortOrder);
      } else {
        qb.orderBy('car.createdAt', 'DESC');
      }

      // Pagination
      qb.take(clampLimit(filter.limit));
      qb.skip(filter.offset ?? 0);
    } else {
      qb.orderBy('car.createdAt', 'DESC');
      qb.take(DEFAULT_LIMIT);
    }

    return qb.getMany();
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.carRepository.findOne({
      where: { id },
      relations: ['seller', 'images'],
    });
    if (!car) throw new NotFoundException(`Car with ID ${id} not found`);
    return car;
  }

  async findFeatured(limit: number = 10): Promise<Car[]> {
    return this.carRepository.find({
      where: { isFeatured: true, isAvailable: true },
      relations: ['seller', 'images'],
      order: { createdAt: 'DESC' },
      take: Math.min(limit, MAX_LIMIT),
    });
  }

  async findByUser(userId: string): Promise<Car[]> {
    return this.carRepository.find({
      where: { sellerId: userId },
      relations: ['seller', 'images'],
      order: { createdAt: 'DESC' },
      take: MAX_LIMIT,
    });
  }

  async update(id: string, input: UpdateCarInput, userId: string): Promise<Car> {
    const car = await this.findOne(id);
    if (car.sellerId !== userId) {
      throw new ForbiddenException('You can only update your own listings');
    }
    Object.assign(car, input);
    return this.carRepository.save(car);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const car = await this.findOne(id);
    if (car.sellerId !== userId) {
      throw new ForbiddenException('You can only delete your own listings');
    }
    const result = await this.carRepository.delete(id);
    return !!result.affected;
  }

  async getDistinctMakes(): Promise<string[]> {
    const results = await this.carRepository
      .createQueryBuilder('car')
      .select('DISTINCT car.make', 'make')
      .where('car.isAvailable = :available', { available: true })
      .orderBy('car.make', 'ASC')
      .getRawMany();
    return results.map(r => r.make);
  }

  async getModelsByMake(make: string): Promise<string[]> {
    const results = await this.carRepository
      .createQueryBuilder('car')
      .select('DISTINCT car.model', 'model')
      .where('car.isAvailable = :available', { available: true })
      .andWhere('LOWER(car.make) = LOWER(:make)', { make })
      .orderBy('car.model', 'ASC')
      .getRawMany();
    return results.map(r => r.model);
  }

  async getAllMakes(): Promise<string[]> {
    const results = await this.carRepository
      .createQueryBuilder('car')
      .select('DISTINCT car.make', 'make')
      .orderBy('car.make', 'ASC')
      .getRawMany();
    return results.map(r => r.make);
  }

  async getAllModels(make: string): Promise<string[]> {
    const results = await this.carRepository
      .createQueryBuilder('car')
      .select('DISTINCT car.model', 'model')
      .andWhere('LOWER(car.make) = LOWER(:make)', { make })
      .orderBy('car.model', 'ASC')
      .getRawMany();
    return results.map(r => r.model);
  }

  async findAllListings(limit?: number, offset?: number): Promise<Car[]> {
    return this.carRepository.find({
      relations: ['seller', 'images'],
      order: { createdAt: 'DESC' },
      take: clampLimit(limit),
      skip: offset ?? 0,
    });
  }

  async findExpressSale(limit?: number, offset?: number): Promise<Car[]> {
    return this.carRepository.find({
      where: { quickSale: true, isAvailable: true },
      relations: ['seller', 'images'],
      order: { createdAt: 'DESC' },
      take: clampLimit(limit),
      skip: offset ?? 0,
    });
  }

  async recordView(id: string): Promise<Car> {
    const car = await this.findOne(id);
    car.viewCount += 1;
    return this.carRepository.save(car);
  }

  async findByMake(make: string, limit?: number, offset?: number): Promise<Car[]> {
    return this.carRepository.find({
      where: { make, isAvailable: true },
      relations: ['seller', 'images'],
      order: { createdAt: 'DESC' },
      take: clampLimit(limit),
      skip: offset ?? 0,
    });
  }

  async removeWithS3Cleanup(carId: string): Promise<void> {
    const images = await this.carImageRepository.find({ where: { carId } });

    await Promise.allSettled(
      images
        .filter(img => img.publicId && img.publicId.startsWith('images/'))
        .flatMap(img => {
          const thumbKey = img.publicId!.replace('images/', 'thumbnails/');
          return [
            this.s3Service.deleteObject(img.publicId!),
            this.s3Service.deleteObject(thumbKey),
          ];
        }),
    );

    await this.carRepository.delete(carId);
    this.logger.log(`Car ${carId} auto-deleted with S3 cleanup`);
  }

  async renewListing(carId: string, userId: string): Promise<Car> {
    const car = await this.findOne(carId);
    if (car.sellerId !== userId) {
      throw new ForbiddenException('You can only renew your own listings');
    }

    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + 30);
    car.expiresAt = newExpiry;
    car.expiryNotifiedAt = undefined;
    return this.carRepository.save(car);
  }
}
