import { useMutation, useQueryClient } from "@tanstack/react-query";
import { feedbackService } from "../services/feedback.service";

export function useRespondFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ feedbackId, response }: { feedbackId: string; response: string }) =>
      feedbackService.respondToFeedback(feedbackId, response),
    onSuccess: () => {
      // Invalidate both lists and analytics data on successful submission
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });
}
