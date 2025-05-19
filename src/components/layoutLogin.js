import React from 'react';
import LoginForm from '../pages/users/login';
import '../App.css'; 

const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Đăng Nhập</h2>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
