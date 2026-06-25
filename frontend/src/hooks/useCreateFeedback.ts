import { useMutation, useQueryClient } from "@tanstack/react-query";
import { feedbackService } from "../services/feedback.service";

export function useCreateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: feedbackService.createFeedback,
    onSuccess: () => {
      // Invalidate cache queries so the tables and statistics reload automatically
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}
