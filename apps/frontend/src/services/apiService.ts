import axios from 'axios';
import { authService } from './authService';

// Servicio API con interceptor JWT según arquitectura
const API_BASE_URL = 'http://localhost:4000/api';

class ApiService {
  constructor() {
    axios.defaults.baseURL = API_BASE_URL;
    
    // Interceptor para agregar JWT a todas las requests
    axios.interceptors.request.use((config) => {
      const token = authService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para manejar errores de autenticación
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          authService.logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Products endpoints
  async getProducts() {
    const response = await axios.get('/products');
    return response.data.data || response.data;
  }

  async getProduct(id: number) {
    const response = await axios.get(`/products/${id}`);
    return response.data.data || response.data;
  }

  // Orders endpoints
  async getOrders() {
    const response = await axios.get('/orders');
    return response.data.data || response.data;
  }

  async getOrder(id: number) {
    const response = await axios.get(`/orders/${id}`);
    return response.data.data || response.data;
  }

  async createOrder(orderData: any) {
    const response = await axios.post('/orders', orderData);
    return response.data.data || response.data;
  }

  // Health check
  async getHealth() {
    const response = await axios.get('/health');
    return response.data.data || response.data;
  }
}

export const apiService = new ApiService();
