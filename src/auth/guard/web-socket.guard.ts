import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WebSocketGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: Socket = context.switchToWs().getClient();
    const cookie = client.handshake.headers.cookie;

    if (!cookie) {
      throw new UnauthorizedException('No cookies found');
    }

    const accessToken = cookie
      .split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith('accessToken='));
    if (!accessToken) {
      throw new UnauthorizedException('Access token not found');
    }

    const tokenValue = accessToken.split('=')[1];

    try {
      const decoded = this.jwtService.verify(tokenValue, { secret: 'secret' });
      client['user'] = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
