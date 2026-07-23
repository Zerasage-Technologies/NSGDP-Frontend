// Cross-org dataset review API — reachable by super_admin/admin role OR a
// user with a delegated approve:datasets / publish:datasets permission.
// Named for what it does, not the /admin/* URL these routes happen to live
// under on the backend (non-admins call these too, via AccessGuard).
import { apiClient } from './client';
import { API_ROUTES } from './routes';
import type { Dataset, DatasetStatus } from './datasets';

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  data: T;
}

export interface ReviewQueueParams {
  page?: number;
  limit?: number;
  organisationId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface ReviewDatasetsParams {
  page?: number;
  limit?: number;
  status?: DatasetStatus;
  format?: string;
  search?: string;
  organisationId?: string;
}

export type QAResult = 'pass' | 'fail' | 'na' | 'pending';

export interface QAChecklistItemPayload {
  dimensionId: string;
  result: QAResult;
  notes?: string;
}

/** Datasets pending review, ticket-backed (submission_tickets). */
export async function getReviewQueue(
  params?: ReviewQueueParams
): Promise<{ data: Dataset[]; total: number; page: number; limit: number }> {
  const response = await apiClient.get<ApiResponse<{ data: Dataset[]; total: number; page: number; limit: number }>>(
    API_ROUTES.review.queue,
    { params: params as Record<string, unknown> }
  );
  return response.data.data;
}

/** Datasets currently under_review, ticket-backed. */
export async function getUnderReviewQueue(
  params?: ReviewQueueParams
): Promise<{ data: Dataset[]; total: number; page: number; limit: number }> {
  const response = await apiClient.get<ApiResponse<{ data: Dataset[]; total: number; page: number; limit: number }>>(
    API_ROUTES.review.underReviewQueue,
    { params: params as Record<string, unknown> }
  );
  return response.data.data;
}

/** Plain status filter over every dataset regardless of org (approved/rejected/archived/all tabs). */
export async function getReviewDatasets(
  params?: ReviewDatasetsParams
): Promise<{ data: Dataset[]; total: number; page: number; limit: number }> {
  const response = await apiClient.get<ApiResponse<{ data: Dataset[]; total: number; page: number; limit: number }>>(
    API_ROUTES.review.datasets,
    { params: params as Record<string, unknown> }
  );
  return response.data.data;
}

export async function getReviewDatasetBySlug(slug: string): Promise<Dataset> {
  const response = await apiClient.get<ApiResponse<Dataset>>(API_ROUTES.review.bySlug(slug));
  return response.data.data;
}

export async function getReviewDatasetPreview(slug: string): Promise<{
  dataset: Dataset;
  preview: unknown;
  cached: boolean;
  rowCount?: number;
}> {
  const response = await apiClient.get<ApiResponse<{ dataset: Dataset; preview: unknown; cached: boolean; rowCount?: number }>>(
    API_ROUTES.review.preview(slug)
  );
  return response.data.data;
}

export async function approveDataset(slug: string, comment?: string): Promise<Dataset> {
  const response = await apiClient.post<ApiResponse<Dataset>>(API_ROUTES.review.approve(slug), { comment });
  return response.data.data;
}

export async function rejectDataset(slug: string, reason: string): Promise<Dataset> {
  const response = await apiClient.post<ApiResponse<Dataset>>(API_ROUTES.review.reject(slug), { reason });
  return response.data.data;
}

export async function requestRevision(slug: string, comment: string): Promise<Dataset> {
  const response = await apiClient.post<ApiResponse<Dataset>>(API_ROUTES.review.requestRevision(slug), { comment });
  return response.data.data;
}

export async function markUnderReview(slug: string): Promise<Dataset> {
  const response = await apiClient.post<ApiResponse<Dataset>>(API_ROUTES.review.markUnderReview(slug), {});
  return response.data.data;
}

export async function saveQAChecklist(
  slug: string,
  items: QAChecklistItemPayload[]
): Promise<{ id: string; dataset_id: string; status: string; qa_checklist: QAChecklistItemPayload[] | null }> {
  const response = await apiClient.patch<ApiResponse<{ id: string; dataset_id: string; status: string; qa_checklist: QAChecklistItemPayload[] | null }>>(
    API_ROUTES.review.qaChecklist(slug),
    { items }
  );
  return response.data.data;
}

export async function publishDataset(slug: string): Promise<Dataset> {
  const response = await apiClient.post<ApiResponse<Dataset>>(API_ROUTES.review.publish(slug), {});
  return response.data.data;
}

export async function unpublishDataset(slug: string): Promise<Dataset> {
  const response = await apiClient.post<ApiResponse<Dataset>>(API_ROUTES.review.unpublish(slug), {});
  return response.data.data;
}
