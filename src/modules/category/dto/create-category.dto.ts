import { IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  parentCategoryName?: string;

  @IsOptional()
  parentId?: number;
}
