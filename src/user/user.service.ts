import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/createuser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService) {}

    async createUser(user: UserDto) {
        return await this.prisma.user.create({
            data: {
                email: user.email,
                password: user.password,
                name: user.name,
            }
        })
    }

    async findUserTags(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { tags: true },
        });
        return user.tags;
    }

    async updateUserTags(userId, tagIds) {
          const user = await this.prisma.user.findUnique({
            where: { id: userId },
          });
      
          if (!user) {
            throw new Error(`User with ID ${userId} not found.`);
          }
      
          const tags = await this.prisma.tag.findMany({
            where: { id: { in: tagIds } },
          });
      
          if (tags.length !== tagIds.length) {
            throw new Error("One or more tags do not exist.");
          }
      
          await this.prisma.user.update({
            where: { id: userId },
            data: {
              tags: {
                set: [], 
                connect: tagIds.map((tagId) => ({ id: tagId })), 
              },
            },
          });
      
          console.log(`Tags successfully updated for user with ID ${userId}`);
        }    
      
}
