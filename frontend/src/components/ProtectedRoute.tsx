import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { authService } from "../services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireOnboarding?: boolean;
  requireRole?: string;
}

const ProtectedRoute = ({
  children,
  requireAuth = false,
  requireOnboarding = false,
  requireRole,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user data is available
  if (requireAuth && !user) {
    // Try to get user from localStorage
    const storedUser = authService.getUser();
    if (!storedUser) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  const currentUser = user || authService.getUser();

  // Check onboarding requirement
  // Skip onboarding check if user is on the onboarding page itself
  if (requireOnboarding && currentUser && !currentUser.onboarding_completed && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // Check role requirement
  if (requireRole && currentUser && currentUser.role !== requireRole) {
    // Redirect to appropriate dashboard based on user's actual role
    if (currentUser.role === 'guide') {
      return <Navigate to="/guide" replace />;
    } else if (currentUser.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Legacy seller check removed - not applicable to healthcare platform

  return <>{children}</>;
};

export default ProtectedRoute;
