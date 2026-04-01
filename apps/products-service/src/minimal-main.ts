import { NestFactory } from '@nestjs/core';
import { Module, Controller, Get } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './typeorm/entities/product.entity';

// Controller mínimo
@Controller('products')
class ProductsController {
  @Get()
  async getProducts() {
    return [{ id: 1, name: 'Test Product', price: 100 }];
  }
}

// Module mínimo
@Module({
  imports: [],
  controllers: [ProductsController],
})
class AppModule {}

// Bootstrap mínimo
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  await app.listen(4001);
  console.log('🚀 Products Service en http://localhost:4001');
}

bootstrap().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
