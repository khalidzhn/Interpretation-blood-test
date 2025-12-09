import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isLoggedIn = localStorage.getItem("access_token");

  if (!isLoggedIn) {
    return <Navigate to="/info" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
