// Interfaz compartida para productos entre microservicios
// Elegí estas propiedades básicas para cumplir los requisitos mínimos
// Podría extenderse con más campos si el negocio lo requiere

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category_id?: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
