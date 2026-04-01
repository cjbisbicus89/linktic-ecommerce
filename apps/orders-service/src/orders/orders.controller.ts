import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Param, 
  Body,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from '../typeorm/entities/order.entity';

// Controller del Orders Microservice
// Expone endpoints para gestión de órdenes con validación de productos
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las órdenes' })
  @ApiResponse({ status: 200, description: 'Lista de órdenes encontradas' })
  async findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener orden por ID' })
  @ApiResponse({ status: 200, description: 'Orden encontrada' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  async findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nueva orden' })
  @ApiResponse({ status: 201, description: 'Orden creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o sin productos' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @ApiResponse({ status: 422, description: 'Stock insuficiente' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto);
  }

  // Endpoint adicional para actualizar estado
  @Put(':id/status')
  @ApiOperation({ summary: 'Actualizar estado de una orden' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @ApiResponse({ status: 404, description: 'Orden no encontrada' })
  @ApiResponse({ status: 400, description: 'Estado inválido' })
  async updateStatus(
    @Param('id') id: string, 
    @Body('status') status: string
  ): Promise<Order> {
    return this.ordersService.updateStatus(+id, status);
  }
}
