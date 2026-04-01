import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Order } from './order.entity';

// Entidad OrderItem para TypeORM - Mapeo exacto a BD
@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'order_id', type: 'integer' })
  orderId: number;

  @Column({ name: 'product_id', type: 'integer' })
  productId: number;

  @Column({ type: 'integer', default: 1 })
  quantity: number;

  @Column({ name: 'unit_price', type: 'numeric', precision: 10, scale: 2, default: 0 })
  unitPrice: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relación temporalmente deshabilitada
  // @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  // order: Order;
}
