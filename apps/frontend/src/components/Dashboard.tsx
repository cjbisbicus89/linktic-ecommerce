import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { authService } from '../services/authService';

// Dashboard principal según arquitectura
const Dashboard: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsData, ordersData] = await Promise.all([
        apiService.getProducts(),
        apiService.getOrders()
      ]);
      setProducts(productsData);
      setOrders(ordersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  if (loading) {
    return <div className="loading">Cargando dashboard...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div className="card-header">
        <div>
          <h1 className="card-title">Dashboard</h1>
          <p style={{ color: 'var(--linktic-gray)', margin: '5px 0 0 0' }}>
            Resumen de productos y órdenes
          </p>
        </div>
        <button onClick={handleLogout} className="btn btn-danger">
          Cerrar Sesión
        </button>
      </div>

      <div className="grid grid-cols-2">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Productos ({products.length})</h2>
            <span style={{ 
              background: 'var(--linktic-light)', 
              color: 'var(--linktic-primary)', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              Inventario
            </span>
          </div>
          <div style={{ maxHeight: '400px', overflow: 'auto' }}>
            {products.map((product: any) => (
              <div key={product.id} className="card" style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ color: 'var(--linktic-primary)', margin: '0 0 5px 0' }}>
                      {product.name}
                    </h3>
                    <p style={{ margin: '0', color: 'var(--linktic-gray)', fontSize: '0.875rem' }}>
                      {product.description}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      color: 'var(--linktic-success)', 
                      fontWeight: '700', 
                      fontSize: '1.125rem' 
                    }}>
                      ${parseFloat(product.price).toFixed(2)}
                    </div>
                    <div style={{ 
                      fontSize: '0.875rem',
                      color: product.stock > 10 ? 'var(--linktic-success)' : 'var(--linktic-warning)',
                      fontWeight: '600'
                    }}>
                      Stock: {product.stock}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Órdenes ({orders.length})</h2>
            <span style={{ 
              background: 'var(--linktic-light)', 
              color: 'var(--linktic-primary)', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '20px',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              Ventas
            </span>
          </div>
          <div style={{ maxHeight: '400px', overflow: 'auto' }}>
            {orders.map((order: any) => (
              <div key={order.id} className="card" style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ color: 'var(--linktic-primary)', margin: '0 0 5px 0' }}>
                      Orden #{order.id}
                    </h3>
                    <p style={{ margin: '0', color: 'var(--linktic-gray)', fontSize: '0.875rem' }}>
                      {order.customerName}
                    </p>
                    <p style={{ margin: '0', color: 'var(--linktic-gray)', fontSize: '0.875rem' }}>
                      {order.customerEmail}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      color: 'var(--linktic-success)', 
                      fontWeight: '700', 
                      fontSize: '1.125rem' 
                    }}>
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </div>
                    <div style={{ 
                      fontSize: '0.875rem',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '12px',
                      background: order.status === 'PENDING' ? 'var(--linktic-warning)' : 'var(--linktic-success)',
                      color: 'white',
                      fontWeight: '600',
                      marginTop: '4px'
                    }}>
                      {order.status}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
