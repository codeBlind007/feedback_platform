import { useQuery } from "@tanstack/react-query";
import { feedbackService } from "../services/feedback.service";

export function useAnalytics(enabled: boolean = false) {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: feedbackService.getAnalytics,
    enabled,
  });
}
