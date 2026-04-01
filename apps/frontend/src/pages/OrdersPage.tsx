import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Order, OrderStatus } from '../types';
import { ordersApi } from '../api/client';

// Página de listado de órdenes
// Muestra todas las órdenes con opciones de navegación
export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getAll();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar órdenes');
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
    return <div className="loading">Cargando órdenes...</div>;
  }

  if (error) {
    return (
      <div>
        <div className="error">{error}</div>
        <button className="btn btn-primary" onClick={loadOrders}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="card-header">
        <h1 className="card-title">Mis Órdenes</h1>
        <Link to="/orders/new" className="btn btn-primary">
          Crear Nueva Orden
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="card">
          <p className="text-center text-gray-500">
            No tienes órdenes registradas.
          </p>
          <div className="text-center mt-4">
            <Link to="/orders/new" className="btn btn-primary">
              Crear tu primera orden
            </Link>
          </div>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Email</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>{order.customerEmail}</td>
                  <td className="font-bold">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td>
                    <span className={`font-bold ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <Link 
                      to={`/orders/${order.id}`}
                      className="btn btn-secondary text-sm"
                    >
                      Ver Detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
