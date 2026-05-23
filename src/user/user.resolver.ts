import { Resolver, Query, Mutation, Args, Int, ObjectType, Field } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { AdminStats } from './dto/admin-stats.dto';
import { RecentActivity } from './dto/recent-activity.dto';
import { SystemHealth } from './dto/system-health.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserRole } from './enums/user-role.enum';
import { S3Service } from '../s3/s3.service';
import { ImageProcessorService } from '../s3/image-processor.service';
@ObjectType()
class AvatarUploadUrl {
  @Field()
  uploadUrl!: string;

  @Field()
  key!: string;
}

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
    private readonly imageProcessor: ImageProcessorService,
  ) {}

  @Query(() => [User])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAllUsers(
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number,
  ): Promise<User[]> {
    return this.userService.findAll(limit, offset);
  }

  @Query(() => User, { name: 'getUser' })
  @UseGuards(JwtAuthGuard)
  async findOne(
    @CurrentUser() currentUser: any,
    @Args('id') id: string,
  ): Promise<User> {
    if (currentUser.userId !== id && currentUser.role !== UserRole.ADMIN) {
      return this.userService.findPublicProfile(id);
    }
    return this.userService.findOne(id);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return this.userService.create(createUserInput);
  }

  @Query(() => User, { name: 'getCurrentUser' })
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() currentUser: any): Promise<User> {
    return this.userService.findOne(currentUser.userId);
  }

  @Mutation(() => User, { name: 'updateMyProfile' })
  @UseGuards(JwtAuthGuard)
  async updateMyProfile(
    @CurrentUser() currentUser: any,
    @Args('firstName', { nullable: true }) firstName?: string,
    @Args('lastName', { nullable: true }) lastName?: string,
    @Args('phone', { nullable: true }) phone?: string,
    @Args('avatarUrl', { nullable: true }) avatarUrl?: string,
    @Args('dealerName', { nullable: true }) dealerName?: string,
    @Args('dealerAddress', { nullable: true }) dealerAddress?: string,
    @Args('dealerCity', { nullable: true }) dealerCity?: string,
    @Args('dealerPhoneNumber', { nullable: true }) dealerPhoneNumber?: string,
    @Args('dealerWebsite', { nullable: true }) dealerWebsite?: string,
    @Args('dealerDescription', { nullable: true }) dealerDescription?: string,
  ): Promise<User> {
    const fields: Partial<User> = {};
    if (firstName !== undefined) fields.firstName = firstName;
    if (lastName !== undefined) fields.lastName = lastName;
    if (phone !== undefined) fields.phone = phone;
    if (avatarUrl !== undefined) fields.avatarUrl = avatarUrl;
    if (dealerName !== undefined) fields.dealerName = dealerName;
    if (dealerAddress !== undefined) fields.dealerAddress = dealerAddress;
    if (dealerCity !== undefined) fields.dealerCity = dealerCity;
    if (dealerPhoneNumber !== undefined) fields.dealerPhoneNumber = dealerPhoneNumber;
    if (dealerWebsite !== undefined) fields.dealerWebsite = dealerWebsite;
    if (dealerDescription !== undefined) fields.dealerDescription = dealerDescription;
    return this.userService.updateProfile(currentUser.userId, fields);
  }

  @Mutation(() => Boolean, { name: 'changePassword' })
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @CurrentUser() currentUser: any,
    @Args('currentPassword') currentPassword: string,
    @Args('newPassword') newPassword: string,
  ): Promise<boolean> {
    return this.userService.changePassword(currentUser.userId, currentPassword, newPassword);
  }

  @Mutation(() => Boolean, { name: 'deleteMyAccount' })
  @UseGuards(JwtAuthGuard)
  async deleteMyAccount(@CurrentUser() currentUser: any): Promise<boolean> {
    return this.userService.deleteAccount(currentUser.userId);
  }

  @Mutation(() => Boolean, { name: 'requestPasswordReset' })
  async requestPasswordReset(@Args('email') _email: string): Promise<boolean> {
    return true;
  }

  @Query(() => String, { name: 'exportMyData' })
  @UseGuards(JwtAuthGuard)
  async exportMyData(@CurrentUser() currentUser: any): Promise<string> {
    return this.userService.exportUserData(currentUser.userId);
  }

  @Mutation(() => User, { name: 'updateLanguagePreference' })
  @UseGuards(JwtAuthGuard)
  async updateLanguagePreference(
    @CurrentUser() currentUser: any,
    @Args('languageCode') languageCode: string,
    @Args('countryCode', { nullable: true }) countryCode?: string,
  ): Promise<User> {
    return this.userService.updateLanguagePreference(currentUser.userId, languageCode, countryCode);
  }

  @Mutation(() => User, { name: 'updateCookieConsent' })
  @UseGuards(JwtAuthGuard)
  async updateCookieConsent(
    @CurrentUser() currentUser: any,
    @Args('accepted') accepted: boolean,
  ): Promise<User> {
    return this.userService.updateCookieConsent(currentUser.userId, accepted);
  }

  @Mutation(() => User, { name: 'updateMarketingPreferences' })
  @UseGuards(JwtAuthGuard)
  async updateMarketingPreferences(
    @CurrentUser() currentUser: any,
    @Args('marketingEmails') marketingEmails: boolean,
    @Args('smsNotifications') smsNotifications: boolean,
  ): Promise<User> {
    return this.userService.updateMarketingPreferences(currentUser.userId, marketingEmails, smsNotifications);
  }

  @Mutation(() => Boolean, { name: 'savePushToken' })
  @UseGuards(JwtAuthGuard)
  async savePushToken(
    @CurrentUser() currentUser: any,
    @Args('expoPushToken') expoPushToken: string,
  ): Promise<boolean> {
    await this.userService.updateProfile(currentUser.userId, { expoPushToken });
    return true;
  }

  @Mutation(() => AvatarUploadUrl)
  @UseGuards(JwtAuthGuard)
  async getAvatarUploadUrl(
    @Args('fileName') fileName: string,
    @CurrentUser() currentUser: any,
  ): Promise<AvatarUploadUrl> {
    // Reuse S3 presigned URL with userId as the "folder" key
    return this.s3Service.getPresignedUploadUrl(`avatars/${currentUser.userId}`, fileName);
  }

  @Mutation(() => String, { name: 'processAvatar' })
  @UseGuards(JwtAuthGuard)
  async processAvatar(
    @Args('s3Key') s3Key: string,
    @CurrentUser() currentUser: any,
  ): Promise<string> {
    const rawBuffer = await this.s3Service.getObject(s3Key);
    const processed = await this.imageProcessor.process(rawBuffer);
    const baseName = s3Key.split('/').pop()!;
    const finalKey = `avatars/${currentUser.userId}/${baseName}`;
    const url = await this.s3Service.putObject(finalKey, processed.main, 'image/jpeg');
    await this.s3Service.deleteObject(s3Key).catch(() => {});
    await this.userService.updateProfile(currentUser.userId, { avatarUrl: url });
    return url;
  }

  @Mutation(() => Boolean, { name: 'subscribeToMobileApp' })
  async subscribeToMobileApp(@Args('email') _email: string): Promise<boolean> {
    return true;
  }

  @Query(() => AdminStats, { name: 'getAdminStats' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getAdminStats(): Promise<AdminStats> {
    return this.userService.getAdminStats();
  }

  @Query(() => [RecentActivity], { name: 'getRecentActivity' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getRecentActivity(): Promise<RecentActivity[]> {
    return [];
  }

  @Query(() => SystemHealth, { name: 'getSystemHealth' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getSystemHealth(): Promise<SystemHealth> {
    return {
      status: 'healthy',
      cpuUsage: 0,
      memoryUsage: 0,
      diskUsage: 0,
      activeConnections: 0,
      responseTime: 0,
      errorRate: 0,
      lastUpdated: new Date().toISOString(),
    };
  }
}
