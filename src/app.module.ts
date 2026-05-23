import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ThrottlerModule } from '@nestjs/throttler';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CarModule } from './car/car.module';
import { CarImageModule } from './car-image/car-image.module';
import { SavedCarModule } from './saved-car/saved-car.module';
import { CarInquiryModule } from './car-inquiry/car-inquiry.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ListingExpiryModule } from './listing-expiry/listing-expiry.module';
import { HealthController } from './common/health.controller';
import { PrivacyController } from './common/privacy.controller';

@Module({
  controllers: [HealthController, PrivacyController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';

        if (isProduction) {
          const required = ['JWT_SECRET', 'DB_HOST', 'DB_PASSWORD', 'GOOGLE_CLIENT_ID'];
          for (const key of required) {
            if (!configService.get<string>(key)) {
              throw new Error(`${key} environment variable is required in production`);
            }
          }
        }

        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', ''),
          database: configService.get<string>('DB_NAME', 'carmarket365'),
          autoLoadEntities: true,
          synchronize: !isProduction,
        };
      },
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get<string>('NODE_ENV') === 'production';
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          context: ({ req }) => ({ req }),
          introspection: !isProduction,
          playground: !isProduction,
        };
      },
    }),
    UserModule,
    AuthModule,
    CarModule,
    CarImageModule,
    SavedCarModule,
    CarInquiryModule,
    ListingExpiryModule,
  ],
})
export class AppModule {}
