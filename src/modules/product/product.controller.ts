import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from 'src/modules/product/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('product')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);
  constructor(private readonly productService: ProductService) {}
  @Get('')
  getAll(@Req() req: Request & { user: string }) {
    console.log(req.user);
    return this.productService.getAll();
  }
  @Get('/:id')
  async getOne(@Param('id') id: number) {
    const product = await this.productService.getOne(id);
    if (!product) {
      this.logger.error(`getOne - id: ${id}`);
      throw new NotFoundException('Không tìm thấy sản phẩm');
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
