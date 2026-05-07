import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GraphqlExceptionFilter } from './common/graphql-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet({
    contentSecurityPolicy: false, // GraphQL playground needs inline scripts
    crossOriginEmbedderPolicy: false,
  }));

  // CORS — explicit allowlist
  const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000')
    .split(',')
    .map(o => o.trim());
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Global exception filter — sanitizes error responses
  app.useGlobalFilters(new GraphqlExceptionFilter());

  // Global validation pipe — enforces class-validator decorators
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
