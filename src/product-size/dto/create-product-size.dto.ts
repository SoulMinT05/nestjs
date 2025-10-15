import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductSizeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  productIds: number[];
}
