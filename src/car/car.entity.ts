import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';
import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn,
  ManyToOne, OneToMany, JoinColumn, Index,
} from 'typeorm';
import { User } from '../user/entities/user.entity';
import { CarImage } from '../car-image/car-image.entity';

@ObjectType()
@Entity()
@Index(['isAvailable', 'createdAt'])
@Index(['isAvailable', 'make'])
@Index(['isAvailable', 'isFeatured'])
@Index(['sellerId'])
@Index(['isAvailable', 'quickSale'])
@Index(['countryCode'])
export class Car {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ length: 100 })
  make!: string;

  @Field()
  @Column({ length: 100 })
  model!: string;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  variant?: string;

  @Field(() => Int)
  @Column()
  year!: number;

  @Field(() => Float)
  @Column('decimal', { precision: 12, scale: 2 })
  price!: number;

  @Field(() => Int)
  @Column({ default: 0 })
  mileage!: number;

  @Field()
  @Column({ length: 50 })
  fuelType!: string;

  @Field()
  @Column({ length: 50 })
  transmission!: string;

  @Field()
  @Column({ length: 255 })
  location!: string;

  // Optional string fields
  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  condition?: string;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  vehicleType?: string;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  drivetrain?: string;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  color?: string;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  interiorColor?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ length: 30, nullable: true })
  contactPhone?: string;

  @Field({ nullable: true })
  @Column({ length: 255, nullable: true })
  contactEmail?: string;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  city?: string;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  region?: string;

  @Field({ nullable: true })
  @Column({ length: 10, nullable: true })
  countryCode?: string;

  // Optional number fields
  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  engineSize?: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  horsePower?: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  doors?: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  seats?: number;

  @Field(() => Float, { nullable: true })
  @Column('decimal', { precision: 12, scale: 2, nullable: true })
  originalPrice?: number;

  @Field(() => Float, { nullable: true })
  @Column('float', { nullable: true })
  latitude?: number;

  @Field(() => Float, { nullable: true })
  @Column('float', { nullable: true })
  longitude?: number;

  @Field(() => Int)
  @Column({ default: 0 })
  viewCount!: number;

  @Field(() => Int)
  @Column({ default: 0 })
  favoriteCount!: number;

  // Boolean fields
  @Field()
  @Column({ default: true })
  isAvailable!: boolean;

  @Field()
  @Column({ default: false })
  isFeatured!: boolean;

  @Field()
  @Column({ default: false })
  isCertified!: boolean;

  @Field()
  @Column({ default: false })
  allowTestDrive!: boolean;

  @Field()
  @Column({ default: false })
  acceptsTradeIn!: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  priceNegotiable?: boolean;

  @Field()
  @Column({ default: false })
  quickSale!: boolean;

  // JSON array fields
  @Field(() => [String])
  @Column('simple-json', { default: '[]' })
  features!: string[];

  @Field(() => [String])
  @Column('simple-json', { default: '[]' })
  safetyFeatures!: string[];

  // Date fields
  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  soldAt?: Date;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt!: Date;

  // Relations
  @Column()
  sellerId!: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'sellerId' })
  @Field(() => User)
  seller!: User;

  @OneToMany(() => CarImage, (img) => img.car, { eager: true })
  @Field(() => [CarImage])
  images!: CarImage[];
}
