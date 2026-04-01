import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../typeorm/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

// Servicio de productos - contiene la lógica de negocio
// Implementa CRUD básico con validaciones adicionales
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    // Temporalmente sin relaciones para probar
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Verificar si ya existe un producto con el mismo nombre
    // Decidí agregar esta validación para evitar duplicados
    const existingProduct = await this.productRepository.findOne({
      where: { name: createProductDto.name },
    });

    if (existingProduct) {
      throw new ConflictException('Ya existe un producto con ese nombre');
    }

    // Crear el producto
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    // Primero verificamos que el producto existe
    const product = await this.findOne(id);

    // Si se está actualizando el nombre, verificamos que no exista otro
    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const existingProduct = await this.productRepository.findOne({
        where: { name: updateProductDto.name },
      });

      if (existingProduct) {
        throw new ConflictException('Ya existe un producto con ese nombre');
      }
    }

    // Actualizamos el producto
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  // Método adicional para validación de stock (usado por Orders Service)
  async validateStock(productId: number, quantity: number): Promise<boolean> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      select: ['id', 'name', 'stock', 'price'],
    });

    if (!product) {
      return false;
    }

    return product.stock >= quantity;
  }

  // Método para obtener información básica del producto
  async getProductInfo(productId: number) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      select: ['id', 'name', 'price', 'stock'],
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${productId} no encontrado`);
    }

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock,
      available: product.stock > 0,
    };
  }
}
