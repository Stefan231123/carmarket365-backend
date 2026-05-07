import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarInquiry } from './car-inquiry.entity';
import { CarInquiryService } from './car-inquiry.service';
import { CarInquiryResolver } from './car-inquiry.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CarInquiry])],
  providers: [CarInquiryService, CarInquiryResolver],
  exports: [CarInquiryService],
})
export class CarInquiryModule {}
