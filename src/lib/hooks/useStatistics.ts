import { useQuery } from "@tanstack/react-query";
import { getPlatformStatistics } from "@/lib/api/stats";

export function useStatistics() {
  return useQuery({
    queryKey: ["statistics"],
    queryFn: getPlatformStatistics,
    staleTime: 60 * 1000,
  });
}
