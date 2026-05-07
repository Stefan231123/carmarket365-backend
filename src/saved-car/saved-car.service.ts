import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavedCar } from './saved-car.entity';

@Injectable()
export class SavedCarService {
  constructor(
    @InjectRepository(SavedCar)
    private readonly repo: Repository<SavedCar>,
  ) {}

  async save(userId: string, carId: string): Promise<SavedCar> {
    // Check if already saved
    const existing = await this.repo.findOne({ where: { userId, carId } });
    if (existing) return existing;

    const savedCar = this.repo.create({ userId, carId });
    return this.repo.save(savedCar);
  }

  async unsave(userId: string, carId: string): Promise<boolean> {
    const result = await this.repo.delete({ userId, carId });
    return !!result.affected;
  }

  async findByUser(userId: string): Promise<SavedCar[]> {
    return this.repo.find({
      where: { userId },
      relations: ['car', 'car.images', 'car.seller'],
      order: { createdAt: 'DESC' },
    });
  }
}
