import { Module } from '@nestjs/common';
import { TagsController } from './tags.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TagsService } from './tags.service';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [PrismaModule, S3Module],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
