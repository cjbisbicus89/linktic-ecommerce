import { IsString, IsNumber, IsInt, Min, MaxLength, IsOptional, MinLength as MinLen } from 'class-validator';
import { Type } from 'class-transformer';

// DTO para creación de productos
// Validaciones básicas para asegurar datos consistentes
export class CreateProductDto {
  @IsString()
  @MinLen(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  price: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  stock: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  category_id: number;
}
