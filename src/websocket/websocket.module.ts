import { Module } from '@nestjs/common';
import { BidGateway } from './websocket-gateway';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [],
  providers: [BidGateway],
})
export class WebsocketModule {}
