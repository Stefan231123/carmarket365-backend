import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Car } from '../car/car.entity';

@ObjectType()
@Entity()
export class CarImage {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  url!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  publicId?: string;

  @Field()
  @Column({ default: false })
  isMain!: boolean;

  @Field(() => Int)
  @Column({ default: 0 })
  sortOrder!: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  fileName?: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  fileSize?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  mimeType?: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  width?: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  height?: number;

  @Field()
  @Column()
  carId!: string;

  @ManyToOne(() => Car, (car) => car.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'carId' })
  car!: Car;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt!: Date;
}
