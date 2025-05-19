import React from 'react';
import { Navigate } from 'react-router-dom';


const ProtectedRoute = ({ children }) => {
  // Kiểm tra xem có accessToken trong localStorage không
  const isAuthenticated = !!localStorage.getItem('accessToken');
  
  return isAuthenticated ? children : <Navigate to="/sign-in" replace />;
};

export default ProtectedRoute;