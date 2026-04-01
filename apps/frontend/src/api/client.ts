import axios from 'axios';
import { Product, Order, CreateOrderDto } from '../types';

// Cliente HTTP para comunicación con el API Gateway
// Configuración centralizada para todas las llamadas a la API

const apiClient = axios.create({
  baseURL: '/api', // Proxy configurado en Vite
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo centralizado de errores
    if (error.response?.status === 404) {
      throw new Error('Recurso no encontrado');
    } else if (error.response?.status === 400) {
      throw new Error('Datos inválidos');
    } else if (error.response?.status === 422) {
      throw new Error(error.response.data.message || 'Error de validación');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Tiempo de espera agotado');
    } else {
      throw new Error('Error en el servidor');
    }
  }
);

// API de Productos
export const productsApi = {
  getAll: (): Promise<Product[]> => 
    apiClient.get('/products').then(res => res.data),
  
  getById: (id: number): Promise<Product> => 
    apiClient.get(`/products/${id}`).then(res => res.data),
  
  create: (product: Partial<Product>): Promise<Product> => 
    apiClient.post('/products', product).then(res => res.data),
  
  update: (id: number, product: Partial<Product>): Promise<Product> => 
    apiClient.put(`/products/${id}`, product).then(res => res.data),
  
  delete: (id: number): Promise<void> => 
    apiClient.delete(`/products/${id}`).then(() => {}),
};

// API de Órdenes
export const ordersApi = {
  getAll: (): Promise<Order[]> => 
    apiClient.get('/orders').then(res => res.data),
  
  getById: (id: number): Promise<Order> => 
    apiClient.get(`/orders/${id}`).then(res => res.data),
  
  create: (order: CreateOrderDto): Promise<Order> => 
    apiClient.post('/orders', order).then(res => res.data),
  
  updateStatus: (id: number, status: string): Promise<Order> => 
    apiClient.put(`/orders/${id}/status`, { status }).then(res => res.data),
};

// API de Health
export const healthApi = {
  check: (): Promise<any> => 
    apiClient.get('/health').then(res => res.data),
};

export default apiClient;
