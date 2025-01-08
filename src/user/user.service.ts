import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/createuser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) {}

    async createUser(user: UserDto) {
        const hash = await bcrypt.hash(user.password, 10);
        return this.prisma.user.create({
            data: {
                email: user.email,
                password: hash,
                name: user.name,
            }
        })
    }

}
