// Tipos locales para evitar @linktic/shared

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface ProductValidation {
  id: number;
  name: string;
  price: number;
  stock: number;
  available: boolean;
}

export interface CreateOrderDto {
  customerName: string;
  customerEmail: string;
  items: {
    productId: number;
    quantity: number;
  }[];
}
