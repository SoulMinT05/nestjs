import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { FindOperator, IsNull, Repository } from 'typeorm';

import { cloudinary } from 'src/config/cloudinary.config';
import slugify from 'slugify';

export interface ICategoryWhere {
  name: string;
  parent?:
    | {
        id: number;
      }
    | FindOperator<any>;
}

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  findAll() {
    return this.categoryRepository.find({
      relations: ['parent'],
    });
    // return this.categoryRepository
    //   .createQueryBuilder('category')
    //   .leftJoin('category.parent', 'parent')
    //   .select(['category.id', 'category.name', 'category.slug', 'parent.id'])
    //   .addSelect('parent.id', 'parentId')
    //   .getRawMany();
  }

  findOne(id: number) {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ['parent'],
    });
  }
  async create(categoryData: CreateCategoryDto, files?: Express.Multer.File[]) {
    const { name, parentCategoryName, parentId } = categoryData;
    if (!name) {
      throw new BadRequestException('Cần điền tên danh mục');
    }

    const slug = slugify(name, { lower: true, strict: true, locale: 'vi' });

    // Check existing category
    const whereCondition: ICategoryWhere = {
      name: name.trim(),
    };
    if (parentId) {
      whereCondition.parent = { id: parentId };
    } else {
      whereCondition.parent = IsNull();
    }

    const existingCat = await this.categoryRepository.findOne({
      where: whereCondition,
      relations: ['parent'],
    });
    if (existingCat) {
      throw new BadRequestException('Tên danh mục đã tồn tại trong cùng cấp');
    }

    // Slug parent
    const parentCategorySlug = parentCategoryName
      ? slugify(parentCategoryName, { lower: true, strict: true, locale: 'vi' })
      : '';

    // Xử lý ảnh upload lên Cloudinary
    let imageUrls: string[] = [];
    if (files && files.length > 0) {
      imageUrls = await Promise.all(
        files.map(async (file) => {
          const uploaded = await cloudinary.uploader.upload(file.path);
          return uploaded.secure_url;
        }),
      );
    }

    // Check existing parent
    let parent: Category | null = null;
    if (parentId) {
      parent = await this.categoryRepository.findOneBy({ id: parentId });
      if (!parent) {
        throw new NotFoundException('Danh mục cha không tồn tại');
      }
    }

    const newCategory = this.categoryRepository.create({
      name,
      slug,
      parentCategoryName: parentCategoryName || '',
      parentCategorySlug,
      images: imageUrls,
      // ...(parent && { parent }),
      parent: parent ? parent : undefined,
    });

    return this.categoryRepository.save(newCategory);
  }

  async update(id: number, categoryData: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent'],
    });
    if (!category) {
      throw new NotFoundException(`Danh mục với ${id} không tồn tại`);
    }

    let parent: Category | null = null;
    let parentCategoryName: string | null = null;
    let parentCategorySlug: string | null = null;

    const name = categoryData.name ?? category.name;
    const slug = categoryData.name
      ? slugify(name, {
          lower: true,
          strict: true,
          locale: 'vi',
        })
      : category.slug;

    if (categoryData.parentId) {
      parent = await this.categoryRepository.findOne({
        where: { id: categoryData.parentId },
      });
      if (!parent) {
        throw new NotFoundException('Danh mục cha không tồn tại');
      }
      parentCategoryName = parent.name;
      parentCategorySlug = parentCategoryName
        ? slugify(parentCategoryName, {
            lower: true,
            strict: true,
            locale: 'vi',
          })
        : '';
    }
    const updatedCategory = this.categoryRepository.merge(category, {
      ...categoryData,
      name,
      slug,
      parent: parent ?? null,
      parentCategoryName: parentCategoryName ?? undefined,
      parentCategorySlug: parentCategorySlug ?? undefined,
    });

    return this.categoryRepository.save(updatedCategory);
  }

  async remove(id: number) {
    const category = await this.categoryRepository.delete(id);
    if (category.affected === 0) {
      throw new NotFoundException({
        message: `Danh mục với ${id} không tồn tại`,
      });
    }
    return {
      success: true,
      message: `Đã xóa danh mục với ${id}`,
    };
  }
  async removeAll() {
    const categories = await this.categoryRepository.deleteAll();
    if (categories.affected === 0) {
      throw new NotFoundException({
        message: 'Không tồn tại danh mục để xóa',
      });
    }
    return {
      success: true,
      message: `Đã xóa ${categories.affected} danh mục`,
    };
  }
}
