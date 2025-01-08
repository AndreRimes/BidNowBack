import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));

  await app.listen(3333);
}
bootstrap();