import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../providers/AuthProvider";
import { LoginPayload } from "../types";

export function useLogin() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      return await login(payload);
    },
  });
}
