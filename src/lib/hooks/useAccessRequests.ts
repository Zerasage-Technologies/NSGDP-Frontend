import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestDatasetAccess, getMyAccessRequests } from '../api/access-requests';

/**
 * The current user's own access requests, across all datasets. Used to derive
 * whether a specific restricted dataset is pending/approved/never-requested.
 */
export function useMyAccessRequests(enabled: boolean = true) {
  return useQuery({
    queryKey: ['my-access-requests'],
    queryFn: () => getMyAccessRequests(),
    enabled,
    staleTime: 60 * 1000,
  });
}

export function useRequestDatasetAccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, reason }: { slug: string; reason: string }) => requestDatasetAccess(slug, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-access-requests'] });
    },
  });
}
