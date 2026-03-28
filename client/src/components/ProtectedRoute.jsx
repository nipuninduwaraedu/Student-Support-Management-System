import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin, requireStudent }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }

  if (requireStudent && user.role !== 'Student') {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
