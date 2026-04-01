import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters';

// Bootstrap del Products Microservice
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
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Filtro de excepciones global
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger para documentación del microservicio
  const config = new DocumentBuilder()
    .setTitle('Products Microservice API')
    .setDescription('Microservicio para gestión de productos')
    .setVersion('1.0')
    .addTag('products')
    .addServer('http://localhost:4001')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Puerto fijo - 4001 para products service - escuchar en 0.0.0.0 para ser accesible
  const port = 4001;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Products Service running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/docs`);
}

bootstrap();
