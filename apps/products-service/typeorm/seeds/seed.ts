import { DataSource } from 'typeorm';
import { Product } from '../src/typeorm/entities/product.entity';
import { Category } from '../src/typeorm/entities/category.entity';

// Seed data para Products Service
// Datos iniciales para pruebas y demostración
export async function seed(dataSource: DataSource) {
  const categoryRepository = dataSource.getRepository(Category);
  const productRepository = dataSource.getRepository(Product);

  console.log('🌱 Iniciando seed de Products Service...');

  // Crear categorías si no existen
  const existingCategories = await categoryRepository.count();
  if (existingCategories === 0) {
    console.log('Creando categorías...');
    
    const electronics = await categoryRepository.save({
      name: 'Electrónicos',
      description: 'Dispositivos electrónicos y gadgets',
    });

    const books = await categoryRepository.save({
      name: 'Libros',
      description: 'Libros y material de lectura',
    });

    const clothing = await categoryRepository.save({
      name: 'Ropa',
      description: 'Prendas de vestir y accesorios',
    });

    console.log('Categorías creadas:', [electronics, books, clothing]);

    // Crear productos si no existen
    const existingProducts = await productRepository.count();
    if (existingProducts === 0) {
      console.log('Creando productos...');
      
      await productRepository.save([
        {
          name: 'Laptop Pro 15"',
          description: 'Laptop de alto rendimiento para profesionales',
          price: 1299.99,
          stock: 10,
          category_id: electronics.id,
        },
        {
          name: 'Smartphone Ultra',
          description: 'Teléfono inteligente con cámara avanzada',
          price: 899.99,
          stock: 25,
          category_id: electronics.id,
        },
        {
          name: 'Auriculares Bluetooth',
          description: 'Auriculares inalámbricos con cancelación de ruido',
          price: 199.99,
          stock: 50,
          category_id: electronics.id,
        },
        {
          name: 'Clean Code - Robert Martin',
          description: 'Libro sobre mejores prácticas en desarrollo de software',
          price: 39.99,
          stock: 100,
          category_id: books.id,
        },
        {
          name: 'The Pragmatic Programmer',
          description: 'Guía para programadores pragmáticos',
          price: 42.99,
          stock: 75,
          category_id: books.id,
        },
        {
          name: 'Camiseta Premium',
          description: 'Camiseta de algodón orgánico de alta calidad',
          price: 29.99,
          stock: 200,
          category_id: clothing.id,
        },
        {
          name: 'Jeans Classic',
          description: 'Pantalones vaqueros clásicos',
          price: 79.99,
          stock: 150,
          category_id: clothing.id,
        },
      ]);

      console.log('✅ Seed de productos completado');
    } else {
      console.log('ℹ️  Los productos ya existen, omitiendo seed');
    }
  } else {
    console.log('ℹ️  Las categorías ya existen, omitiendo seed');
  }

  console.log('🎉 Seed de Products Service finalizado');
}
