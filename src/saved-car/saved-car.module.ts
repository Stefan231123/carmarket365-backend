import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SavedCar } from './saved-car.entity';
import { SavedCarService } from './saved-car.service';
import { SavedCarResolver } from './saved-car.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([SavedCar])],
  providers: [SavedCarService, SavedCarResolver],
})
export class SavedCarModule {}
