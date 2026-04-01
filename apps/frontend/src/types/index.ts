// Tipos compartidos del frontend
// Sincronizados con las interfaces del backend

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id: number;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface CreateOrderDto {
  customerName: string;
  customerEmail: string;
  items: CreateOrderItemDto[];
}

export interface CreateOrderItemDto {
  productId: number;
  quantity: number;
}
