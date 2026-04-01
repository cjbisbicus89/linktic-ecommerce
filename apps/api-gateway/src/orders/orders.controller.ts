import { 
  Controller, 
  Get, 
  Post, 
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
import { CreateOrderDto } from './dto/create-order.dto';

// Interfaces para tipado - Mantengo para compatibilidad con microservicios
// TODO: Coordinar con equipo de microservicios para unificar DTOs
export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  totalAmount: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

// Controller que actúa como proxy hacia el Orders Microservice
// Similar al de productos, maneja las operaciones de órdenes
// Protegido con JWT Auth Guard según arquitectura
@ApiTags('orders')
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly httpService: HttpService) {}

  private getOrdersServiceUrl(): string {
    return process.env.ORDERS_SERVICE_URL || 'http://localhost:4002';
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las órdenes' })
  @ApiResponse({ status: 200, description: 'Lista de órdenes encontradas' })
  async findAll() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.getOrdersServiceUrl()}/orders`)
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Error al obtener órdenes del servicio',
        HttpStatus.BAD_GATEWAY
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener orden por ID' })
  @ApiResponse({ status: 200, description: 'Orden encontrada' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  async findOne(@Param('id') id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.getOrdersServiceUrl()}/orders/${id}`)
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new HttpException('Orden no encontrada', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error al obtener orden del servicio',
        HttpStatus.BAD_GATEWAY
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva orden' })
  @ApiResponse({ status: 201, description: 'Orden creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.getOrdersServiceUrl()}/orders`, createOrderDto)
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        // Propagar errores de validación del servicio
        throw new HttpException(error.response.data, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Error al crear orden en el servicio',
        HttpStatus.BAD_GATEWAY
      );
    }
  }
}
