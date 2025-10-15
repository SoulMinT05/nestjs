import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString({ message: 'Tên phải là ký tự' })
  @IsNotEmpty({ message: 'Cần nhập tên' })
  name: string;

  @IsString({ message: 'Mô tả phải là ký tự' })
  @IsOptional()
  description: string;

  @IsNumber({}, { message: 'Giá phải là số' })
  oldPrice: number;
  @IsNumber({}, { message: 'Giảm giá phải là số' })
  discount: number;
  @IsOptional()
  @IsNumber({}, { message: 'Số lượng tồn kho phải là số' })
  count_in_stock: number;
  @IsOptional()
  @IsNumber()
  quantity_sold: number;
  @IsOptional()
  @IsNumber()
  average_rating: number;
  @IsOptional()
  @IsNumber()
  review_count: number;

  @IsOptional()
  @IsBoolean()
  isFeatured: boolean;
  @IsOptional()
  @IsBoolean()
  isPublished: boolean;
}
