import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmConfigModule } from './typeorm/typeorm.module';

// Módulo principal del Orders Microservice
// Configura TypeORM y conecta el módulo de órdenes
@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
    }),
    
    // Configuración de TypeORM para este servicio
    TypeOrmConfigModule,
    
    // Módulo de órdenes con validación de productos
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
