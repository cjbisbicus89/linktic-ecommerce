import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultNamingStrategy } from 'typeorm';
import { Order, OrderItem } from './entities';

// Configuración TypeORM - IGUAL QUE PRODUCTS SERVICE
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433, // Puerto diferente para orders
      username: 'postgres',
      password: 'password',
      database: 'orders_db',
      entities: [Order, OrderItem],
      synchronize: false,
      logging: false,
      namingStrategy: new DefaultNamingStrategy(),
    }),
  ],
})
export class TypeOrmConfigModule {}
