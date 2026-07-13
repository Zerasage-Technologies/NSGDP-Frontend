import { useQuery } from '@tanstack/react-query';
import { getOrganisations, getOrganisationBySlug, type GetOrganisationsParams } from '@/lib/api';

/**
 * Hook to fetch organisations list
 */
export function useOrganisations(params?: GetOrganisationsParams) {
  return useQuery({
    queryKey: ['organisations', params],
    queryFn: () => getOrganisations(params),
  });
}

/**
 * Hook to fetch a single organisation by slug
 */
export function useOrganisation(slug: string) {
  return useQuery({
    queryKey: ['organisations', slug],
    queryFn: () => getOrganisationBySlug(slug),
    enabled: !!slug,
  });
}
