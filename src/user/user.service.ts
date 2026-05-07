import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { User } from './entities/user.entity';
import { Car } from '../car/car.entity';
import { CarInquiry } from '../car-inquiry/car-inquiry.entity';
import { CreateUserInput } from './dto/create-user.input';
import { AdminStats } from './dto/admin-stats.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
    @InjectRepository(CarInquiry)
    private readonly inquiryRepository: Repository<CarInquiry>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    const newUser = this.userRepository.create({
      ...createUserInput,
      password: hashedPassword,
    });
    const saved = await this.userRepository.save(newUser);
    this.logger.log(`User created: ${saved.id} (${saved.email})`);
    return saved;
  }

  async findAll(limit?: number, offset?: number): Promise<User[]> {
    return this.userRepository.find({
      take: Math.min(limit ?? 50, 200),
      skip: offset ?? 0,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findPublicProfile(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'name', 'firstName', 'lastName', 'avatarUrl', 'role', 'createdAt',
        'dealerName', 'dealerCity', 'dealerDescription', 'dealerLogoUrl',
        'dealerPhoneNumber', 'dealerWebsite', 'dealerWorkingHours', 'dealerServices'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmailOrPhone(identifier: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: [
        { email: identifier },
        { phone: identifier },
      ],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async updateProfile(userId: string, fields: Partial<User>): Promise<User> {
    const user = await this.findOne(userId);
    Object.assign(user, fields);
    // Update name from firstName/lastName if provided
    if (fields.firstName !== undefined || fields.lastName !== undefined) {
      const first = fields.firstName ?? user.firstName ?? '';
      const last = fields.lastName ?? user.lastName ?? '';
      user.name = `${first} ${last}`.trim() || user.name;
    }
    return this.userRepository.save(user);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = await this.findOne(userId);
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return false;
    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);
    return true;
  }

  async deleteAccount(userId: string): Promise<boolean> {
    const result = await this.userRepository.delete(userId);
    this.logger.log(`Account deleted: ${userId}`);
    return !!result.affected;
  }

  async exportUserData(userId: string): Promise<string> {
    const user = await this.findOne(userId);
    const { password, ...userData } = user;
    return JSON.stringify(userData, null, 2);
  }

  async updateLanguagePreference(userId: string, languageCode: string, countryCode?: string): Promise<User> {
    const user = await this.findOne(userId);
    user.languagePreference = languageCode;
    if (countryCode !== undefined) user.countryPreference = countryCode;
    return this.userRepository.save(user);
  }

  async updateCookieConsent(userId: string, accepted: boolean): Promise<User> {
    const user = await this.findOne(userId);
    user.cookieConsent = accepted;
    user.cookieConsentAt = new Date();
    return this.userRepository.save(user);
  }

  async updateMarketingPreferences(userId: string, marketingEmails: boolean, smsNotifications: boolean): Promise<User> {
    const user = await this.findOne(userId);
    user.marketingEmailsEnabled = marketingEmails;
    user.smsNotificationsEnabled = smsNotifications;
    return this.userRepository.save(user);
  }

  async getAdminStats(): Promise<AdminStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const [totalUsers, totalDealers, newUsersThisMonth, newUsersThisWeek] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { role: 'DEALER' as any } }),
      this.userRepository.count({ where: { createdAt: MoreThanOrEqual(startOfMonth) } }),
      this.userRepository.count({ where: { createdAt: MoreThanOrEqual(startOfWeek) } }),
    ]);

    const [totalListings, activeListings] = await Promise.all([
      this.carRepository.count(),
      this.carRepository.count({ where: { isAvailable: true } }),
    ]);

    const totalInquiries = await this.inquiryRepository.count();

    const avgResult = await this.carRepository
      .createQueryBuilder('car')
      .select('AVG(car.price)', 'avg')
      .where('car.isAvailable = :available', { available: true })
      .getRawOne();

    const viewsResult = await this.carRepository
      .createQueryBuilder('car')
      .select('SUM(car.viewCount)', 'total')
      .getRawOne();

    return {
      totalUsers,
      totalDealers,
      totalListings,
      activeListings,
      pendingListings: 0,
      flaggedListings: 0,
      totalRevenue: 0,
      newUsersThisMonth,
      newUsersThisWeek,
      totalViews: parseInt(viewsResult?.total || '0', 10),
      totalInquiries,
      averageListingPrice: parseFloat(avgResult?.avg || '0'),
    };
  }
}
