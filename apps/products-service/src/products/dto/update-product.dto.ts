import { IsString, IsNumber, IsInt, Min, MaxLength, IsOptional, MinLength as MinLen } from 'class-validator';
import { Type } from 'class-transformer';

// DTO para actualización de productos
// Todos los campos son opcionales para actualizaciones parciales
export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @MinLen(3)
  @MaxLength(100)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  stock?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  category_id?: number;
}
