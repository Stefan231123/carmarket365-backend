import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarImage } from './car-image.entity';
import { Car } from '../car/car.entity';
import { CreateCarImageInput } from './dto/create-car-image.input';
import { S3Service } from '../s3/s3.service';
import { ImageProcessorService } from '../s3/image-processor.service';

@Injectable()
export class CarImageService {
  private readonly logger = new Logger(CarImageService.name);

  constructor(
    @InjectRepository(CarImage)
    private readonly repo: Repository<CarImage>,
    @InjectRepository(Car)
    private readonly carRepo: Repository<Car>,
    private readonly s3Service: S3Service,
    private readonly imageProcessor: ImageProcessorService,
  ) {}

  async getPresignedUrl(
    carId: string,
    fileName: string,
    userId: string,
  ): Promise<{ uploadUrl: string; key: string }> {
    const car = await this.carRepo.findOne({ where: { id: carId } });
    if (!car) throw new NotFoundException('Car not found');
    if (car.sellerId !== userId) throw new ForbiddenException('Not your listing');
    return this.s3Service.getPresignedUploadUrl(carId, fileName);
  }

  async create(input: CreateCarImageInput, userId: string): Promise<CarImage> {
    const car = await this.carRepo.findOne({ where: { id: input.carId } });
    if (!car) throw new NotFoundException('Car not found');
    if (car.sellerId !== userId) throw new ForbiddenException('Not your listing');

    if (input.s3Key) {
      // S3 flow: download raw upload, process, save optimized versions
      const rawBuffer = await this.s3Service.getObject(input.s3Key);
      const processed = await this.imageProcessor.process(rawBuffer);

      const baseName = input.s3Key.split('/').pop()!;
      const mainKey = `images/${input.carId}/${baseName}`;
      const thumbKey = `thumbnails/${input.carId}/${baseName}`;

      const [mainUrl, thumbnailUrl] = await Promise.all([
        this.s3Service.putObject(mainKey, processed.main, 'image/jpeg'),
        this.s3Service.putObject(thumbKey, processed.thumbnail, 'image/jpeg'),
      ]);

      // Delete the staging upload
      await this.s3Service.deleteObject(input.s3Key).catch((err) => {
        this.logger.warn(`Failed to delete staging file ${input.s3Key}: ${err.message}`);
      });

      const image = this.repo.create({
        carId: input.carId,
        url: mainUrl,
        thumbnailUrl,
        publicId: mainKey,
        fileName: input.fileName,
        fileSize: processed.mainSize,
        width: processed.width,
        height: processed.height,
        mimeType: 'image/jpeg',
        isMain: input.isMain ?? false,
        sortOrder: input.sortOrder ?? 0,
      });
      return this.repo.save(image);
    }

    if (input.url) {
      // Legacy Cloudinary flow (backward compat)
      const image = this.repo.create(input);
      return this.repo.save(image);
    }

    throw new BadRequestException('Either s3Key or url must be provided');
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const image = await this.repo.findOne({
      where: { id },
      relations: ['car'],
    });
    if (!image) throw new NotFoundException('Image not found');
    if (image.car.sellerId !== userId) throw new ForbiddenException('Not your listing');

    // Delete S3 objects if publicId looks like an S3 key
    if (image.publicId && image.publicId.startsWith('images/')) {
      const thumbKey = image.publicId.replace('images/', 'thumbnails/');
      await Promise.all([
        this.s3Service.deleteObject(image.publicId).catch(() => {}),
        this.s3Service.deleteObject(thumbKey).catch(() => {}),
      ]);
    }

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
