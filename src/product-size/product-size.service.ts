import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductSizeDto } from './dto/create-product-size.dto';
import { UpdateProductSizeDto } from './dto/update-product-size.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductSize } from './entities/product-size.entity';
import { In, Repository } from 'typeorm';
import { Product } from 'src/modules/product/entities/product.entity';

@Injectable()
export class ProductSizeService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductSize)
    private readonly productSizeRepository: Repository<ProductSize>,
  ) {}
  findAll() {
    return this.productSizeRepository.find({
      relations: ['products'],
      order: { id: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.productSizeRepository.findOne({
      where: { id },
      relations: ['products'],
    });
  }
  async create(dto: CreateProductSizeDto) {
    const { name } = dto;
    const existing = await this.productSizeRepository.findOne({
      where: { name },
    });
    if (existing) return existing; // tránh tạo trùng size

    const newSize = this.productSizeRepository.create({ name });
    return this.productSizeRepository.save(newSize);
  }

  async update(id: number, dto: UpdateProductSizeDto): Promise<ProductSize> {
    const size = await this.productSizeRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!size) {
      throw new NotFoundException('Size này không tồn tại');
    }

    // 🧩 Cập nhật tên size nếu có
    if (dto.name) {
      size.name = dto.name;
    }

    // 🧩 Nếu có danh sách productIds → cập nhật liên kết ManyToMany
    if (dto.productIds && dto.productIds.length) {
      const products = await this.productRepository.findBy({
        id: In(dto.productIds),
      });

      if (!products || products.length === 0) {
        throw new NotFoundException('Một vài sản phẩm không tồn tại');
      }

      size.products = products;
    }

    return this.productSizeRepository.save(size);
  }

  async remove(id: number) {
    const size = await this.productSizeRepository.findOneBy({ id });
    if (!size) {
      throw new NotFoundException('Size này không tồn tại');
    }
    return this.productSizeRepository.remove(size);
  }

  async removeAll() {
    const sizes = await this.productSizeRepository.deleteAll();
    if (sizes.affected === 0) {
      throw new BadRequestException('Không tồn tại size để xóa');
    }
    return {
      message: `Đã xóa ${sizes.affected} size`,
    };
  }
}
