import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { TypeOrmConfigModule } from './typeorm/typeorm.module';

// Módulo principal del Products Microservice
@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,  // Asegurar que cargue .env
      envFilePath: ['.env'],
    }),
    
    // Configuración de TypeORM para este servicio
    TypeOrmConfigModule,
    
    // Módulo de productos con CRUD
    ProductsModule,
  ],
})
export class AppModule {}
