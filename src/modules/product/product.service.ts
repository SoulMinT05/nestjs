import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/modules/product/entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductSize } from 'src/product-size/entities/product-size.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductSize)
    private productSizeRepository: Repository<ProductSize>,
  ) {}
  getAll() {
    return this.productRepository.find({
      relations: ['category'],
    });
  }
  getOne(id: number) {
    return this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }
  async create(dto: CreateProductDto) {
    const { name, productSizes, ...productInfo } = dto;

    const sizes: ProductSize[] = [];
    if (productSizes && productSizes.length) {
      for (const sizeName of productSizes) {
        let size = await this.productSizeRepository.findOne({
          where: { name: sizeName },
        });
        if (!size) {
          size = await this.productSizeRepository.save(
            this.productSizeRepository.create({ name: sizeName }),
          );
        }
        sizes.push(size);
      }
    }

    const product = this.productRepository.create({
      name,
      productSizes: sizes,
      ...productInfo,
    });
    return this.productRepository.save(product);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['productSizes'], // để lấy luôn các size hiện có
    });

    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }

    // 🧩 Cập nhật các trường cơ bản
    Object.assign(product, dto);

    // 🧩 Nếu có productSizes được gửi lên → xử lý cập nhật size
    if (dto.productSizes && dto.productSizes.length) {
      const updatedSizes: ProductSize[] = [];

      for (const sizeName of dto.productSizes) {
        let size = await this.productSizeRepository.findOne({
          where: { name: sizeName },
        });

        // nếu size chưa có trong DB → tạo mới
        if (!size) {
          size = await this.productSizeRepository.save(
            this.productSizeRepository.create({ name: sizeName }),
          );
        }

        updatedSizes.push(size);
      }

      product.productSizes = updatedSizes;
    }

    return this.productRepository.save(product);
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
