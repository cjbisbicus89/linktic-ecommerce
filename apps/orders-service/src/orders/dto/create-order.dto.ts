import { IsString, IsEmail, IsArray, IsInt, Min, MaxLength, ValidateNested, MinLength as MinLen } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// DTO para los items de una orden
export class CreateOrderItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  productId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}

// DTO principal para creación de órdenes
// Incluye validaciones de cliente y items
export class CreateOrderDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @MinLen(3)
  @MaxLength(100)
  customerName: string;

  @ApiProperty({ example: 'juan@email.com' })
  @IsEmail()
  @MaxLength(100)
  customerEmail: string;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
