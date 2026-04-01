import { Injectable, NotFoundException, BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Order } from '../typeorm/entities/order.entity';
import { OrderItem } from '../typeorm/entities/order-item.entity';
import { CreateOrderDto, ProductValidation } from '../types';

// Servicio de órdenes - maneja lógica de negocio y validación de productos
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly httpService: HttpService,
  ) {}

  private getProductsServiceUrl(): string {
    return process.env.PRODUCTS_SERVICE_URL || 'http://localhost:4001';
  }

  async findAll(): Promise<Order[]> {
    // Temporalmente sin relaciones como products-service
    return this.orderRepository.find();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    return order;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Validación básica - según prueba técnica
    if (!createOrderDto.customerName || !createOrderDto.customerEmail) {
      throw new BadRequestException('Customer name and email are required');
    }

    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      throw new BadRequestException('Order must have at least one item');
    }

    // Validar productos con Products Service - según arquitectura
    const validatedItems = await this.validateProducts(createOrderDto.items);

    // Calcular total real - según negocio
    const totalAmount = validatedItems.reduce(
      (total, item) => total + (item.unitPrice * item.quantity),
      0
    );

    // Crear orden
    const order = this.orderRepository.create({
      customerName: createOrderDto.customerName,
      customerEmail: createOrderDto.customerEmail,
      totalAmount,
      status: 'PENDING',
    });

    const savedOrder = await this.orderRepository.save(order);

    // Crear items de la orden
    const orderItems = validatedItems.map(item => 
      this.orderItemRepository.create({
        orderId: savedOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })
    );

    await this.orderItemRepository.save(orderItems);

    return this.findOne(savedOrder.id);
  }

  private async validateProducts(items: any[]): Promise<any[]> {
    const validatedItems = [];

    for (const item of items) {
      try {
        // Validar producto vía HTTP al Products Service
        const response = await firstValueFrom(
          this.httpService.get(`${this.getProductsServiceUrl()}/products/${item.productId}`)
        );

        const productInfo = response.data;

        // Validar que haya stock suficiente
        if (productInfo.stock < item.quantity) {
          throw new UnprocessableEntityException(
            `Producto ${item.productId} no tiene stock suficiente. Disponible: ${productInfo.stock}, Solicitado: ${item.quantity}`
          );
        }

        validatedItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: productInfo.price,
        });
      } catch (error) {
        if (error.response?.status === 404) {
          throw new NotFoundException(`Producto con ID ${item.productId} no encontrado`);
        }
        throw error;
      }
    }

    return validatedItems;
  }

  // Método adicional para actualizar estado de orden
  async updateStatus(id: number, status: string): Promise<Order> {
    const order = await this.findOne(id);
    
    // Validar que el estado sea válido
    const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Estado inválido: ${status}`);
    }

    order.status = status as any;
    return this.orderRepository.save(order);
  }
}
