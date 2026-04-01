
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id: number;
  category?: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
