import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Car {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  brand: string;

  @Field()
  @Column()
  model: string;

  @Field(() => Int)
  @Column()
  year: number;

  @Field()
  @Column()
  fuelType: string;

  @Field(() => Int)
  @Column()
  price: number;

  @Field()
  @Column()
  transmission: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl?: string;
}




