import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Order, OrderStatus } from '../types';
import { ordersApi } from '../api/client';

// Página de detalle de orden
// Muestra información completa de una orden específica
export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadOrder(parseInt(id));
    }
  }, [id]);

  const loadOrder = async (orderId: number) => {
    try {
      setLoading(true);
      const data = await ordersApi.getById(orderId);
      setOrder(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la orden');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'text-yellow-600';
      case OrderStatus.CONFIRMED:
        return 'text-blue-600';
      case OrderStatus.SHIPPED:
        return 'text-purple-600';
      case OrderStatus.DELIVERED:
        return 'text-green-600';
      case OrderStatus.CANCELLED:
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Pendiente';
      case OrderStatus.CONFIRMED:
        return 'Confirmada';
      case OrderStatus.SHIPPED:
        return 'Enviada';
      case OrderStatus.DELIVERED:
        return 'Entregada';
      case OrderStatus.CANCELLED:
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (loading) {
    return <div className="loading">Cargando detalle de la orden...</div>;
  }

  if (error) {
    return (
      <div>
        <div className="error">{error}</div>
        <button className="btn btn-primary" onClick={() => navigate('/orders')}>
          Volver a Órdenes
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div>
        <div className="error">Orden no encontrada</div>
        <button className="btn btn-primary" onClick={() => navigate('/orders')}>
          Volver a Órdenes
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="card-header">
        <h1 className="card-title">Detalle de Orden #{order.id}</h1>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/orders')}
        >
          Volver a Órdenes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Información del cliente */}
        <div className="card">
          <h2 className="card-title mb-4">Información del Cliente</h2>
          
          <div className="space-y-2">
            <div>
              <strong>Nombre:</strong> {order.customerName}
            </div>
            <div>
              <strong>Email:</strong> {order.customerEmail}
            </div>
            <div>
              <strong>Estado:</strong> 
              <span className={`font-bold ${getStatusColor(order.status)} ml-2`}>
                {getStatusText(order.status)}
              </span>
            </div>
            <div>
              <strong>Fecha de Creación:</strong> 
              {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
            </div>
            <div>
              <strong>Última Actualización:</strong> 
              {new Date(order.updatedAt).toLocaleDateString()} {new Date(order.updatedAt).toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Resumen de la orden */}
        <div className="card">
          <h2 className="card-title mb-4">Resumen de la Orden</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <strong>Productos:</strong>
              <span>{order.items?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <strong>Total:</strong>
              <span className="text-lg font-bold">
                ${order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items de la orden */}
      <div className="card mt-4">
        <h2 className="card-title mb-4">Productos de la Orden</h2>
        
        {(!order.items || order.items.length === 0) ? (
          <p className="text-center text-gray-500">
            No hay productos en esta orden.
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>ID Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>#{item.productId}</td>
                  <td>{item.quantity}</td>
                  <td>${item.unitPrice.toFixed(2)}</td>
                  <td className="font-bold">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={3} className="text-right">Total:</th>
                <th className="text-lg font-bold">
                  ${order.totalAmount.toFixed(2)}
                </th>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {/* Acciones */}
      <div className="card mt-4">
        <h2 className="card-title mb-4">Acciones</h2>
        
        <div className="flex gap-2">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/orders/new')}
          >
            Crear Nueva Orden
          </button>
          
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/products')}
          >
            Ver Productos
          </button>
        </div>
      </div>
    </div>
  );
};
