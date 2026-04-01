
export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
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
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface ProductValidation {
  id: number;
  name: string;
  price: number;
  stock: number;
  available: boolean;
}
