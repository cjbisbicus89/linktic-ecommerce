import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultNamingStrategy } from 'typeorm';
import { Product, Category } from './entities';

// Configuración TypeORM - ORIGINAL QUE FUNCIONABA
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'password',
      database: 'products_db',
      entities: [Product, Category],
      synchronize: false,
      logging: false,
      namingStrategy: new DefaultNamingStrategy(),
    }),
  ],
})
export class TypeOrmConfigModule {}
