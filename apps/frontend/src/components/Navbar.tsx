import React from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';

// Navbar LinkTIC - Componente reutilizable
interface NavbarProps {
  title?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title = "LinkTIC E-commerce" }) => {
  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <img src="/src/assets/logo.svg" alt="LinkTIC" style={{ height: '40px' }} />
        <Link to="/" style={{ textDecoration: 'none' }}>
          {title}
        </Link>
      </div>
      <div className="nav-links">
        {authService.isAuthenticated() ? (
          <>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <Link to="/products" className="nav-link">
              Productos
            </Link>
            <Link to="/orders" className="nav-link">
              Órdenes
            </Link>
            <span style={{ color: 'var(--linktic-gray)', padding: '0 1rem' }}>
              Bienvenido
            </span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
