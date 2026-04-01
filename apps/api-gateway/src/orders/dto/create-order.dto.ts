import { IsString, IsEmail, IsArray, IsInt, Min, ArrayMinSize, ValidateNested, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

// DTO para item de orden con validaciones específicas
// NOTA: Decidí crear una clase separada para mejor validación de arrays
export class OrderItemDto {
  @IsInt({ message: 'El productId debe ser un número entero' })
  @Min(1, { message: 'El productId debe ser mayor a 0' })
  productId!: number;

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  quantity!: number;
}

// DTO principal para crear órdenes
// Validación mejorada después de recibir errores de datos inválidos
export class CreateOrderDto {
  @IsString()
  @MinLength(2, { message: 'El nombre del cliente debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre del cliente no puede exceder 100 caracteres' })
  customerName!: string;

  @IsEmail({}, { message: 'El email del cliente debe ser válido' })
  customerEmail!: string;

  @IsArray({ message: 'Los items deben ser un array' })
  @ArrayMinSize(1, { message: 'La orden debe tener al menos un item' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
