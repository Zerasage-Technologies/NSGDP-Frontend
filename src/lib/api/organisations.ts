import { apiClient } from './client';
import type { PaginatedResponse } from '../types/common';

export type OrganisationType = 
  | 'government' 
  | 'ngo' 
  | 'private' 
  | 'international' 
  | 'academic' 
  | 'community';

export interface Organisation {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: OrganisationType;
  website: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrganisationWithDatasets extends Organisation {
  datasets: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
  }>;
}

export interface GetOrganisationsParams {
  page?: number;
  limit?: number;
}

/**
 * Get all organisations with pagination
 */
export async function getOrganisations(
  params?: GetOrganisationsParams
): Promise<PaginatedResponse<Organisation>> {
  const response = await apiClient.get<{ data: PaginatedResponse<Organisation> }>('/organisations', {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 20,
    },
  });
  // Backend wraps response in ApiResponse { success, statusCode, timestamp, path, data }
  // apiClient.get returns { data: ApiResponse }
  // So we need response.data.data to get the actual PaginatedResponse
  return (response.data as any).data;
}

/**
 * Get organisation by slug with datasets
 */
export async function getOrganisationBySlug(
  slug: string
): Promise<OrganisationWithDatasets> {
  const response = await apiClient.get<{ data: OrganisationWithDatasets }>(`/organisations/${slug}`);
  return (response.data as any).data;
}
