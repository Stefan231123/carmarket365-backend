import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarInquiry, InquiryStatus } from './car-inquiry.entity';
import { CreateCarInquiryInput } from './dto/create-car-inquiry.input';
import { UpdateCarInquiryInput } from './dto/update-car-inquiry.input';

@Injectable()
export class CarInquiryService {
  constructor(
    @InjectRepository(CarInquiry)
    private readonly repo: Repository<CarInquiry>,
  ) {}

  async create(input: CreateCarInquiryInput, userId?: string): Promise<CarInquiry> {
    const inquiry = this.repo.create({ ...input, userId });
    return this.repo.save(inquiry);
  }

  async findSellerInquiries(sellerId: string, limit?: number, offset?: number): Promise<CarInquiry[]> {
    return this.repo
      .createQueryBuilder('inquiry')
      .leftJoinAndSelect('inquiry.car', 'car')
      .leftJoinAndSelect('inquiry.user', 'user')
      .where('car.sellerId = :sellerId', { sellerId })
      .orderBy('inquiry.createdAt', 'DESC')
      .take(Math.min(limit ?? 50, 200))
      .skip(offset ?? 0)
      .getMany();
  }

  async update(id: string, input: UpdateCarInquiryInput, sellerId: string): Promise<CarInquiry> {
    const inquiry = await this.repo.findOne({
      where: { id },
      relations: ['car', 'user'],
    });
    if (!inquiry) throw new NotFoundException('Inquiry not found');
    if (inquiry.car.sellerId !== sellerId) {
      throw new ForbiddenException('You can only respond to inquiries on your listings');
    }

    if (input.status) inquiry.status = input.status;
    if (input.sellerResponse) {
      inquiry.sellerResponse = input.sellerResponse;
      inquiry.repliedAt = new Date();
      if (inquiry.status === InquiryStatus.PENDING) {
        inquiry.status = InquiryStatus.REPLIED;
      }
    }

    return this.repo.save(inquiry);
  }

  async countBySeller(sellerId: string): Promise<number> {
    return this.repo
      .createQueryBuilder('inquiry')
      .leftJoin('inquiry.car', 'car')
      .where('car.sellerId = :sellerId', { sellerId })
      .getCount();
  }
}
