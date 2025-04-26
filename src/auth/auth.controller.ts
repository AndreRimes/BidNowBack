import { Controller, Post, Body, Res } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService, Payload } from './auth.service';
import { Response } from 'express';
import { Public } from 'src/commons/decorators/public.decorator';
import { GetUser } from 'src/commons/decorators/get-user.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(
    @Body() user: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { backendTokens } = await this.authService.login(user);
    this.authService.setAuthCookies(res, backendTokens);
    console.log(backendTokens);

    return user;
  }

  @Post('update-payload')
  async updatePayload(
    @GetUser() user: Payload,
    @Res({ passthrough: true }) res: Response,
  ) {
    const odlUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    const { backendTokens } = await this.authService.createTokens(odlUser);
    this.authService.setAuthCookies(res, backendTokens);
    return user;
  }
}
