import { Navigate } from "@tanstack/react-router";
import { useAuthStore } from "../../store/authStore";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const AuthGuard = ({ children, redirectTo = "/login" }: AuthGuardProps) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
};

export const GuestGuard = ({ children, redirectTo = "/dashboard" }: AuthGuardProps) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
};