import React from 'react';
import { Navigate } from 'react-router-dom';


// Route bảo vệ: chỉ cho phép truy cập nếu đã đăng nhập
export const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  return isAuthenticated ? children : <Navigate to="/sign-in" replace />;
};

// Route công khai: nếu đã đăng nhập thì chuyển hướng sang trang chính
export const PublicRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};