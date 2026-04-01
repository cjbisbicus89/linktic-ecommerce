import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrdersController } from './orders.controller';

// Módulo de órdenes en el API Gateway
// Actúa como proxy hacia el Orders Microservice
@Module({
  imports: [HttpModule],
  controllers: [OrdersController],
  providers: [],
  exports: [],
})
export class OrdersModule {}
