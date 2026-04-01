import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// Entidad Order para TypeORM - Solo lo que pide la prueba
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'customer_name', type: 'varchar', length: 100 })
  customerName: string;

  @Column({ name: 'customer_email', type: 'varchar', length: 100 })
  customerEmail: string;

  @Column({ name: 'total_amount', type: 'numeric', precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ name: 'status', type: 'varchar', length: 20, default: 'PENDING' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
