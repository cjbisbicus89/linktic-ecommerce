import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

// Bootstrap del Orders Microservice
// Configuración similar a otros servicios pero específica para órdenes
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS para comunicación con API Gateway
  app.enableCors({
    origin: ['http://localhost:4000', 'http://localhost:3000'],
    credentials: true,
  });

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger para documentación del microservicio
  const config = new DocumentBuilder()
    .setTitle('Orders Microservice API')
    .setDescription('Microservicio para gestión de órdenes')
    .setVersion('1.0')
    .addTag('orders')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Puerto configurable - 4002 para orders service - escuchar en 0.0.0.0 para ser accesible
  const port = process.env.PORT || 4002;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Orders Service running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/docs`);
}

bootstrap();
