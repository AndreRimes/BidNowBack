/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from './dto/CreateProduct.dto';
import { S3Service } from 'src/s3/s3.service';


@Injectable()
export class ProductsService { 

    constructor(
        private readonly prisma: PrismaService,
        private readonly s3Service: S3Service,
    ) { }


    async createProduct(product: ProductDto, files: Express.Multer.File[], userId: string) {

        return await this.prisma.$transaction(async (transaction) => { 

            const productData = await transaction.product.create({
                data: {
                    title: product.title,
                    description: product.description,
                    minimalPrice: parseFloat(product.minimalPrice),
                    userId,
                }
            })

            const uploadedFiles = await this.s3Service.uploadFiles(files);

            const filesData = await transaction.file.createMany({
                data: uploadedFiles.map((file) => {
                    return {
                        key: file.key,
                        name: file.name,
                        url: file.url,
                        productId: productData.id,
                    }

                })
            });

            return {
                ...productData,
                files: filesData,
            }
        });
    }


    async getProduct(id: string) {
        return await this.prisma.product.findUnique({
            where: {
                id,
            },
            include: {
                bids: {
                    include: {
                        user: true,
                    },
                },
                files: true,
            },
        })
    }


    async getMyProducts(userId: string) {
        return await this.prisma.product.findMany({
            where: {
                userId,
            },
            include: {
                bids: true,
                files: true,
            },
        })
    }


    async getAllProducts() {
        return await this.prisma.product.findMany({
            include: {
                bids: true,
                files: true,
            }
        })
    }

    async getHighlightProduct() {
        const products = await this.prisma.product.findMany({
            take: 1,
            orderBy: {
                bids: {
                    _count: 'desc',
                },
            },
            include: {
                bids: true,
                files: true,
            },
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
            include: {
                bids: true,
                files: true,
            }
        }) 
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
            include: {
                bids: true,
                files: true,
            },
        });


        return products;
    }

}
