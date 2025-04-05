import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from './dto/CreateProduct.dto';
import { S3Service } from 'src/s3/s3.service';
import { Status } from '@prisma/client';

const defaultInclude = {
  bids: {
    include: {
      user: true,
    },
  },
  files: true,
  user: true,
  tags: true,
};

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  async createProduct(
    product: ProductDto,
    files: Express.Multer.File[],
    userId: string,
  ) {
    return await this.prisma.$transaction(async (transaction) => {
      const productData = await transaction.product.create({
        data: {
          title: product.title,
          description: product.description,
          minimalPrice: parseFloat(product.minimalPrice),
          userId,
        },
      });

      const uploadedFiles = await this.s3Service.uploadFiles(files);

      const filesData = await transaction.file.createMany({
        data: uploadedFiles.map((file) => {
          return {
            key: file.key,
            name: file.name,
            url: file.url,
            productId: productData.id,
          };
        }),
      });

      if (product.tags && product.tags.length > 0) {
        const existingTags = await transaction.tag.findMany({
          where: {
            name: {
              in: product.tags,
            },
          },
        });

        if (existingTags.length !== product.tags.length) {
          throw new Error('Some tags do not exist');
        }

        await transaction.product.update({
          where: { id: productData.id },
          data: {
            tags: {
              connect: existingTags.map((tag) => ({ id: tag.id })),
            },
          },
        });
      }

      return {
        ...productData,
        files: filesData,
      };
    });
  }

  async getProduct(id: string) {
    return await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: defaultInclude,
    });
  }

  async getMyProducts(userId: string) {
    return await this.prisma.product.findMany({
      where: {
        userId,
      },
      include: defaultInclude,
    });
  }

  async getAllProducts() {
    return await this.prisma.product.findMany({
      where: {
        status: Status.ACTIVE,
      },
      include: defaultInclude,
    });
  }

  async getHighlightProduct() {
    const products = await this.prisma.product.findMany({
      take: 1,
      orderBy: {
        bids: {
          _count: 'desc',
        },
      },
      where: {
        status: Status.ACTIVE,
      },
      include: defaultInclude,
    });
    return products[0] || null;
  }

  async getAllHighlightProducts() {
    return await this.prisma.product.findMany({
      orderBy: {
        bids: {
          _count: 'desc',
        },
      },
      where: {
        status: Status.ACTIVE,
      },
      include: defaultInclude,
    });
  }

  async getProductsWhereUserBid(userId: string) {
    const products = await this.prisma.product.findMany({
      where: {
        bids: {
          some: {
            userId: userId,
          },
        },
      },
      include: defaultInclude,
    });

    return products;
  }

  async updateStatus(productId: string, status: Status) {
    return await this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        status: status,
      },
    });
  }

  async deleteProduct(id: string, userId: string) {
    return this.prisma.$transaction(async (transaction) => {
      const product = await transaction.product.findUniqueOrThrow({
        where: {
          id,
        },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      if (product.userId !== userId) {
        throw new Error('You are not the owner of this product');
      }

      await transaction.file.deleteMany({
        where: {
          productId: id,
        },
      });

      await transaction.bid.deleteMany({
        where: {
          productId: id,
        },
      });

      await transaction.product.delete({
        where: {
          id,
        },
      });

      return product;
    });
  }

  async getProductTags(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { tags: true },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    const userTagIds = user.tags.map((tag) => tag.id);

    const products = await this.prisma.product.findMany({
      where: {
        tags: {
          some: { id: { in: userTagIds } },
        },
      },
      include: defaultInclude,
    });
    return products;
  }
}
