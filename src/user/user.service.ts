import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/createuser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(user: UserDto) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    return await this.prisma.user.create({
      data: {
        email: user.email,
        password: hashedPassword,
        name: user.name,
      },
    });
  }
}
