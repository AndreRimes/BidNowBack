import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {

  constructor(private prisma: PrismaService) { }

  getHello(): string {
    return 'Hello World!';
  }


  async seed() {
    const tags = [
      { name: 'Eletrônicos' },
      { name: 'Moda' },
      { name: 'Acessórios' },
      { name: 'Casa e Jardim' },
      { name: 'Esporte e Lazer' },
      { name: 'Eletrônicos e Casa' },
      { name: 'Casa e Jardim' },
      { name: 'Esporte e Lazer' },
      { name: 'Acessórios e Casa' },
      { name: 'Moda e Acessórios' },
      { name: 'Esporte e Acessórios' },
      { name: 'Esporte' },
    ];
  
    await this.prisma.tag.createMany({
      data: tags,
      skipDuplicates: true, 
    });
  }
}
