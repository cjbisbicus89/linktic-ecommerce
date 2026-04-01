import { IsString, IsNumber, IsInt, Min, MaxLength, MinLength } from 'class-validator';

// DTO para crear productos con validaciones mejoradas
// Decidí agregar validaciones específicas después de ver errores en frontend
export class CreateProductDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  name!: string;

  @IsString()
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  description?: string;

  @IsNumber({}, { message: 'El precio debe ser un número válido' })
  @Min(0.01, { message: 'El precio debe ser mayor a 0' })
  price!: number;

  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock!: number;

  @IsInt({ message: 'El categoryId debe ser un número entero' })
  @Min(1, { message: 'El categoryId debe ser mayor a 0' })
  categoryId!: number;
}
