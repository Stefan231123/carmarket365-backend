import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarImage } from './car-image.entity';
import { Car } from '../car/car.entity';
import { CreateCarImageInput } from './dto/create-car-image.input';

@Injectable()
export class CarImageService {
  constructor(
    @InjectRepository(CarImage)
    private readonly repo: Repository<CarImage>,
    @InjectRepository(Car)
    private readonly carRepo: Repository<Car>,
  ) {}

  async create(input: CreateCarImageInput, userId: string): Promise<CarImage> {
    const car = await this.carRepo.findOne({ where: { id: input.carId } });
    if (!car) throw new NotFoundException('Car not found');
    if (car.sellerId !== userId) throw new ForbiddenException('Not your listing');
    const image = this.repo.create(input);
    return this.repo.save(image);
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const image = await this.repo.findOne({
      where: { id },
      relations: ['car'],
    });
    if (!image) throw new NotFoundException('Image not found');
    if (image.car.sellerId !== userId) throw new ForbiddenException('Not your listing');
    const result = await this.repo.delete(id);
    return !!result.affected;
  }

  async findByCarId(carId: string): Promise<CarImage[]> {
    return this.repo.find({ where: { carId }, order: { sortOrder: 'ASC' } });
  }

  async findAll(limit?: number, offset?: number): Promise<CarImage[]> {
    return this.repo.find({
      order: { createdAt: 'DESC' },
      take: Math.min(limit ?? 50, 200),
      skip: offset ?? 0,
    });
  }

  async updateUrl(id: string, url: string, thumbnailUrl?: string, userId?: string): Promise<CarImage> {
    const image = await this.repo.findOne({
      where: { id },
      relations: ['car'],
    });
    if (!image) throw new NotFoundException('Image not found');
    if (userId && image.car.sellerId !== userId) {
      throw new ForbiddenException('Not your listing');
    }
    image.url = url;
    if (thumbnailUrl !== undefined) image.thumbnailUrl = thumbnailUrl;
    return this.repo.save(image);
  }
}
