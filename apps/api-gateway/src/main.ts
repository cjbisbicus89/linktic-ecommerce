import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters';
import { ResponseInterceptor } from './interceptors/response.interceptor';

// Bootstrap del API Gateway
// Configuración centralizada con manejo de errores global
// Agregué ResponseInterceptor para estandarizar respuestas
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS para comunicación con frontend y microservicios
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4001', 'http://localhost:4002'],
    credentials: true,
  });

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Filtro de excepciones global
  app.useGlobalFilters(new HttpExceptionFilter());

  // Interceptor de respuesta para formato estándar
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Prefijo global para la API
  app.setGlobalPrefix('api');

  // Swagger para documentación
  const config = new DocumentBuilder()
    .setTitle('Linktic E-commerce API')
    .setDescription('API Gateway para plataforma e-commerce')
    .setVersion('1.0')
    .addTag('products')
    .addTag('orders')
    .addTag('health')
    .addTag('auth')
    .addServer('http://localhost:4000')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Puerto configurable - escuchar en 0.0.0.0 para ser accesible desde navegador
  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 API Gateway running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/docs`);
  console.log(`🔗 API endpoints at http://localhost:${port}/api`);
}

bootstrap();
