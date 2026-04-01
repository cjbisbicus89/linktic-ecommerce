import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ProductsPage } from './pages/ProductsPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderFormPage } from './pages/OrderFormPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import './App.css';

// Aplicación principal con autenticación según arquitectura
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<LoginForm />} />
          
          {/* Rutas protegidas */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/products" element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/orders" element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          } />
          
          <Route path="/orders/new" element={
            <ProtectedRoute>
              <OrderFormPage />
            </ProtectedRoute>
          } />
          
          <Route path="/orders/:id" element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
