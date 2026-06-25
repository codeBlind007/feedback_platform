import { useQuery } from "@tanstack/react-query";
import { feedbackService } from "../services/feedback.service";

export function useFeedbacks(
  isAdmin: boolean = false,
  filters?: { category?: string; status?: string; search?: string }
) {
  return useQuery({
    queryKey: ["feedbacks", isAdmin, filters],
    queryFn: () => {
      if (isAdmin) {
        return feedbackService.getAllFeedbacks(filters);
      } else {
        return feedbackService.getUserFeedbacks();
      }
    },
  });
}
