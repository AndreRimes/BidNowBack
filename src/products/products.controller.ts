
import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/CreateProduct.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/commons/decorators/get-user.decorator';
import { Payload } from 'src/auth/auth.service';
import { Public } from 'src/commons/decorators/public.decorator';

@Controller("products")
export class ProductsController {

    constructor(
        private readonly productsService: ProductsService,
    ) {}

    @Post()
    @UseInterceptors(FilesInterceptor('files'))
    createProduct(
        @Body() product: ProductDto,
        @UploadedFiles() files: Express.Multer.File[],
        @GetUser() user: Payload,
    ) {
        return this.productsService.createProduct(product, files, user.id);
    }

    @Get(":id")
    getProduct(@Param("id") id: string) {
        return this.productsService.getProduct(id);
    }

    @Get()
    getProducts() {
        return this.productsService.getAllProducts();
    }

    @Get("all-highlight")
    getHighlightProducts() {
        return this.productsService.getAllHighlightProducts();
    }

    @Get('highlight')
    getHighlightProduct(){
        return this.productsService.getHighlightProduct();
    }


    @Get("where-user-bid")
    getProductsWhereUserBid(@GetUser() user: Payload) { 
        return this.productsService.getProductsWhereUserBid(user.id);
    }

    @Get("my-products")
    getMyProducts(@GetUser() user: Payload) {
        return this.productsService.getMyProducts(user.id);
    }



}
