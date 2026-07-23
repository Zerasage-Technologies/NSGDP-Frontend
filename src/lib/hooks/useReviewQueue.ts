import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getReviewQueue,
  getUnderReviewQueue,
  getReviewDatasets,
  getReviewDatasetBySlug,
  getReviewDatasetPreview,
  approveDataset,
  rejectDataset,
  requestRevision,
  markUnderReview,
  saveQAChecklist,
  publishDataset,
  unpublishDataset,
  type ReviewQueueParams,
  type ReviewDatasetsParams,
  type QAChecklistItemPayload,
} from '../api/review';
import type { DatasetStatus } from '../api/datasets';

/**
 * Fetch the review-queue list for a given tab. Pending/under_review are
 * ticket-backed (separate endpoints); everything else is a plain status
 * filter over the full cross-org dataset list.
 */
export function useReviewQueue(
  tab: DatasetStatus | 'all',
  params: { search?: string } = {}
) {
  return useQuery({
    queryKey: ['review-queue', tab, params.search],
    queryFn: async () => {
      const shared: ReviewQueueParams & ReviewDatasetsParams = {
        page: 1,
        limit: 100,
        search: params.search || undefined,
      };
      if (tab === 'pending') return (await getReviewQueue(shared)).data;
      if (tab === 'under_review') return (await getUnderReviewQueue(shared)).data;
      return (await getReviewDatasets(tab === 'all' ? shared : { ...shared, status: tab })).data;
    },
    staleTime: 30 * 1000,
  });
}

export function useReviewDataset(slug: string) {
  return useQuery({
    queryKey: ['review-dataset', slug],
    queryFn: () => getReviewDatasetBySlug(slug),
    enabled: !!slug,
  });
}

export function useReviewDatasetPreview(slug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['review-dataset-preview', slug],
    queryFn: () => getReviewDatasetPreview(slug),
    enabled: !!slug && enabled,
  });
}

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>, slug?: string) {
  queryClient.invalidateQueries({ queryKey: ['review-queue'] });
  if (slug) queryClient.invalidateQueries({ queryKey: ['review-dataset', slug] });
}

export function useApproveDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, comment }: { slug: string; comment?: string }) => approveDataset(slug, comment),
    onSuccess: (_, { slug }) => {
      toast.success('Dataset approved successfully');
      invalidateAll(queryClient, slug);
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to approve dataset'),
  });
}

export function useRejectDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, reason }: { slug: string; reason: string }) => rejectDataset(slug, reason),
    onSuccess: (_, { slug }) => {
      toast.success('Dataset rejected');
      invalidateAll(queryClient, slug);
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to reject dataset'),
  });
}

export function useRequestRevision() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, comment }: { slug: string; comment: string }) => requestRevision(slug, comment),
    onSuccess: (_, { slug }) => {
      toast.success('Revision requested — dataset returned to the owner');
      invalidateAll(queryClient, slug);
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to request revision'),
  });
}

export function useMarkUnderReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => markUnderReview(slug),
    onSuccess: (_, slug) => invalidateAll(queryClient, slug),
  });
}

export function useSaveQAChecklist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, items }: { slug: string; items: QAChecklistItemPayload[] }) => saveQAChecklist(slug, items),
    onSuccess: (_, { slug }) => invalidateAll(queryClient, slug),
  });
}

export function usePublishDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => publishDataset(slug),
    onSuccess: (_, slug) => {
      toast.success('Dataset published to the public catalogue');
      invalidateAll(queryClient, slug);
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to publish dataset'),
  });
}

export function useUnpublishDataset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => unpublishDataset(slug),
    onSuccess: (_, slug) => {
      toast.success('Dataset unpublished');
      invalidateAll(queryClient, slug);
    },
    onError: (error: Error) => toast.error(error.message || 'Failed to unpublish dataset'),
  });
}
