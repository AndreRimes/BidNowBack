import { ProductsController} from './products/products.controller';
import { ProcutsService } from './products/products.service';
import { ProductsModule } from './products/products.module';
import { S3Module } from './s3/s3.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/guard/jwt.guard';

@Module({
  imports: [
    ProductsModule,
    S3Module,
    PrismaModule,
    AuthModule,
    UserModule,],
  controllers: [
    ProductsController, AppController],
  providers: [
    ProcutsService,
    PrismaService, AppService,

    { provide: APP_GUARD, useClass: AtGuard },
  ],
})
export class AppModule { }
