import { Controller, Get, Post, Param, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductDto } from './dto/CreateProduct.dto';
import { Payload } from 'src/auth/auth.service';
import { GetUser } from 'src/commons/decorators/get-user.decorator';
import { Public } from 'src/commons/decorators/public.decorator';

@Controller("products")
export class ProductsController {

    constructor(private readonly productsService: ProductsService) { }

    
    @Post()
    @UseInterceptors(FilesInterceptor('files'))
    createProduct(
        @Body() product: ProductDto,
        @UploadedFiles() files: Express.Multer.File[],
        @GetUser() user: Payload,
    ) {
        return this.productsService.createProduct(product, files, user.id);
    }

    @Get()
    @Public()
    getProducts() {
        return this.productsService.getAllProducts();
    }

    @Get("all-highlight")
    @Public()
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

    @Get(":id")
    @Public()
    getProduct(@Param("id") id: string) {
        return this.productsService.getProduct(id);
    }


}
