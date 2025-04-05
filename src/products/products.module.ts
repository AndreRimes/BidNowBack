import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsService } from './products.service';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [PrismaModule, S3Module],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
