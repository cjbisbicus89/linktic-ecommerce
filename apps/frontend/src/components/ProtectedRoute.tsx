import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

// Componente de ruta protegida según arquitectura
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
