import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Tên phải là ký tự' })
  @IsNotEmpty({ message: 'Cần nhập tên' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là ký tự' })
  description?: string;

  @IsString({ message: 'Thương hiệu phải là ký tự' })
  @IsNotEmpty({ message: 'Cần nhập thương hiệu' })
  brand: string;

  @IsNumber({}, { message: 'categoryId phải là ký tự' })
  @IsNotEmpty({ message: 'Cần chọn danh mục' })
  categoryId: number;

  @IsString({ message: 'categoryName phải là ký tự' })
  @IsNotEmpty({ message: 'Cần chọn danh mục' })
  categoryName: string;

  @IsOptional()
  @IsNumber()
  subCategoryId?: number;

  @IsOptional()
  @IsString()
  subCategoryName?: string;

  @IsOptional()
  @IsNumber()
  thirdSubCategoryId?: number;

  @IsOptional()
  @IsString()
  thirdSubCategoryName?: string;

  @IsNumber({}, { message: 'Giá phải là số' })
  oldPrice: number;

  @IsNumber({}, { message: 'Giảm giá phải là số' })
  discount: number;

  // 🏷️ Ảnh
  @IsOptional()
  @IsArray({ message: 'Ảnh phải là một mảng' })
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsArray({ message: 'productSizes phải là một mảng' })
  @IsString({ each: true })
  productSizes?: string[];

  // 🏷️ Tồn kho & thông tin phụ
  @IsOptional()
  @IsNumber({}, { message: 'Số lượng tồn kho phải là số' })
  countInStock?: number;

  @IsOptional()
  @IsNumber()
  quantitySold?: number;

  @IsOptional()
  @IsNumber()
  averageRating?: number;

  @IsOptional()
  @IsNumber()
  reviewCount?: number;

  // 🏷️ Cờ hiển thị
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
