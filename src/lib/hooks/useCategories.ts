import { useQuery } from '@tanstack/react-query';
import { getCategories, getCategoryBySlug, type GetCategoriesParams } from '@/lib/api';

/**
 * Hook to fetch categories list
 */
export function useCategories(params?: GetCategoriesParams) {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => getCategories(params),
  });
}

/**
 * Hook to fetch a single category by slug
 */
export function useCategory(slug: string) {
  return useQuery({
    queryKey: ['categories', slug],
    queryFn: () => getCategoryBySlug(slug),
    enabled: !!slug,
  });
}
