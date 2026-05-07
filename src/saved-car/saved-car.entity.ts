import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Unique, Index } from 'typeorm';
import { Car } from '../car/car.entity';

@ObjectType()
@Entity()
@Unique(['userId', 'carId'])
@Index(['userId'])
@Index(['carId'])
export class SavedCar {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Field()
  @Column()
  carId!: string;

  @ManyToOne(() => Car, { eager: true })
  @JoinColumn({ name: 'carId' })
  @Field(() => Car)
  car!: Car;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt!: Date;
}
