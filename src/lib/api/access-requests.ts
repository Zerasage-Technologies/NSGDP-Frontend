import { apiClient } from './client';
import { API_ROUTES } from './routes';

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  data: T;
}

export type AccessRequestStatus = 'pending' | 'approved' | 'denied';

export interface AccessRequest {
  id: string;
  dataset_id: string;
  requester_id: string;
  reason: string;
  status: AccessRequestStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_comment: string | null;
  created_at: string;
  updated_at: string;
}

/** Submit a request for access to a restricted dataset (reason must be >= 20 chars). */
export async function requestDatasetAccess(slug: string, reason: string): Promise<AccessRequest> {
  const response = await apiClient.post<ApiResponse<AccessRequest>>(
    API_ROUTES.datasets.accessRequests(slug),
    { reason }
  );
  return response.data.data;
}

/** Every access request the current user has ever submitted, across all datasets. */
export async function getMyAccessRequests(): Promise<AccessRequest[]> {
  const response = await apiClient.get<ApiResponse<AccessRequest[]>>(API_ROUTES.datasets.myAccessRequests);
  return response.data.data;
}
