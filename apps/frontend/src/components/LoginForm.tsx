import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, LoginCredentials } from '../services/authService';

// Formulario de login según arquitectura
// Decidí mantenerlo simple por ahora - TODO: Agregar validaciones más robustas
const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: 'admin@linktic.com', // Valor por defecto para facilitar testing
    password: 'admin123' // Contraseña por defecto
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica - Mejorar después
    if (!credentials.email || !credentials.password) {
      setError('Por favor completa todos los campos');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await authService.login(credentials);
      console.log('Login successful, navigating to dashboard');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      // Manejo específico de errores según respuesta del servidor
      setError('Credenciales inválidas - Intenta con admin@linktic.com / admin123');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <img src="/src/assets/logo.svg" alt="LinkTIC" style={{ height: '50px', marginBottom: '20px' }} />
        <h2 className="card-title" style={{ marginBottom: '10px' }}>LinkTIC E-commerce</h2>
        <p style={{ color: 'var(--linktic-gray)', fontSize: '14px' }}>Plataforma de gestión comercial</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>
        
        {error && (
          <div className="error">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ width: '100%', marginBottom: '15px' }}
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
        
        <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--linktic-gray)' }}>
          <p><strong>Demo:</strong> admin@linktic.com / admin123</p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
