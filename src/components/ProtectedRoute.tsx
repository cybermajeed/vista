import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "customer";
  requireAuth?: boolean;
}

export function ProtectedRoute({ children, requiredRole, requireAuth = true }: ProtectedRouteProps) {
  const { user, profile, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mb-md"></div>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/signin" replace />;
  }

  if (requiredRole && profile?.role !== requiredRole) {
    // If they are admin trying to access a customer route, send to admin dashboard
    if (profile?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    // If they are customer trying to access an admin route, send to home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
