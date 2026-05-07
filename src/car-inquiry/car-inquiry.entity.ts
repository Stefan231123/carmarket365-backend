import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,
  ManyToOne, JoinColumn, Index,
} from 'typeorm';
import { Car } from '../car/car.entity';
import { User } from '../user/entities/user.entity';

export enum InquiryStatus {
  PENDING = 'PENDING',
  REPLIED = 'REPLIED',
  CLOSED = 'CLOSED',
  SPAM = 'SPAM',
}

export enum InquiryType {
  GENERAL = 'GENERAL',
  TEST_DRIVE = 'TEST_DRIVE',
  FINANCING = 'FINANCING',
  TRADE_IN = 'TRADE_IN',
  PRICE_NEGOTIATION = 'PRICE_NEGOTIATION',
  TECHNICAL_DETAILS = 'TECHNICAL_DETAILS',
  INSPECTION = 'INSPECTION',
}

registerEnumType(InquiryStatus, { name: 'InquiryStatus' });
registerEnumType(InquiryType, { name: 'InquiryType' });

@ObjectType()
@Entity()
@Index(['carId'])
@Index(['userId'])
@Index(['status'])
export class CarInquiry {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => InquiryType)
  @Column({ type: 'enum', enum: InquiryType, default: InquiryType.GENERAL })
  type!: InquiryType;

  @Field()
  @Column('text')
  message!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Field(() => InquiryStatus)
  @Column({ type: 'enum', enum: InquiryStatus, default: InquiryStatus.PENDING })
  status!: InquiryStatus;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  sellerResponse?: string;

  @Field(() => Date, { nullable: true })
  @Column({ nullable: true })
  repliedAt?: Date;

  @Column()
  carId!: string;

  @ManyToOne(() => Car, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carId' })
  @Field(() => Car)
  car!: Car;

  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt!: Date;
}
