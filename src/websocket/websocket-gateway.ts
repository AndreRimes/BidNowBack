import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Payload } from "src/auth/auth.service";
import { GetUser } from "src/commons/decorators/get-user.decorator";
import { PrismaService } from "src/prisma/prisma.service";
import { Socket, Server } from 'socket.io';
import { JwtService } from "@nestjs/jwt";
import { WebSocketGuard } from "src/auth/guard/web-socket.guard";
import { UseGuards } from "@nestjs/common";
import { AtGuard } from "src/auth/guard/jwt.guard";

export type BidDto = {
    productId: string;
    amount: number;
}



@WebSocketGateway(3334, { cors: { credentials: true, allowedHeaders: true, origin: "http://localhost:3000" }, cookie: true, })
@UseGuards(WebSocketGuard)
export class BidGateway {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('placeBid')
  async handleBid(
    @MessageBody() bidDto: BidDto,
    @ConnectedSocket() client: Socket,
  ) {
    const user = client["user"] as Payload;
    try {
      const product = await this.prisma.product.findUnique({
        where: { id: bidDto.productId },
        include: { bids: true },
      });

      if (!product) {
        client.emit('bidError', 'Product not found');
        return;
      }

      const currentMaxBid = product.bids.reduce(
        (max, bid) => (bid.amount > max ? bid.amount : max),
        product.minimalPrice
      );

      if (bidDto.amount <= currentMaxBid) {
        client.emit('bidError', 'Bid must be higher than current bid');
        return;
      }

      const newBid = await this.prisma.bid.create({
        data: {
          amount: bidDto.amount,
          user: { connect: { id: user.id } },
          product: { connect: { id: bidDto.productId } },
        },
        include: { user: true },
      });

      this.server.emit('bidUpdate', newBid);
    } catch (error) {
      client.emit('bidError', 'An error occurred while placing the bid');
    }
  }
}