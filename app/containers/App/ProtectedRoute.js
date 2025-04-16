import React from 'react';
import { Navigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token'); // or use your preferred auth check

  if (!token) {
    return <Navigate to="/login-firebase" replace />;
  }

  return children;
};

export default ProtectedRoute;
