import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // ดึง Token จาก localStorage

  if (!token) {
    // หากไม่มี Token ให้ Redirect ไปหน้า Login
    return <Navigate to="/login" replace />;
  }

  // หากมี Token ให้แสดงเนื้อหาใน Route นี้
  return children;
};

export default ProtectedRoute;
