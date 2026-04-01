import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { productsApi } from '../api/client';

// Página de listado de productos
// Muestra todos los productos disponibles con opción de crear órdenes
// Decidí agregar más contexto y manejo de errores realista
export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Agregar cache para evitar llamadas innecesarias
      const data = await productsApi.getAll();
      
      // Verificar que los datos tengan el formato esperado
      if (!Array.isArray(data)) {
        throw new Error('Formato de datos inválido');
      }
      
      setProducts(data);
    } catch (err: any) {
      console.error('Error cargando productos:', err);
      
      // Manejo específico de errores
      if (err.code === 'ECONNABORTED') {
        setError('Tiempo de espera agotado - El servidor está tardando demasiado');
      } else if (err.response?.status === 401) {
        setError('No autorizado - Por favor inicia sesión nuevamente');
      } else if (err.response?.status >= 500) {
        setError('Error del servidor - Intenta más tarde');
      } else {
        setError(err.message || 'Error al cargar productos');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    loadProducts();
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div className="loading">Cargando productos...</div>
        {retryCount > 0 && (
          <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
            Intento #{retryCount + 1}
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        <div className="error" style={{ 
          padding: '15px', 
          backgroundColor: '#ffebee', 
          border: '1px solid #ffcdd2', 
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#c62828' }}>Error</h3>
          <p style={{ margin: '0 0 15px 0' }}>{error}</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn btn-primary" 
              onClick={handleRetry}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Reintentar
            </button>
            <Link 
              to="/login" 
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              Ir al Login
            </Link>
          </div>
        </div>
        
        {retryCount >= 2 && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#fff3cd', 
            border: '1px solid #ffeaa7', 
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <strong>Tip:</strong> Verifica que el API Gateway esté corriendo en http://localhost:4000
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div className="card-header">
        <div>
          <h1 className="card-title">Catálogo de Productos</h1>
          <p style={{ color: 'var(--linktic-gray)', margin: '5px 0 0 0' }}>
            {products.length} productos disponibles
          </p>
        </div>
        <Link to="/orders/new" className="btn btn-primary">
          Crear Nueva Orden
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="card" style={{ 
          padding: '40px', 
          textAlign: 'center',
          border: '2px dashed var(--linktic-light)',
          background: 'var(--linktic-light-gray)'
        }}>
          <h3 style={{ color: 'var(--linktic-gray)', marginBottom: '10px' }}>No hay productos disponibles</h3>
          <p style={{ color: 'var(--linktic-gray)', marginBottom: '20px' }}>
            Los productos aparecerán aquí cuando el servicio esté disponible.
          </p>
          <button 
            onClick={loadProducts}
            className="btn btn-primary"
          >
            Actualizar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="card">
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: 'var(--linktic-primary)' }}>
                  {product.name}
                </h3>
                <span style={{ 
                  fontSize: '12px',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  background: product.stock > 0 ? 'var(--linktic-success)' : 'var(--linktic-danger)',
                  color: 'white',
                  fontWeight: '600'
                }}>
                  {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                </span>
              </div>
              
              {product.description && (
                <p style={{ 
                  color: 'var(--linktic-gray)', 
                  fontSize: '14px', 
                  margin: '10px 0',
                  lineHeight: '1.5'
                }}>
                  {product.description}
                </p>
              )}
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginTop: '15px'
              }}>
                <div>
                  <span style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    color: 'var(--linktic-success)' 
                  }}>
                    ${Number(product.price).toFixed(2)}
                  </span>
                  {product.category && (
                    <div style={{ fontSize: '12px', color: 'var(--linktic-gray)', marginTop: '4px' }}>
                      {product.category.name}
                    </div>
                  )}
                </div>
                {product.stock > 0 ? (
                  <Link 
                    to="/orders/new" 
                    state={{ productId: product.id }}
                    className="btn btn-primary"
                    style={{ fontSize: '14px', padding: '6px 12px' }}
                  >
                    Agregar a Orden
                  </Link>
                ) : (
                  <span style={{ 
                    fontSize: '14px', 
                    color: 'var(--linktic-danger)',
                    fontWeight: '600'
                  }}>
                    No disponible
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
