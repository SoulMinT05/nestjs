import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/modules/product/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  getAll() {
    return this.productRepository.find();
  }
  getOne(id: number) {
    return this.productRepository.findOneBy({ id });
  }
  create(productData: Partial<Product>) {
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }
  async update(
    id: number,
    productData: Partial<Product>,
  ): Promise<Product | null> {
    await this.productRepository.update(id, productData);
    return this.productRepository.findOneBy({ id });
  }
  async remove(id: number) {
    const product = await this.productRepository.delete(id);
    if (product.affected === 0) {
      throw new HttpException('Không tìm thấy sản phẩm', HttpStatus.NOT_FOUND);
    }
    return {
      success: true,
      message: `Deleted product with id: ${id}`,
    };
  }
}
