import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { CookieUtils } from 'src/commons/utils/CookieUtils';
import { Response } from 'express';

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type Payload = {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  iat: number;
  exp: number;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: LoginDto) {
    const findUser = await this.validateUser(user);

    const tokens = await this.createTokens(findUser);

    return tokens;
  }

  async validateUser(user: LoginDto) {
    const findUser = await this.prisma.user.findUniqueOrThrow({
      where: {
        email: user.email,
      },
    });

    const isValid = await bcrypt.compare(user.password, findUser.password);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    console.log(findUser);
    return findUser;
  }

  async createTokens(user: User) {
    const tokens = {
      user,
      backendTokens: {
        accessToken: await this.jwtService.signAsync(user, {
          expiresIn: '1d',
          secret: 'secret',
        }),
        refreshToken: await this.jwtService.signAsync(user, {
          expiresIn: '1d',
          secret: 'secret',
        }),
      },
      expiresIn: new Date().setTime(
        new Date().getTime() + 1000 * 60 * 60 * 24 * 7,
      ),
    };

    return tokens;
  }

  setAuthCookies(res: Response, tokens: Tokens) {
    CookieUtils.setHeaderWithCookie(
      res,
      { accessToken: tokens.accessToken },
      60 * 60 * 24 * 7,
    );

    CookieUtils.setHeaderWithCookie(
      res,
      { refreshToken: tokens.refreshToken },
      60 * 60 * 24 * 7,
    );
  }

  clearAuthCookies(res: Response) {
    CookieUtils.clearCookie(res, 'accessToken');
    CookieUtils.clearCookie(res, 'refreshToken');
  }
}
