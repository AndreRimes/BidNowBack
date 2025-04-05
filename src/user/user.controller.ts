import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/createuser.dto';
import { Public } from 'src/commons/decorators/public.decorator';
import { GetUser } from 'src/commons/decorators/get-user.decorator';
import { Payload } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  async createUser(@Body() user: UserDto) {
    return await this.userService.createUser(user);
  }

  @Get('/tags')
  getUserTags(@GetUser() user: Payload) {
    return this.userService.findUserTags(user.id);
  }

  @Post('/tags')
  updateUserTags(
    @GetUser() user: Payload,
    @Body() body: { tags: { id: string; name: string }[] },
  ) {
    console.log(body);
    return this.userService.updateUserTags(
      user.id,
      body.tags.map((tag) => tag.id),
    );
  }
}
