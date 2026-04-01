import axios from 'axios';

// Servicio de autenticación según arquitectura
// NOTA: Usé URL directa por ahora - TODO: Mover a proxy de Vite
const API_BASE_URL = 'http://localhost:4000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

class AuthService {
  private token: string | null = null;

  constructor() {
    // Recuperar token del localStorage si existe
    this.token = localStorage.getItem('token');
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      console.log('Login response:', response.data);
      
      // El interceptor envuelve la respuesta en {success: true, data: {...}}
      const responseData = response.data.data || response.data;
      
      // Verificar que la respuesta tenga el formato esperado
      if (!responseData.token) {
        console.error('No token in response:', response.data);
        throw new Error('Respuesta inválida del servidor');
      }
      
      const { token } = responseData;
      
      this.token = token;
      localStorage.setItem('token', token);
      
      return responseData;
    } catch (error: any) {
      console.error('Login service error:', error);
      // Manejo específico de errores
      if (error.response?.status === 401) {
        throw new Error('Credenciales inválidas');
      } else if (error.response?.status === 400) {
        throw new Error('Datos de login inválidos');
      } else {
        throw new Error('Error de conexión - Verifica que el API Gateway esté corriendo');
      }
    }
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
    // TODO: Limpiar otros datos del usuario si es necesario
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // TODO: Agregar método para verificar token con el servidor
  async verifyToken(): Promise<boolean> {
    if (!this.token) return false;
    
    try {
      await axios.post(`${API_BASE_URL}/auth/verify`, { token: this.token });
      return true;
    } catch {
      this.logout();
      return false;
    }
  }
}

export const authService = new AuthService();
