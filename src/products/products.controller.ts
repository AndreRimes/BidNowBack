import { Controller, Get, Post, Param, Body, UploadedFiles, UseInterceptors, Patch, UsePipes, ValidationPipe, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductDto } from './dto/CreateProduct.dto';
import { Payload } from 'src/auth/auth.service';
import { GetUser } from 'src/commons/decorators/get-user.decorator';
import { Public } from 'src/commons/decorators/public.decorator';
import { Status } from '@prisma/client';
import { FileValidationPipe } from './pipes/File.pipe';
import { UpdateProductStatusDto } from './dto/UpdateProductStatus.dto';

@Controller("products")
export class ProductsController {

    constructor(private readonly productsService: ProductsService) { }

    
    @Post()
    @UseInterceptors(FilesInterceptor('files'))
    // @UsePipes(FileValidationPipe)
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
    
    @Get("tags")
        getProductTags(@GetUser() user: Payload) {
            return this.productsService.getProductTags(user.id);
        }

    @Patch('/status/:id')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateProductStatus(@Param('id') id: string, @Body() status: UpdateProductStatusDto) {
        return this.productsService.updateStatus(id, status.status);
    }


    @Get(":id")
    @Public()
    getProduct(@Param("id") id: string) {
        return this.productsService.getProduct(id);
    }

    
    @Delete(":id")
    deleteProduct(@Param("id") id: string, @GetUser() user: Payload) {
        return this.productsService.deleteProduct(id, user.id);
    }


}
