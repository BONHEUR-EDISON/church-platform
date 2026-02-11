// src/components/ProtectedRoute.tsx
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string | string[]; // <-- renommer pour matcher App.tsx
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { token, role } = useAuth(allowedRoles);

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles) {
    const rolesArray = Array.isArray(allowedRoles)
      ? allowedRoles.map(r => r.toUpperCase())
      : [allowedRoles.toUpperCase()];

    if (!rolesArray.includes(role || "")) {
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
