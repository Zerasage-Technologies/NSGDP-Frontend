import { useQuery } from "@tanstack/react-query";
import { getOrganisations, type OrganisationFilters } from "@/lib/mock";

export function useOrganisations(filters: OrganisationFilters = {}) {
  return useQuery({
    queryKey: ["organisations", filters],
    queryFn: () => getOrganisations(filters),
  });
}
