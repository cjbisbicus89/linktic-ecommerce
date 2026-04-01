import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { RateLimitingModule } from './rate-limiting/rate-limiting.module';

// Módulo principal del API Gateway con todas las características
// Decidí configurar ThrottlerGuard globalmente para simplicidad
// TODO: Evaluar si necesitamos guards específicos por endpoint en el futuro
@Module({
  imports: [
    // Configuración de variables de entorno
    // Importante: El orden importa para que las variables estén disponibles
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
    }),
    
    // HTTP Client para comunicación con microservicios
    // Timeout de 5 segundos - Decidí este valor después de probar con diferentes latencias
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    
    // Autenticación JWT
    AuthModule,
    
    // Rate Limiting
    RateLimitingModule,
    
    // Módulos de funcionalidades
    ProductsModule,
    OrdersModule,
    HealthModule,
  ],
  controllers: [],
  providers: [
    // Rate Limiting global
    // NOTA: Esto aplica a todos los endpoints excepto health
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
