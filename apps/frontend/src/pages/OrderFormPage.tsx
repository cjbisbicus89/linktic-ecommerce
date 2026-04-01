import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Product, CreateOrderDto, CreateOrderItemDto } from '../types';
import { productsApi, ordersApi } from '../api/client';

// Página de creación de órdenes
// Formulario para seleccionar productos y crear una nueva orden
export const OrderFormPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [orderItems, setOrderItems] = useState<CreateOrderItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
  });

  useEffect(() => {
    loadProducts();
    
    // Si viene con un productId preseleccionado
    if (location.state?.productId) {
      addOrderItem(location.state.productId);
    }
  }, [location.state]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsApi.getAll();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const addOrderItem = (productId: number) => {
    const existingItem = orderItems.find(item => item.productId === productId);
    
    if (existingItem) {
      // Incrementar cantidad si ya existe
      setOrderItems(orderItems.map(item => 
        item.productId === productId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Agregar nuevo item
      setOrderItems([...orderItems, { productId, quantity: 1 }]);
    }
  };

  const updateOrderItem = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      // Eliminar item si cantidad es 0 o menos
      setOrderItems(orderItems.filter(item => item.productId !== productId));
    } else {
      // Actualizar cantidad
      setOrderItems(orderItems.map(item => 
        item.productId === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const removeOrderItem = (productId: number) => {
    setOrderItems(orderItems.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (orderItems.length === 0) {
      setError('Debes agregar al menos un producto a la orden');
      return;
    }

    if (!formData.customerName || !formData.customerEmail) {
      setError('Debes completar todos los campos del cliente');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const orderData: CreateOrderDto = {
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        items: orderItems,
      };

      const createdOrder = await ordersApi.create(orderData);
      setSuccess('¡Orden creada exitosamente!');
      
      // Redirigir al detalle de la orden después de 2 segundos
      setTimeout(() => {
        navigate(`/orders/${createdOrder.id}`);
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la orden');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Cargando productos...</div>;
  }

  return (
    <div>
      <div className="card-header">
        <h1 className="card-title">Crear Nueva Orden</h1>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/orders')}
        >
          Cancelar
        </button>
      </div>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Formulario de cliente */}
        <div className="card">
          <h2 className="card-title mb-4">Información del Cliente</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nombre del Cliente</label>
              <input
                type="text"
                className="form-input"
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email del Cliente</label>
              <input
                type="email"
                className="form-input"
                value={formData.customerEmail}
                onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting || orderItems.length === 0}
            >
              {submitting ? 'Creando Orden...' : 'Crear Orden'}
            </button>
          </form>
        </div>

        {/* Selección de productos */}
        <div className="card">
          <h2 className="card-title mb-4">Seleccionar Productos</h2>
          
          {products.length === 0 ? (
            <p className="text-center text-gray-500">No hay productos disponibles</p>
          ) : (
            <div className="space-y-2">
              {products.map((product) => {
                const orderItem = orderItems.find(item => item.productId === product.id);
                const quantity = orderItem?.quantity || 0;
                
                return (
                  <div key={product.id} className="flex justify-between items-center p-2 border rounded">
                    <div className="flex-1">
                      <div className="font-bold">{product.name}</div>
                      <div className="text-sm text-gray-500">
                        ${product.price.toFixed(2)} - Stock: {product.stock}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {quantity > 0 && (
                        <>
                          <button 
                            className="btn btn-secondary text-sm"
                            onClick={() => updateOrderItem(product.id, quantity - 1)}
                          >
                            -
                          </button>
                          <span className="font-bold">{quantity}</span>
                          <button 
                            className="btn btn-secondary text-sm"
                            onClick={() => updateOrderItem(product.id, quantity + 1)}
                          >
                            +
                          </button>
                        </>
                      )}
                      
                      {quantity === 0 && product.stock > 0 && (
                        <button 
                          className="btn btn-primary text-sm"
                          onClick={() => addOrderItem(product.id)}
                        >
                          Agregar
                        </button>
                      )}
                      
                      {quantity > 0 && (
                        <button 
                          className="btn btn-danger text-sm"
                          onClick={() => removeOrderItem(product.id)}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Resumen de la orden */}
      {orderItems.length > 0 && (
        <div className="card mt-4">
          <h2 className="card-title mb-4">Resumen de la Orden</h2>
          
          <table className="table mb-4">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unit.</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => {
                const product = products.find(p => p.id === item.productId);
                if (!product) return null;
                
                return (
                  <tr key={item.productId}>
                    <td>{product.name}</td>
                    <td>{item.quantity}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>${(product.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button 
                        className="btn btn-danger text-sm"
                        onClick={() => removeOrderItem(item.productId)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <div className="text-right">
            <div className="text-lg font-bold">
              Total: ${calculateTotal().toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
