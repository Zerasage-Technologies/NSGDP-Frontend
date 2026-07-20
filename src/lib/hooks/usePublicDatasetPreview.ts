import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

interface PublicPreviewResponse {
  dataset: {
    id: string;
    slug: string;
    title: string;
    format: string;
  };
  preview: Record<string, unknown>;
  cached: boolean;
  rowCount?: number;
}

export function usePublicDatasetPreview(slug: string | undefined) {
  return useQuery({
    queryKey: ['dataset-public-preview', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Slug is required');
      const response = await apiClient.get<PublicPreviewResponse>(
        `/datasets/public/${slug}/preview`
      );
      return response.data;
    },
    enabled: !!slug,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (matches backend cache)
    retry: 1,
  });
}
