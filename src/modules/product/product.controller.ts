import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from 'src/modules/product/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get('')
  getAll() {
    return this.productService.getAll();
  }
  @Get('/:id')
  async getOne(id: number) {
    const product = await this.productService.getOne(id);
    if (!product) {
      throw new HttpException('Không tìm thấy sản phẩm', HttpStatus.NOT_FOUND);
    }
    return product;
  }
  @Post()
  create(
    @Body()
    productData: CreateProductDto,
  ) {
    return this.productService.create(productData);
  }
  @Put('/:id')
  update(@Param('id') id: number, @Body() body: Product) {
    return this.productService.update(id, body);
  }
  @Delete('/:id')
  remove(@Param('id') id: number) {
    return this.productService.remove(id);
  }
}
