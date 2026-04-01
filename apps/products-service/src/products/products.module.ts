import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product, Category } from '../typeorm/entities';

// Módulo de productos - configura el CRUD y TypeORM
@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
