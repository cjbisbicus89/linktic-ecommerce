import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body,
  HttpException,
  HttpStatus,
  UseGuards
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

// Interfaces para tipado - Mantengo para compatibilidad con microservicios
// TODO: Coordinar con equipo de microservicios para unificar DTOs
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: string;
  stock: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
}

// Controller que actúa como proxy hacia el Products Microservice
// Todas las operaciones se redirigen vía HTTP al servicio correspondiente
// Protegido con JWT Auth Guard según arquitectura
// NOTA: Elegí firstValueFrom sobre toPromise() por mejor manejo de errores
@ApiTags('products')
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly httpService: HttpService) {}

  private getProductsServiceUrl(): string {
    // TODO: Mover esta lógica a un service separado para mejor testabilidad
    return process.env.PRODUCTS_SERVICE_URL || 'http://localhost:4001';
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos encontrados' })
  async findAll() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.getProductsServiceUrl()}/products`)
      );
      return response.data;
    } catch (error) {
      // Decidí usar BAD_GATEWAY para diferenciar errores del gateway
      // vs errores del microservicio
      throw new HttpException(
        'Error al obtener productos del servicio',
        HttpStatus.BAD_GATEWAY
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  async findOne(@Param('id') id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.getProductsServiceUrl()}/products/${id}`)
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error al obtener producto del servicio',
        HttpStatus.BAD_GATEWAY
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.getProductsServiceUrl()}/products`, createProductDto)
      );
      return response.data;
    } catch (error: any) {
      // Manejo específico para errores de validación del microservicio
      if (error.response?.status === 400) {
        // Propagar errores de validación para que el frontend los muestre
        throw new HttpException(error.response.data, HttpStatus.BAD_REQUEST);
      }
      // TODO: Implementar retry logic para errores de conexión
      throw new HttpException(
        'Error al crear producto en el servicio',
        HttpStatus.BAD_GATEWAY
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar producto existente' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.put(`${this.getProductsServiceUrl()}/products/${id}`, updateProductDto)
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error al actualizar producto en el servicio',
        HttpStatus.BAD_GATEWAY
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar producto' })
  @ApiResponse({ status: 200, description: 'Producto eliminado exitosamente' })
  async remove(@Param('id') id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.getProductsServiceUrl()}/products/${id}`)
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error al eliminar producto del servicio',
        HttpStatus.BAD_GATEWAY
      );
    }
  }
}
