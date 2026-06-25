import { useQuery } from "@tanstack/react-query";
import { feedbackService } from "../services/feedback.service";

export function useFeedbacks(
  userId?: string,
  isAdmin: boolean = false,
  filters?: { category?: string; status?: string; search?: string }
) {
  return useQuery({
    queryKey: ["feedbacks", userId, isAdmin, filters],
    queryFn: () => {
      if (isAdmin) {
        return feedbackService.getAllFeedbacks(filters);
      } else {
        return feedbackService.getUserFeedbacks();
      }
    },
    enabled: !!userId,
  });
}
