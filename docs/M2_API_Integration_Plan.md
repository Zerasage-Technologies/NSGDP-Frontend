# M2 API Integration Plan — Complete Checklist

**Version:** 1.0  
**Date:** July 2026  
**Status:** Ready for Implementation  
**Estimated Time:** 3-4 days (1 developer)

---

## Overview

This document provides a step-by-step integration plan to wire the frontend to backend APIs for M2 delivery. Each task includes file paths, implementation details, and verification steps.

### Current Integration Status

| Module | Backend | Frontend Client | UI Wiring | Status |
|--------|---------|----------------|-----------|--------|
| Auth/Session | ✅ | ✅ | ✅ | **COMPLETE** |
| User Dashboard | ✅ | ✅ | ✅ | **COMPLETE** |
| Profile/Password | ✅ | ✅ | ❌ | **CLIENT ONLY** |
| Notifications | ✅ | ✅ | ⚠️ | **PARTIAL** |
| Categories | ✅ | ✅ | ❌ | **CLIENT ONLY** |
| Organisations | ✅ | ✅ | ❌ | **CLIENT ONLY** |
| **Datasets** | ✅ | ❌ | ❌ | **NOT INTEGRATED** |
| **Admin** | ✅ | ❌ | ❌ | **NOT INTEGRATED** |
| **Uploads** | ✅ | ❌ | ❌ | **NOT INTEGRATED** |
| **Search** | ✅ | ❌ | ❌ | **NOT INTEGRATED** |

---

## Phase 1: Complete Partial Integrations (4 hours)

### 1.1 Profile Update Integration

**Files to modify:**
- `src/app/(dashboard)/profile/page.tsx`

**Current state:** Client functions exist but profile screen uses local state

**Steps:**

1. Import `updateProfile` and `changePassword` from `lib/api/users.ts`
2. Create mutation hooks using `useMutation` from TanStack Query
3. Wire profile form to call `updateProfile(data)`
4. Wire password form to call `changePassword(data)`
5. Add success/error toast notifications
6. Invalidate `auth.me` query on success to refresh user data
7. Handle validation errors from backend

**Implementation checklist:**
- [ ] Import `useMutation` from `@tanstack/react-query`
- [ ] Import `updateProfile, changePassword` from `@/lib/api/users`
- [ ] Create `useUpdateProfile()` mutation hook
- [ ] Create `useChangePassword()` mutation hook
- [ ] Replace form `onSubmit` handlers with mutation calls
- [ ] Add loading states to submit buttons (`mutation.isPending`)
- [ ] Add success toast: "Profile updated successfully"
- [ ] Add error toast with backend error message
- [ ] Invalidate `['user', 'me']` query on profile update success
- [ ] Test: Update firstName → Check navbar shows new name
- [ ] Test: Change password → Logout → Login with new password

**Verification:**
```bash
# 1. Run frontend dev server
npm run dev

# 2. Login and navigate to /profile
# 3. Update profile fields → Submit
# 4. Check Network tab: PATCH /api/v1/auth/me returns 200
# 5. Check UI updates with new data
# 6. Change password → Verify logout → Login with new password works
```

---

### 1.2 Notifications Page Integration

**Files to modify:**
- `src/app/(dashboard)/notifications/page.tsx`

**Current state:** Dashboard uses real API, notifications page uses mock state

**Steps:**
1. Import `useNotifications` hook (already created)
2. Import `useMarkNotificationAsRead` and `useMarkAllNotificationsAsRead` hooks
3. Replace mock notification state with real API call
4. Wire "Mark as Read" click handlers
5. Wire "Mark All as Read" button
6. Add pagination controls (already in hook)
7. Add filter tabs (All / Unread)

**Implementation checklist:**
- [ ] Import notification hooks from `@/lib/hooks/useNotifications`
- [ ] Replace mock state with `useNotifications(page, limit, unreadOnly)`
- [ ] Add pagination state: `const [page, setPage] = useState(1)`
- [ ] Add filter state: `const [showUnread, setShowUnread] = useState(false)`
- [ ] Create `markAsRead` mutation with `useMarkNotificationAsRead()`
- [ ] Create `markAllAsRead` mutation with `useMarkAllNotificationsAsRead()`
- [ ] Wire notification card `onClick` to `markAsRead.mutate(notification.id)`
- [ ] Wire "Mark All as Read" button to `markAllAsRead.mutate()`
- [ ] Add loading skeleton while fetching
- [ ] Add empty state when no notifications
- [ ] Add pagination controls (Previous/Next buttons)
- [ ] Test: Click notification → API call → notification marked read
- [ ] Test: Click "Mark All Read" → All unread count goes to 0

**Verification:**
```bash
# 1. Navigate to /notifications
# 2. Check Network tab: GET /api/v1/notifications?page=1&limit=20
# 3. Click a notification → Check: PATCH /api/v1/notifications/:id/read
# 4. Click "Mark All as Read" → Check: PATCH /api/v1/notifications/read-all
# 5. Verify unread count badge in navbar updates
```

---

### 1.3 Categories Production Integration

**Files to modify:**
- `src/app/(business)/dataportal/page.tsx` (datasets listing)
- Any other pages using category filters

**Current state:** Client exists, only used by `/api-test`

**Steps:**
1. Import `useCategories` hook (create if doesn't exist)
2. Replace mock category calls with real API
3. Wire category filter UI to real data
4. Update category pills/badges to use real slugs

**Implementation checklist:**
- [ ] Create `src/lib/hooks/useCategories.ts` if it doesn't exist
- [ ] Wrap `getCategories()` with `useQuery`
- [ ] Import hook in datasets listing page
- [ ] Replace `mockCategories` with `useCategories()` data
- [ ] Update category filter logic to use real category slugs
- [ ] Add loading state for category pills
- [ ] Test: Filter datasets by category → Verify API call includes category filter

**Verification:**
```bash
# 1. Navigate to /dataportal
# 2. Check Network tab: GET /api/v1/categories
# 3. Click category pill → Check datasets filtered by category
```

---

### 1.4 Organisations Production Integration

**Files to modify:**
- `src/app/(business)/organisations/page.tsx` (listing)
- `src/app/(business)/organisations/[slug]/page.tsx` (detail)
- Dataset detail pages (organisation info section)

**Current state:** Client exists, only used by `/api-test`, production pages use mocks

**Steps:**
1. Create `useOrganisations` and `useOrganisationBySlug` hooks
2. Replace mock calls in organisations listing page
3. Replace mock calls in organisation detail page
4. Update dataset cards to show real organisation data

**Implementation checklist:**
- [ ] Create `src/lib/hooks/useOrganisations.ts`
- [ ] Create `useOrganisations(page, limit)` hook
- [ ] Create `useOrganisationBySlug(slug)` hook
- [ ] Update `/organisations` page to use `useOrganisations()`
- [ ] Update `/organisations/[slug]` page to use `useOrganisationBySlug()`
- [ ] Add loading skeletons for org cards
- [ ] Add error states for failed requests
- [ ] Test pagination on organisations listing
- [ ] Test: Click org card → Navigate to detail page → Shows real data

**Verification:**
```bash
# 1. Navigate to /organisations
# 2. Check Network tab: GET /api/v1/organisations?page=1&limit=20
# 3. Click an organisation → Check: GET /api/v1/organisations/:slug
# 4. Verify organisation details display correctly
```

---

## Phase 2: Datasets Integration (8 hours)

### 2.1 Create Datasets API Client

**File to create:** `src/lib/api/datasets.ts`

**Backend endpoints available:**
- GET `/datasets` - List with filters
- GET `/datasets/:slug` - Single dataset
- POST `/datasets` - Create
- PATCH `/datasets/:slug` - Update
- DELETE `/datasets/:slug` - Delete
- POST `/datasets/:slug/submit` - Submit for review
- POST `/datasets/:slug/download` - Download (track)
- GET `/datasets/:slug/versions` - Version history
- GET `/datasets/:slug/preview` - Preview data

**Implementation checklist:**
- [ ] Create `src/lib/api/datasets.ts`
- [ ] Define TypeScript interfaces: `Dataset`, `DatasetResource`, `DatasetVersion`
- [ ] Implement `getDatasets(filters)` function with pagination/filtering
- [ ] Implement `getDatasetBySlug(slug)` function
- [ ] Implement `createDataset(data)` function
- [ ] Implement `updateDataset(slug, data)` function
- [ ] Implement `deleteDataset(slug)` function
- [ ] Implement `submitDataset(slug)` function
- [ ] Implement `downloadDataset(slug)` function
- [ ] Implement `getDatasetVersions(slug)` function
- [ ] Implement `previewDataset(slug)` function
- [ ] Export all functions from `src/lib/api/index.ts`

**Sample implementation structure:**
```typescript
// src/lib/api/datasets.ts
import { apiClient } from './client';
import { API_ROUTES } from './routes';

export interface Dataset {
  id: string;
  slug: string;
  title: string;
  description: string;
  // ... all other fields from backend
}

export interface DatasetsResponse {
  data: Dataset[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getDatasets(
  page = 1,
  limit = 20,
  filters?: {
    category?: string;
    organisation?: string;
    status?: string;
    visibility?: string;
    search?: string;
  }
): Promise<DatasetsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  if (filters?.category) params.append('category', filters.category);
  // ... add other filters
  
  const response = await apiClient.get<{ data: DatasetsResponse }>(
    `${API_ROUTES.datasets.list}?${params.toString()}`
  );
  return response.data.data;
}

// ... other functions
```

---

### 2.2 Create Datasets React Query Hooks

**File to create:** `src/lib/hooks/useDatasets.ts`

**Implementation checklist:**
- [ ] Create `src/lib/hooks/useDatasets.ts`
- [ ] Implement `useDatasets(page, limit, filters)` hook
- [ ] Implement `useDatasetBySlug(slug)` hook
- [ ] Implement `useCreateDataset()` mutation hook
- [ ] Implement `useUpdateDataset()` mutation hook
- [ ] Implement `useDeleteDataset()` mutation hook
- [ ] Implement `useSubmitDataset()` mutation hook
- [ ] Implement `useDownloadDataset()` mutation hook
- [ ] Implement `useDatasetVersions(slug)` hook
- [ ] Add proper cache invalidation on mutations
- [ ] Add optimistic updates where appropriate

**Sample hook structure:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDatasets, getDatasetBySlug, /* ... */ } from '../api/datasets';

export function useDatasets(page = 1, limit = 20, filters = {}) {
  return useQuery({
    queryKey: ['datasets', page, limit, filters],
    queryFn: () => getDatasets(page, limit, filters),
  });
}

export function useDatasetBySlug(slug: string) {
  return useQuery({
    queryKey: ['dataset', slug],
    queryFn: () => getDatasetBySlug(slug),
    enabled: !!slug,
  });
}

export function useCreateDataset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createDataset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
  });
}
// ... other hooks
```

---

### 2.3 Wire Datasets Listing Page

**File to modify:** `src/app/(business)/dataportal/page.tsx`

**Implementation checklist:**
- [ ] Import `useDatasets` hook
- [ ] Replace mock `getDatasets()` call with `useDatasets(page, limit, filters)`
- [ ] Wire filter state to hook filters parameter
- [ ] Wire pagination state to hook page parameter
- [ ] Add loading skeleton using `isLoading` state
- [ ] Add error boundary for failed requests
- [ ] Add empty state when no datasets match filters
- [ ] Verify filter chips update URL params
- [ ] Verify pagination updates URL params
- [ ] Test: Apply filters → Check Network tab for correct query params
- [ ] Test: Paginate → Check Network tab for page param
- [ ] Test: Filter + Paginate → Both params in URL

**Verification:**
```bash
# 1. Navigate to /dataportal
# 2. Check Network tab: GET /api/v1/datasets?page=1&limit=20
# 3. Apply category filter → Check: ?category=health
# 4. Search → Check: ?search=malaria
# 5. Paginate → Check: ?page=2
# 6. Verify dataset cards show real data
```

---

### 2.4 Wire Dataset Detail Page

**File to modify:** `src/app/(business)/dataportal/[slug]/page.tsx`

**Implementation checklist:**
- [ ] Import `useDatasetBySlug` hook
- [ ] Replace mock dataset fetch with `useDatasetBySlug(params.slug)`
- [ ] Add loading skeleton for detail page
- [ ] Add 404 handling when dataset not found
- [ ] Wire download button to `useDownloadDataset()` mutation
- [ ] Track download event on successful download
- [ ] Wire version history to `useDatasetVersions()` hook
- [ ] Display real resource files from dataset.resources[]
- [ ] Test: Navigate to dataset → Check real data displays
- [ ] Test: Click download → Check POST /datasets/:slug/download
- [ ] Test: View versions → Check GET /datasets/:slug/versions

**Verification:**
```bash
# 1. Navigate to /dataportal/health-facilities-2024
# 2. Check Network tab: GET /api/v1/datasets/health-facilities-2024
# 3. Click download → Check: POST /api/v1/datasets/health-facilities-2024/download
# 4. Verify download count increments
# 5. Click "Version History" → Check: GET /api/v1/datasets/health-facilities-2024/versions
```

---

### 2.5 Wire My Datasets Page (Contributors)

**File to modify:** `src/app/(dashboard)/my-datasets/page.tsx`

**Implementation checklist:**
- [ ] Import `useDatasets` with user filter
- [ ] Call `useDatasets(page, limit, { userId: 'me' })` to get user's datasets
- [ ] Replace mock dataset list with real API data
- [ ] Wire status filter tabs (all/draft/pending/approved/rejected)
- [ ] Add edit button → Navigate to `/edit/[slug]`
- [ ] Add delete button → Call `useDeleteDataset()` mutation
- [ ] Add confirm dialog for delete action
- [ ] Add "Submit for Review" button for draft datasets
- [ ] Test: View my datasets → Shows only user's datasets
- [ ] Test: Delete dataset → Confirmation → API call → Removed from list
- [ ] Test: Submit for review → Status changes to "pending"

**Verification:**
```bash
# 1. Login as contributor
# 2. Navigate to /my-datasets
# 3. Check Network tab: GET /api/v1/datasets?userId=me
# 4. Filter by status → Check: ?status=draft
# 5. Click delete → Check: DELETE /api/v1/datasets/:slug
# 6. Click "Submit for Review" → Check: POST /api/v1/datasets/:slug/submit
```

---

## Phase 3: Uploads Integration (4 hours)

### 3.1 Create Uploads API Client

**File to create:** `src/lib/api/uploads.ts`

**Backend endpoints:**
- POST `/uploads` - Upload file (multipart)
- GET `/uploads/:jobId` - Check upload status
- DELETE `/uploads/:jobId` - Cancel upload

**Implementation checklist:**
- [ ] Create `src/lib/api/uploads.ts`
- [ ] Define `UploadResponse` and `UploadStatus` interfaces
- [ ] Implement `uploadFile(file, onProgress)` with progress callback
- [ ] Implement `getUploadStatus(jobId)` function
- [ ] Implement `cancelUpload(jobId)` function
- [ ] Handle multipart/form-data content type
- [ ] Add axios upload progress tracking

**Sample implementation:**
```typescript
import { apiClient } from './client';
import { API_ROUTES } from './routes';

export interface UploadResponse {
  jobId: string;
  fileName: string;
  fileSize: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  url?: string;
}

export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await apiClient.post<{ data: UploadResponse }>(
    API_ROUTES.uploads.upload,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(percent);
        }
      },
    }
  );
  
  return response.data.data;
}

export async function getUploadStatus(jobId: string): Promise<UploadResponse> {
  const response = await apiClient.get<{ data: UploadResponse }>(
    API_ROUTES.uploads.status(jobId)
  );
  return response.data.data;
}

export async function cancelUpload(jobId: string): Promise<void> {
  await apiClient.delete(API_ROUTES.uploads.cancel(jobId));
}
```

---

### 3.2 Wire Upload Wizard

**Files to modify:**
- `src/app/(dashboard)/upload/page.tsx` (upload wizard)
- `src/app/(dashboard)/edit/[slug]/page.tsx` (edit wizard)

**Implementation checklist:**
- [ ] Create `useUploadFile()` hook wrapping upload mutation
- [ ] Import upload hooks in wizard
- [ ] Replace simulated upload with real `uploadFile()` call
- [ ] Track real upload progress from backend
- [ ] Store jobId from upload response
- [ ] Poll upload status if needed for large files
- [ ] Handle upload errors and retry logic
- [ ] Allow cancel during upload
- [ ] Link uploaded file to dataset creation
- [ ] Test: Upload file → Real progress → File appears in dataset
- [ ] Test: Cancel upload → Verify backend cancellation

**Verification:**
```bash
# 1. Navigate to /upload
# 2. Select file → Click upload
# 3. Check Network tab: POST /api/v1/uploads (multipart/form-data)
# 4. Monitor upload progress (should be real, not simulated)
# 5. Check: GET /api/v1/uploads/:jobId for status
# 6. Complete wizard → POST /api/v1/datasets with uploaded file reference
```

---

## Phase 4: Search Integration (3 hours)

### 4.1 Create Search API Client

**File to create:** `src/lib/api/search.ts`

**Backend endpoints:**
- GET `/search?q=query` - Full-text search
- GET `/search/suggest?q=query` - Autocomplete
- GET `/search/facilities?q=query` - Facility search

**Implementation checklist:**
- [ ] Create `src/lib/api/search.ts`
- [ ] Define `SearchResult`, `SearchSuggestion` interfaces
- [ ] Implement `search(query, type)` function
- [ ] Implement `getSearchSuggestions(query)` function
- [ ] Implement `searchFacilities(query, filters)` function
- [ ] Handle empty query gracefully

**Sample implementation:**
```typescript
import { apiClient } from './client';
import { API_ROUTES } from './routes';

export interface SearchResult {
  type: 'dataset' | 'organisation' | 'facility';
  id: string;
  title: string;
  description: string;
  slug?: string;
  // ... other fields
}

export interface SearchResponse {
  data: SearchResult[];
  meta: {
    total: number;
    query: string;
  };
}

export async function search(
  query: string,
  type?: 'all' | 'datasets' | 'organisations'
): Promise<SearchResponse> {
  const params = new URLSearchParams({ q: query });
  if (type && type !== 'all') params.append('type', type);
  
  const response = await apiClient.get<{ data: SearchResponse }>(
    `${API_ROUTES.search.query}?${params.toString()}`
  );
  return response.data.data;
}

export async function getSearchSuggestions(
  query: string
): Promise<string[]> {
  if (!query || query.length < 2) return [];
  
  const response = await apiClient.get<{ data: string[] }>(
    `${API_ROUTES.search.suggest}?q=${query}`
  );
  return response.data.data;
}
```

---

### 4.2 Wire Search Page

**File to modify:** `src/app/(business)/search/page.tsx`

**Implementation checklist:**
- [ ] Create `useSearch(query, type)` hook
- [ ] Import hook in search page
- [ ] Get query from URL params: `searchParams.get('q')`
- [ ] Call `useSearch(query, activeTab)` hook
- [ ] Replace mock search results with real API data
- [ ] Add debounced search as user types
- [ ] Add loading skeleton during search
- [ ] Add "No results" empty state
- [ ] Wire tab switching (All / Datasets / Organisations)
- [ ] Test: Type in search → Real API call
- [ ] Test: Switch tabs → Filtered results

**Verification:**
```bash
# 1. Navigate to /search?q=health
# 2. Check Network tab: GET /api/v1/search?q=health
# 3. Type more → Check debounced API calls
# 4. Switch to "Datasets" tab → Check: ?type=datasets
# 5. Verify search results display correctly
```

---

### 4.3 Wire Navbar Search Autocomplete

**File to modify:** `src/components/layout/navbar.tsx`

**Implementation checklist:**
- [ ] Import `getSearchSuggestions` function
- [ ] Add debounced search handler (300ms)
- [ ] Call `getSearchSuggestions(query)` on keystroke
- [ ] Display suggestions in dropdown
- [ ] Wire Enter key → Navigate to `/search?q=query`
- [ ] Wire suggestion click → Navigate to result
- [ ] Close dropdown on Escape or blur
- [ ] Test: Type in navbar search → See suggestions
- [ ] Test: Press Enter → Navigate to search page

**Verification:**
```bash
# 1. Type "health" in navbar search
# 2. Check Network tab: GET /api/v1/search/suggest?q=health
# 3. See dropdown with suggestions
# 4. Press Enter → Navigate to /search?q=health
```

---

## Phase 5: Admin Integration (8 hours)

### 5.1 Create Admin API Client

**File to create:** `src/lib/api/admin.ts`

**Backend endpoints:**
- GET `/admin/users` - List users
- GET `/admin/users/stats` - User statistics
- GET `/admin/users/:id` - Single user
- PATCH `/admin/users/:id/role` - Change role
- PATCH `/admin/users/:id/status` - Change status
- GET `/admin/review-queue` - Datasets pending review
- POST `/admin/datasets/:id/approve` - Approve dataset
- POST `/admin/datasets/:id/reject` - Reject dataset
- POST `/admin/datasets/:id/revise` - Request revision
- GET `/admin/audit-logs` - Audit logs
- GET `/admin/audit-logs/export` - Export CSV

**Implementation checklist:**
- [ ] Create `src/lib/api/admin.ts`
- [ ] Define interfaces: `AdminUser`, `UserStats`, `ReviewQueueItem`, `AuditLog`
- [ ] Implement `getUsers(page, limit, filters)` function
- [ ] Implement `getUserStats()` function
- [ ] Implement `getUserById(id)` function
- [ ] Implement `updateUserRole(id, role)` function
- [ ] Implement `updateUserStatus(id, status)` function
- [ ] Implement `getReviewQueue(filters)` function
- [ ] Implement `approveDataset(id, comment)` function
- [ ] Implement `rejectDataset(id, comment)` function
- [ ] Implement `requestRevision(id, comment)` function
- [ ] Implement `getAuditLogs(page, limit, filters)` function
- [ ] Implement `exportAuditLogs()` function that triggers CSV download

**Sample implementation:**
```typescript
import { apiClient } from './client';
import { API_ROUTES } from './routes';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface ReviewQueueItem {
  id: string;
  title: string;
  organisation: string;
  submittedBy: string;
  submittedAt: string;
  status: 'submitted' | 'under_review' | 'needs_revision';
}

export async function getUsers(
  page = 1,
  limit = 20,
  filters = {}
): Promise<{ data: AdminUser[]; meta: any }> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  const response = await apiClient.get<{ data: any }>(
    `${API_ROUTES.admin.users.list}?${params.toString()}`
  );
  return response.data.data;
}

export async function updateUserRole(
  id: string,
  role: string
): Promise<{ message: string }> {
  const response = await apiClient.patch<{ data: { message: string } }>(
    API_ROUTES.admin.users.updateRole(id),
    { role }
  );
  return response.data.data;
}

// ... other functions
```

---

### 5.2 Create Admin React Query Hooks

**File to create:** `src/lib/hooks/useAdmin.ts`

**Implementation checklist:**
- [ ] Create `src/lib/hooks/useAdmin.ts`
- [ ] Implement `useAdminUsers(page, limit, filters)` hook
- [ ] Implement `useUserStats()` hook
- [ ] Implement `useReviewQueue(filters)` hook
- [ ] Implement `useAuditLogs(page, limit, filters)` hook
- [ ] Implement `useUpdateUserRole()` mutation hook
- [ ] Implement `useUpdateUserStatus()` mutation hook
- [ ] Implement `useApproveDataset()` mutation hook
- [ ] Implement `useRejectDataset()` mutation hook
- [ ] Implement `useRequestRevision()` mutation hook
- [ ] Add cache invalidation on mutations

---

### 5.3 Wire Admin User Management Page

**File to modify:** `src/app/admin/users/page.tsx`

**Implementation checklist:**
- [ ] Import `useAdminUsers` and `useUserStats` hooks
- [ ] Replace mock user list with `useAdminUsers(page, limit, filters)`
- [ ] Wire role filter dropdown to filters state
- [ ] Wire status filter dropdown to filters state
- [ ] Wire pagination controls
- [ ] Import mutation hooks for role/status changes
- [ ] Wire "Change Role" button → Modal → Mutation call
- [ ] Wire "Suspend/Ban" buttons → Confirmation → Mutation call
- [ ] Add success/error toasts for actions
- [ ] Invalidate users query on successful mutation
- [ ] Test: Filter users by role → API call with filter
- [ ] Test: Change user role → Modal → API call → List updates

**Verification:**
```bash
# 1. Login as super_admin
# 2. Navigate to /admin/users
# 3. Check Network tab: GET /api/v1/admin/users?page=1&limit=20
# 4. Click "Change Role" → Check: PATCH /api/v1/admin/users/:id/role
# 5. Verify user role updates in table
```

---

### 5.4 Wire Admin Review Queue Page

**File to modify:** `src/app/admin/datasets/page.tsx` (review queue)

**Implementation checklist:**
- [ ] Import `useReviewQueue` hook
- [ ] Replace mock review queue with `useReviewQueue(filters)`
- [ ] Wire status tab filtering (All / Submitted / Under Review / Needs Revision)
- [ ] Wire sort controls
- [ ] Add age badge calculation from `submittedAt` date
- [ ] Wire "View" button → Navigate to review detail page
- [ ] Test: View review queue → Real data
- [ ] Test: Filter by status → API call with status filter
- [ ] Test: Sort by age → Re-fetch with sort param

**Verification:**
```bash
# 1. Navigate to /admin/datasets (review queue)
# 2. Check Network tab: GET /api/v1/admin/review-queue
# 3. Filter by "Submitted" → Check: ?status=submitted
# 4. Verify datasets display correctly
```

---

### 5.5 Wire Admin Review Detail Page

**File to modify:** `src/app/admin/datasets/[id]/review/page.tsx`

**Implementation checklist:**
- [ ] Import `useDatasetBySlug` to fetch dataset details
- [ ] Import approval mutation hooks
- [ ] Display full dataset metadata and resources
- [ ] Wire QA checklist items (can remain client-side state)
- [ ] Wire "Approve" button to `useApproveDataset()` mutation
- [ ] Wire "Request Revision" button to `useRequestRevision()` mutation
- [ ] Wire "Reject" button to `useRejectDataset()` mutation
- [ ] Add confirmation dialogs for all actions
- [ ] Require comment for reject and revision actions
- [ ] Show success toast → Navigate back to review queue
- [ ] Invalidate review queue cache on action success
- [ ] Test: Approve dataset → API call → Status changes to approved
- [ ] Test: Request revision → Comment required → Email sent to contributor
- [ ] Test: Reject dataset → Confirmation → Dataset rejected

**Verification:**
```bash
# 1. Navigate to /admin/datasets/:id/review
# 2. Check Network tab: GET /api/v1/datasets/:slug
# 3. Click "Approve" → Confirm
# 4. Check: POST /api/v1/admin/datasets/:id/approve
# 5. Verify redirect to review queue
# 6. Verify dataset status updated
```

---

### 5.6 Wire Admin Audit Logs Page

**File to modify:** `src/app/admin/audit-logs/page.tsx`

**Implementation checklist:**
- [ ] Import `useAuditLogs` hook
- [ ] Replace mock audit logs with `useAuditLogs(page, limit, filters)`
- [ ] Wire action type filter dropdown
- [ ] Wire user search filter
- [ ] Wire pagination controls
- [ ] Wire "Export CSV" button to `exportAuditLogs()` function
- [ ] Handle CSV download response
- [ ] Add loading state during export
- [ ] Test: View audit logs → Real data
- [ ] Test: Filter by action type → API call with filter
- [ ] Test: Export CSV → File downloads

**Verification:**
```bash
# 1. Navigate to /admin/audit-logs
# 2. Check Network tab: GET /api/v1/admin/audit-logs?page=1&limit=20
# 3. Filter by action → Check: ?action=upload
# 4. Click "Export CSV" → Check: GET /api/v1/admin/audit-logs/export
# 5. Verify CSV file downloads
```

---

## Phase 6: Testing & Verification (4 hours)

### 6.1 End-to-End Testing Checklist

**User Flow Tests:**

**Public User:**
- [ ] Browse datasets → Filter → Search → View detail
- [ ] Click download → Login prompt appears
- [ ] Register → Verify email flow
- [ ] Login → Download dataset → Track in history

**Registered User:**
- [ ] Login → Dashboard shows real data
- [ ] Browse datasets → Download → Appears in download history
- [ ] View profile → Update → Changes reflect immediately
- [ ] Change password → Logout → Login with new password
- [ ] View notifications → Mark as read → Count updates

**Contributor:**
- [ ] Login → Navigate to /upload
- [ ] Upload file → Real progress → Complete wizard
- [ ] Submit dataset → Status "pending"
- [ ] View "My Datasets" → Shows submitted dataset
- [ ] Edit dataset → Update → Changes saved
- [ ] Receive notification on approval/rejection

**Admin:**
- [ ] Login → Navigate to /admin
- [ ] View review queue → Real pending datasets
- [ ] Open dataset review → View all metadata
- [ ] Approve dataset → Dataset status updates
- [ ] Request revision → Contributor notified
- [ ] Reject dataset → Dataset rejected
- [ ] View user management → Change user role
- [ ] View audit logs → Filter → Export CSV

---

### 6.2 API Integration Verification Matrix

| Endpoint | Method | Page/Component | Status | Notes |
|----------|--------|----------------|--------|-------|
| `/auth/register` | POST | Register page | ✅ | Already integrated |
| `/auth/login` | POST | Login page | ✅ | Already integrated |
| `/auth/me` | GET | Auth context | ✅ | Already integrated |
| `/auth/me` | PATCH | Profile page | ⬜ | **TODO: Phase 1.1** |
| `/auth/change-password` | POST | Profile page | ⬜ | **TODO: Phase 1.1** |
| `/notifications` | GET | Notifications page | ⬜ | **TODO: Phase 1.2** |
| `/notifications/:id/read` | PATCH | Notification item | ⬜ | **TODO: Phase 1.2** |
| `/categories` | GET | Dataset filters | ⬜ | **TODO: Phase 1.3** |
| `/organisations` | GET | Org listing | ⬜ | **TODO: Phase 1.4** |
| `/organisations/:slug` | GET | Org detail | ⬜ | **TODO: Phase 1.4** |
| `/datasets` | GET | Dataset listing | ⬜ | **TODO: Phase 2.3** |
| `/datasets/:slug` | GET | Dataset detail | ⬜ | **TODO: Phase 2.4** |
| `/datasets` | POST | Upload wizard | ⬜ | **TODO: Phase 2.5** |
| `/datasets/:slug` | PATCH | Edit wizard | ⬜ | **TODO: Phase 2.5** |
| `/datasets/:slug` | DELETE | My Datasets | ⬜ | **TODO: Phase 2.5** |
| `/datasets/:slug/submit` | POST | Upload wizard | ⬜ | **TODO: Phase 2.5** |
| `/datasets/:slug/download` | POST | Dataset detail | ⬜ | **TODO: Phase 2.4** |
| `/datasets/:slug/versions` | GET | Dataset detail | ⬜ | **TODO: Phase 2.4** |
| `/uploads` | POST | Upload wizard | ⬜ | **TODO: Phase 3.2** |
| `/uploads/:jobId` | GET | Upload progress | ⬜ | **TODO: Phase 3.2** |
| `/uploads/:jobId` | DELETE | Upload cancel | ⬜ | **TODO: Phase 3.2** |
| `/search` | GET | Search page | ⬜ | **TODO: Phase 4.2** |
| `/search/suggest` | GET | Navbar search | ⬜ | **TODO: Phase 4.3** |
| `/admin/users` | GET | User management | ⬜ | **TODO: Phase 5.3** |
| `/admin/users/:id/role` | PATCH | User management | ⬜ | **TODO: Phase 5.3** |
| `/admin/users/:id/status` | PATCH | User management | ⬜ | **TODO: Phase 5.3** |
| `/admin/review-queue` | GET | Review queue | ⬜ | **TODO: Phase 5.4** |
| `/admin/datasets/:id/approve` | POST | Review detail | ⬜ | **TODO: Phase 5.5** |
| `/admin/datasets/:id/reject` | POST | Review detail | ⬜ | **TODO: Phase 5.5** |
| `/admin/datasets/:id/revise` | POST | Review detail | ⬜ | **TODO: Phase 5.5** |
| `/admin/audit-logs` | GET | Audit logs | ⬜ | **TODO: Phase 5.6** |
| `/admin/audit-logs/export` | GET | Audit logs | ⬜ | **TODO: Phase 5.6** |

---

### 6.3 Error Handling Checklist

All API integrations must handle:
- [ ] Network errors (connection failed)
- [ ] 401 Unauthorized (redirect to login)
- [ ] 403 Forbidden (show permission error)
- [ ] 404 Not Found (show not found page)
- [ ] 422 Validation errors (show field errors)
- [ ] 500 Server errors (show generic error)
- [ ] Timeout errors (show retry option)

**Implementation pattern:**
```typescript
try {
  const data = await apiCall();
  return data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'An error occurred';
    
    switch (status) {
      case 401:
        // Clear session and redirect to login
        logout();
        router.push('/login');
        break;
      case 403:
        toast.error('You do not have permission to perform this action');
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 422:
        // Show validation errors on form fields
        setFieldErrors(error.response.data.errors);
        break;
      default:
        toast.error(message);
    }
  }
  throw error;
}
```

---

### 6.4 Loading States Checklist

All data-fetching pages must show:
- [ ] Skeleton loaders during initial load
- [ ] Loading spinner for mutations (button disabled)
- [ ] Progress indicators for uploads
- [ ] Optimistic updates where appropriate
- [ ] Stale data indicators (grey out while refetching)

---

### 6.5 Cache Invalidation Checklist

Ensure proper cache invalidation:
- [ ] Create dataset → Invalidate datasets list
- [ ] Update dataset → Invalidate dataset detail + list
- [ ] Delete dataset → Invalidate datasets list
- [ ] Submit dataset → Invalidate my datasets + review queue
- [ ] Approve/reject dataset → Invalidate review queue + datasets list
- [ ] Update profile → Invalidate user data
- [ ] Change user role → Invalidate users list
- [ ] Mark notification read → Invalidate notifications + dashboard summary
- [ ] Upload file → Invalidate dataset resources

**Implementation pattern:**
```typescript
export function useCreateDataset() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createDataset,
    onSuccess: () => {
      // Invalidate all datasets queries
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
      // Show success message
      toast.success('Dataset created successfully');
    },
  });
}
```

---

## Phase 7: Documentation & Handover (2 hours)

### 7.1 Update API Documentation

**File to update:** `docs/API_INTEGRATION.md` (create if doesn't exist)

**Content to include:**
- [ ] Overview of API client architecture
- [ ] Authentication flow (JWT tokens, refresh)
- [ ] Base URL configuration (environment variables)
- [ ] Error handling patterns
- [ ] Cache invalidation strategies
- [ ] How to add new API endpoints
- [ ] Testing API integrations locally

---

### 7.2 Create Migration Guide

**File to create:** `docs/MOCK_TO_API_MIGRATION.md`

**Content to include:**
- [ ] Which pages still use mock data (if any)
- [ ] How to identify mock vs real API calls
- [ ] Pattern for replacing mock hooks with real API hooks
- [ ] Common issues and troubleshooting
- [ ] Environment variables required

---

### 7.3 Update README

**File to update:** `README.md`

**Updates needed:**
- [ ] Add API integration status section
- [ ] Document required environment variables
- [ ] Add backend setup instructions
- [ ] Add troubleshooting section for API errors
- [ ] Update feature checklist to show API-backed features

---

## Implementation Timeline

**Total estimated time: 33 hours (4 work days for 1 developer)**

| Phase | Hours | Days | Tasks |
|-------|-------|------|-------|
| Phase 1: Partial Integrations | 4 | 0.5 | Profile, Notifications, Categories, Organisations |
| Phase 2: Datasets | 8 | 1.0 | API client, hooks, listing, detail, my-datasets |
| Phase 3: Uploads | 4 | 0.5 | Upload API, wizard integration |
| Phase 4: Search | 3 | 0.4 | Search API, page, navbar autocomplete |
| Phase 5: Admin | 8 | 1.0 | Admin API, users, review, audit logs |
| Phase 6: Testing | 4 | 0.5 | E2E testing, verification |
| Phase 7: Documentation | 2 | 0.3 | Docs, migration guide |
| **Total** | **33 hours** | **~4 days** | |

**Recommended schedule:**
- **Day 1:** Phase 1 (Partial integrations) + Start Phase 2 (Datasets API client)
- **Day 2:** Complete Phase 2 (Datasets integration)
- **Day 3:** Phase 3 (Uploads) + Phase 4 (Search)
- **Day 4:** Phase 5 (Admin integration)
- **Day 5:** Phase 6 (Testing) + Phase 7 (Documentation)

---

## Success Criteria

Integration is complete when:
- [ ] All ✅ COMPLETE endpoints are verified working
- [ ] All ⬜ TODO endpoints are implemented and tested
- [ ] No pages use mock data for M2-scoped features
- [ ] All forms submit to real API endpoints
- [ ] Error handling is consistent across all API calls
- [ ] Loading states are implemented everywhere
- [ ] Cache invalidation works correctly
- [ ] User can complete full workflows end-to-end
- [ ] Admin can manage users and approve datasets
- [ ] All tests pass
- [ ] Documentation is updated

---

## Risk Mitigation

**Potential issues and solutions:**

### Issue 1: Backend API schema mismatch
**Risk:** Frontend expects different data structure than backend provides
**Solution:** 
- Test each endpoint with Postman/curl first
- Define TypeScript interfaces from actual backend responses
- Add data transformation layer if needed

### Issue 2: Missing backend endpoints
**Risk:** Frontend needs endpoint that doesn't exist in backend
**Solution:**
- Review backend API specification document
- Request backend team to add missing endpoints
- Use mock data temporarily with clear TODO comments

### Issue 3: Performance issues with large datasets
**Risk:** Fetching large lists causes slow page loads
**Solution:**
- Implement pagination everywhere (already in plan)
- Add debouncing to search/filter inputs
- Use React Query's `staleTime` and `cacheTime` appropriately
- Consider virtual scrolling for very long lists

### Issue 4: Authentication token expiry
**Risk:** Access token expires during user session
**Solution:**
- Implement automatic token refresh (already in auth.ts)
- Retry failed requests after token refresh
- Clear session and redirect to login if refresh fails

### Issue 5: CORS issues in development
**Risk:** Browser blocks API calls due to CORS
**Solution:**
- Verify backend CORS configuration allows frontend origin
- Use proxy in Next.js config if needed
- Check environment variables are set correctly

---

## Rollback Plan

If integration causes critical issues:

1. **Immediate rollback:**
   - Revert to previous commit before integration
   - Deploy previous version
   - Document issue in GitHub issue tracker

2. **Selective rollback:**
   - Identify problematic endpoint/page
   - Temporarily switch back to mock data for that feature
   - Add feature flag if needed
   - Fix issue in development branch
   - Test thoroughly before re-deploying

3. **Communication:**
   - Notify team of rollback immediately
   - Document root cause
   - Create action plan for proper fix

---

## Appendix A: File Structure After Integration

```
src/
├── lib/
│   ├── api/
│   │   ├── auth.ts              ✅ Already exists
│   │   ├── users.ts             ✅ Already exists
│   │   ├── notifications.ts     ✅ Already exists
│   │   ├── categories.ts        ✅ Already exists
│   │   ├── organisations.ts     ✅ Already exists
│   │   ├── datasets.ts          ⬜ TO CREATE (Phase 2.1)
│   │   ├── admin.ts             ⬜ TO CREATE (Phase 5.1)
│   │   ├── uploads.ts           ⬜ TO CREATE (Phase 3.1)
│   │   ├── search.ts            ⬜ TO CREATE (Phase 4.1)
│   │   ├── client.ts            ✅ Already exists
│   │   ├── routes.ts            ✅ Already exists
│   │   └── index.ts             ✅ Already exists
│   │
│   └── hooks/
│       ├── useAuth.ts           ✅ Already exists
│       ├── useDashboardSummary.ts    ✅ Already exists
│       ├── useDownloadHistory.ts     ✅ Already exists
│       ├── useNotifications.ts       ✅ Already exists
│       ├── useCategories.ts     ⬜ TO CREATE (Phase 1.3)
│       ├── useOrganisations.ts  ⬜ TO CREATE (Phase 1.4)
│       ├── useDatasets.ts       ⬜ TO CREATE (Phase 2.2)
│       ├── useUploads.ts        ⬜ TO CREATE (Phase 3.2)
│       ├── useSearch.ts         ⬜ TO CREATE (Phase 4.2)
│       └── useAdmin.ts          ⬜ TO CREATE (Phase 5.2)
│
└── app/
    ├── (dashboard)/
    │   ├── profile/page.tsx     ⬜ UPDATE (Phase 1.1)
    │   ├── notifications/page.tsx    ⬜ UPDATE (Phase 1.2)
    │   ├── my-datasets/page.tsx      ⬜ UPDATE (Phase 2.5)
    │   ├── upload/page.tsx      ⬜ UPDATE (Phase 3.2)
    │   └── edit/[slug]/page.tsx ⬜ UPDATE (Phase 3.2)
    │
    ├── (business)/
    │   ├── dataportal/page.tsx       ⬜ UPDATE (Phase 2.3)
    │   ├── dataportal/[slug]/page.tsx    ⬜ UPDATE (Phase 2.4)
    │   ├── organisations/page.tsx    ⬜ UPDATE (Phase 1.4)
    │   ├── organisations/[slug]/page.tsx ⬜ UPDATE (Phase 1.4)
    │   └── search/page.tsx      ⬜ UPDATE (Phase 4.2)
    │
    └── admin/
        ├── users/page.tsx       ⬜ UPDATE (Phase 5.3)
        ├── datasets/page.tsx    ⬜ UPDATE (Phase 5.4)
        ├── datasets/[id]/review/page.tsx ⬜ UPDATE (Phase 5.5)
        └── audit-logs/page.tsx  ⬜ UPDATE (Phase 5.6)
```

---

## Appendix B: Environment Variables

Required environment variables for API integration:

```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Backend (.env)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=nsgdp_portal

JWT_ACCESS_SECRET=your_jwt_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=7d

REDIS_HOST=localhost
REDIS_PORT=6379

MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false
MINIO_BUCKET=nsgdp-files

SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=noreply@nsgdp.ng

CORS_ORIGIN=http://localhost:3000
```

---

## Appendix C: Quick Reference - API Client Template

Use this template when creating new API client files:

```typescript
// src/lib/api/example.ts
import { apiClient } from './client';
import { API_ROUTES } from './routes';

// ==================== TYPES ====================

export interface ExampleItem {
  id: string;
  name: string;
  // ... other fields
}

export interface ExampleResponse {
  data: ExampleItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ==================== QUERY FUNCTIONS ====================

/**
 * Get paginated list of items
 */
export async function getItems(
  page = 1,
  limit = 20,
  filters = {}
): Promise<ExampleResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  
  // Add filters to params
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  
  const response = await apiClient.get<{ data: ExampleResponse }>(
    `${API_ROUTES.example.list}?${params.toString()}`
  );
  return response.data.data;
}

/**
 * Get single item by ID
 */
export async function getItemById(id: string): Promise<ExampleItem> {
  const response = await apiClient.get<{ data: ExampleItem }>(
    API_ROUTES.example.byId(id)
  );
  return response.data.data;
}

// ==================== MUTATION FUNCTIONS ====================

/**
 * Create new item
 */
export async function createItem(data: Partial<ExampleItem>): Promise<ExampleItem> {
  const response = await apiClient.post<{ data: ExampleItem }>(
    API_ROUTES.example.create,
    data
  );
  return response.data.data;
}

/**
 * Update existing item
 */
export async function updateItem(
  id: string,
  data: Partial<ExampleItem>
): Promise<ExampleItem> {
  const response = await apiClient.patch<{ data: ExampleItem }>(
    API_ROUTES.example.update(id),
    data
  );
  return response.data.data;
}

/**
 * Delete item
 */
export async function deleteItem(id: string): Promise<void> {
  await apiClient.delete(API_ROUTES.example.delete(id));
}
```

---

## Appendix D: Quick Reference - React Query Hook Template

Use this template when creating React Query hooks:

```typescript
// src/lib/hooks/useExample.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../api/example';

// ==================== QUERY HOOKS ====================

/**
 * Fetch paginated list of items
 */
export function useItems(page = 1, limit = 20, filters = {}) {
  return useQuery({
    queryKey: ['items', page, limit, filters],
    queryFn: () => getItems(page, limit, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch single item by ID
 */
export function useItemById(id: string) {
  return useQuery({
    queryKey: ['item', id],
    queryFn: () => getItemById(id),
    enabled: !!id, // Only fetch if ID is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ==================== MUTATION HOOKS ====================

/**
 * Create new item
 */
export function useCreateItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createItem,
    onSuccess: (newItem) => {
      // Invalidate items list to refetch
      queryClient.invalidateQueries({ queryKey: ['items'] });
      
      // Optionally add to cache optimistically
      queryClient.setQueryData(['item', newItem.id], newItem);
    },
  });
}

/**
 * Update existing item
 */
export function useUpdateItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      updateItem(id, data),
    onSuccess: (updatedItem, variables) => {
      // Update specific item in cache
      queryClient.setQueryData(['item', variables.id], updatedItem);
      
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

/**
 * Delete item
 */
export function useDeleteItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteItem,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['item', deletedId] });
      
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}
```

---

## Appendix E: Troubleshooting Common Issues

### Issue: "Network Error" when calling API

**Cause:** Backend not running or wrong API URL

**Solution:**
```bash
# 1. Check backend is running
cd nsgdp-backend
npm run start:dev

# 2. Verify API URL in frontend .env.local
# Should be: NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1

# 3. Check CORS settings in backend allow frontend origin
```

---

### Issue: "401 Unauthorized" on protected routes

**Cause:** Missing or expired JWT token

**Solution:**
```typescript
// 1. Check token exists in auth context
const { user, isAuthenticated } = useAuth();
console.log('Authenticated:', isAuthenticated);
console.log('User:', user);

// 2. Check localStorage for tokens
console.log('Access Token:', localStorage.getItem('accessToken'));
console.log('Refresh Token:', localStorage.getItem('refreshToken'));

// 3. Try logging out and back in
// 4. Check token refresh is working in auth.ts
```

---

### Issue: Data not updating after mutation

**Cause:** Query cache not invalidated

**Solution:**
```typescript
// Ensure mutation invalidates relevant queries
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      // IMPORTANT: Invalidate all user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}
```

---

### Issue: TypeScript errors with API response types

**Cause:** Response structure doesn't match interface

**Solution:**
```typescript
// 1. Test endpoint with Postman/curl to see actual response
// 2. Update interface to match backend response
// 3. Add transformation if needed

export async function getData(): Promise<MyData> {
  const response = await apiClient.get<{ data: BackendData }>(url);
  
  // Transform backend structure to frontend structure
  return transformBackendToFrontend(response.data.data);
}
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | July 2026 | Development Team | Initial comprehensive integration plan |

---

**END OF DOCUMENT**
