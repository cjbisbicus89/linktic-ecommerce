// Interfaz compartida para órdenes entre microservicios
// Incluí items para mantener la relación con productos
// Decidí usar totalPrice para facilitar cálculos en el frontend

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
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

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

// Para validación de stock al crear órdenes
export interface ProductValidation {
  id: number;
  name: string;
  price: number;
  stock: number;
  available: boolean;
}
