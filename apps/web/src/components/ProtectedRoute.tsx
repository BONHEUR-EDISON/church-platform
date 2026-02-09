// src/components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { token, role } = useAuth(requiredRole);

  if (!token) return <Navigate to="/login" replace />;

  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole)
      ? requiredRole.map(r => r.toUpperCase())
      : [requiredRole.toUpperCase()];

    if (!allowedRoles.includes(role || "")) {
      // Redirection intelligente selon rôle
      switch (role) {
        case "ADMIN":
          return <Navigate to="/dashboard/admin" replace />;
        case "PASTOR":
          return <Navigate to="/dashboard/pastor" replace />;
        case "MEMBER":
          return <Navigate to="/dashboard/member" replace />;
        default:
          return <Navigate to="/home" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
