import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRole, DealerStatus } from '../enums/user-role.enum';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column({ length: 255, unique: true })
  email!: string;

  @Column({ length: 255 })
  password!: string;

  @Field({ nullable: true })
  @Column({ length: 30, nullable: true })
  phone?: string;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  name?: string;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  lastName?: string;

  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @Field({ nullable: true })
  @Column({ length: 500, nullable: true })
  avatarUrl?: string;

  @Field()
  @Column({ default: true })
  isActive!: boolean;

  @Field()
  @Column({ default: false })
  isEmailVerified!: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lastLoginAt?: Date;

  @Field({ nullable: true })
  @Column({ length: 10, nullable: true })
  languagePreference?: string;

  @Field({ nullable: true })
  @Column({ length: 10, nullable: true })
  countryPreference?: string;

  @Field()
  @Column({ default: false })
  marketingEmailsEnabled!: boolean;

  @Field()
  @Column({ default: false })
  smsNotificationsEnabled!: boolean;

  @Field()
  @Column({ default: false })
  cookieConsent!: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  cookieConsentAt?: Date;

  @Field({ nullable: true })
  @Column({ length: 200, nullable: true })
  dealerName?: string;

  @Field(() => DealerStatus, { nullable: true })
  @Column({ type: 'enum', enum: DealerStatus, nullable: true })
  dealerStatus?: DealerStatus;

  @Field({ nullable: true })
  @Column({ length: 500, nullable: true })
  dealerLogoUrl?: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  dealerDescription?: string;

  @Field({ nullable: true })
  @Column({ length: 255, nullable: true })
  dealerAddress?: string;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  dealerCity?: string;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  dealerRegion?: string;

  @Field({ nullable: true })
  @Column({ length: 100, nullable: true })
  dealerCountry?: string;

  @Field({ nullable: true })
  @Column({ length: 30, nullable: true })
  dealerPhoneNumber?: string;

  @Field({ nullable: true })
  @Column({ length: 500, nullable: true })
  dealerWebsite?: string;

  @Field(() => [String], { nullable: true })
  @Column('simple-array', { nullable: true })
  dealerWorkingHours?: string[];

  @Field(() => [String], { nullable: true })
  @Column('simple-array', { nullable: true })
  dealerServices?: string[];

  @Column({ length: 255, nullable: true })
  expoPushToken?: string;

  @Column({ length: 255, nullable: true })
  refreshToken?: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt!: Date;
}
