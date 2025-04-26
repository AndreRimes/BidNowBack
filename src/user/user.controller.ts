import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/createuser.dto';
import { Public } from 'src/commons/decorators/public.decorator';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  async createUser(@Body() user: UserDto) {
    return await this.userService.createUser(user);
  }
}
