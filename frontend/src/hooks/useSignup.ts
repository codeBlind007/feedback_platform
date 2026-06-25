import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../providers/AuthProvider";
import { SignupPayload } from "../types";

export function useSignup() {
  const { signup } = useAuth();

  return useMutation({
    mutationFn: async (payload: SignupPayload) => {
      return await signup(payload);
    },
  });
}
