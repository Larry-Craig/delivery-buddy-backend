import { NestFactory } from '@nestjs/core';
import {
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Enable API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Delivery Buddy API')
    .setDescription(
      'REST API powering the Delivery Buddy application.',
    )
    .setVersion('1.0.0')
    .addServer('/v1') // This ensures Swagger builds the correct path for versioned endpoints
    .addTag('Drivers')
    .addTag('Orders')
    .addTag('Shifts')
    .addTag('Wallet & Caching')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(
    app,
    config,
  );

  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.PORT) || 3000;

  await app.listen(port);

  logger.log(
    `🚀 Delivery Buddy API running on http://localhost:${port}`,
  );

  logger.log(
    `📚 Swagger Docs: http://localhost:${port}/docs`,
  );
}

bootstrap();