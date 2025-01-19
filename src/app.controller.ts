import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './commons/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getHello(): string {
    return "AAAAAAAAAAAAAAA"
    // return this.appService.getHello();
  }
}
