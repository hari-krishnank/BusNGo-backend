import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('APP_PORT');

  app.use('/payments/webhook', express.raw({ type: 'application/json' }));

  app.enableCors({
    origin: configService.get('FRONTEND_URL')
  });
  await app.listen(port);
}
bootstrap();