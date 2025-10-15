import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/modules/product/entities/product.entity';
import { ProductSize } from 'src/product-size/entities/product-size.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductSize])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
