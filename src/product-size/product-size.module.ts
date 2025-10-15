import { Module } from '@nestjs/common';
import { ProductSizeService } from './product-size.service';
import { ProductSizeController } from './product-size.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSize } from './entities/product-size.entity';
import { Product } from 'src/modules/product/entities/product.entity';

@Module({
  controllers: [ProductSizeController],
  providers: [ProductSizeService],
  imports: [TypeOrmModule.forFeature([Product, ProductSize])],
})
export class ProductSizeModule {}
