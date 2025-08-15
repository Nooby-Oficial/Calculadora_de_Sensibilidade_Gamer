import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Componente de proteção de rotas.
 * Redireciona para /login se não autenticado ou plano inválido.
 * Uso: <PrivateRoute><Dashboard /></PrivateRoute>
 */
const PrivateRoute = ({ children }) => {
  const { user, planoValido, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!planoValido) {
    return <Navigate to="/renew-plan" replace />;
  }
  return children;
};

export default PrivateRoute;
