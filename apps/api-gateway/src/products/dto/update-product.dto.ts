import { IsString, IsNumber, IsInt, Min, MaxLength, MinLength, IsOptional } from 'class-validator';

// DTO para actualizar productos - todos los campos son opcionales
// Esto permite actualizaciones parciales según requisitos del frontend
export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El precio debe ser un número válido' })
  @Min(0.01, { message: 'El precio debe ser mayor a 0' })
  price?: number;

  @IsOptional()
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock?: number;

  @IsOptional()
  @IsInt({ message: 'El categoryId debe ser un número entero' })
  @Min(1, { message: 'El categoryId debe ser mayor a 0' })
  categoryId?: number;
}
