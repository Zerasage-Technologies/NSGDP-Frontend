import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getOrganisationMembers,
  updateMemberRole,
  removeMember,
} from '../api/organisations';

/**
 * Hook to fetch organisation members
 */
export function useOrganisationMembers(orgId: string | undefined) {
  return useQuery({
    queryKey: ['organisation-members', orgId],
    queryFn: () => getOrganisationMembers(orgId!),
    enabled: !!orgId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to update member role (promote/demote)
 */
export function useUpdateMemberRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orgId,
      userId,
      role,
    }: {
      orgId: string;
      userId: string;
      role: 'contributor' | 'admin';
    }) => updateMemberRole(orgId, userId, role),
    onSuccess: (_, variables) => {
      // Invalidate members list to refetch
      queryClient.invalidateQueries({
        queryKey: ['organisation-members', variables.orgId],
      });
    },
  });
}

/**
 * Hook to remove member from organisation
 */
export function useRemoveMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orgId, userId }: { orgId: string; userId: string }) =>
      removeMember(orgId, userId),
    onSuccess: (_, variables) => {
      // Invalidate members list to refetch
      queryClient.invalidateQueries({
        queryKey: ['organisation-members', variables.orgId],
      });
    },
  });
}
