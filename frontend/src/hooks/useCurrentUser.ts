import { useAuth } from "../providers/AuthProvider";

export function useCurrentUser() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  return { user, isAuthenticated, loading, logout };
}
