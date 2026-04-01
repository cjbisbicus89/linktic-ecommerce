import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderItem } from '../typeorm/entities';

// Módulo de órdenes - configura controller, service y repositories
// Incluye HttpModule para comunicación con Products Service
@Module({
  imports: [
    // Repositories para inyección en el servicio
    TypeOrmModule.forFeature([Order, OrderItem]),
    
    // HttpModule para comunicación con otros microservicios
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
