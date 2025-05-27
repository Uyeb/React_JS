import React from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // Hiển thị thông báo đăng xuất thành công
    message.success("Đăng xuất thành công!");

    navigate("/sign-in");
  };

  return handleLogout();
};

export default Logout;
