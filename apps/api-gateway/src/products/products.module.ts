import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProductsController } from './products.controller';

// Módulo de productos en el API Gateway
// Actúa como proxy, no contiene lógica de negocio
@Module({
  imports: [HttpModule],
  controllers: [ProductsController],
  providers: [],
  exports: [],
})
export class ProductsModule {}
