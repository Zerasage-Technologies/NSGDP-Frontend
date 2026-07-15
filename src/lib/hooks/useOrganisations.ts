import { useQuery } from '@tanstack/react-query';
import { getOrganisations, getOrganisationBySlug } from '../api/organisations';

/**
 * Hook to fetch all organisations with pagination
 */
export function useOrganisations(page: number = 1, limit: number = 50) {
  return useQuery({
    queryKey: ['organisations', page, limit],
    queryFn: () => getOrganisations({ page, limit }),
    staleTime: 10 * 60 * 1000, // 10 minutes - organisations don't change often
  });
}

/**
 * Hook to fetch a single organisation by slug with datasets
 */
export function useOrganisationBySlug(slug: string) {
  return useQuery({
    queryKey: ['organisation', slug],
    queryFn: () => getOrganisationBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
