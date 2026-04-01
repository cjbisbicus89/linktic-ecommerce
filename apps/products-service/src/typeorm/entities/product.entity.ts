import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Category } from './category.entity';

// Entidad Product para TypeORM
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'price', type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({ name: 'stock', type: 'integer', default: 0 })
  stock: number;

  // Columna foreign key - EXACTAMENTE COMO EN LA BD
  @Column({ name: 'category_id', type: 'integer', nullable: true })
  categoryId: number;

  // Relación con categoría - CON JOIN COLUMN EXPLÍCITO
  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp without time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp without time zone' })
  updatedAt: Date;
}
