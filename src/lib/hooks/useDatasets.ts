import { useQuery } from "@tanstack/react-query";
import { getDatasets, type DatasetFilters } from "@/lib/mock";

export function useDatasets(filters: DatasetFilters = {}) {
  return useQuery({
    queryKey: ["datasets", filters],
    queryFn: () => getDatasets(filters),
  });
}
