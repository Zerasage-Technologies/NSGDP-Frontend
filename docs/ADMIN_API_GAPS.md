# Admin API Gaps & Implementation Plan

**Date:** January 2026  
**Status:** 📋 Planning Phase  
**Priority:** M2 Completion

> **✅ UPDATE (Latest):** Organisation CRUD APIs are **already complete** on backend!  
> `PATCH /organisations/:id` and `PATCH /organisations/:id/status` are implemented.  
> Focus shifted to Dashboard Stats and Analytics APIs.

---

## Overview

This document outlines the missing backend APIs needed to complete the Super Admin functionality for M2. Core admin features (user management, dataset review, audit logs) are functional. Missing pieces are primarily **analytics, statistics aggregation, and organisation CRUD completion**.

---

## Current API Coverage: 5/6 Pages Complete

### ✅ Fully Supported (Ready for Production)
1. **All Datasets** - Review queue with approve/reject/revise
2. **All Users** - Full CRUD with role/status management
3. **Audit Log** - Query and export functionality
4. **Organisations** - Full CRUD (Create, Read, Update, Status Toggle) ✅ **COMPLETE**

### ⚠️ Partially Supported (Need Enhancement)
5. **Platform Dashboard** - Has user stats, missing dataset/download metrics
6. **Platform Analytics** - No dedicated endpoints

---

## Missing APIs by Priority

### 🔴 Priority 1: Essential for M2 Launch

#### 1. Platform Dashboard Statistics

**Endpoint:** `GET /admin/dashboard/stats`

**Purpose:** Provide KPI metrics for the admin dashboard landing page

**Response Schema:**
```typescript
{
  datasets: {
    total: number;
    pending: number;        // Awaiting review
    approved: number;
    rejected: number;
    byOrganisation: Array<{ orgId: string; orgName: string; count: number }>;
  };
  users: {
    total: number;
    pending: number;
    active: number;
    suspended: number;
    archived: number;
    newThisMonth: number;
    byRole: Record<UserRole, number>;
  };
  downloads: {
    total: number;
    thisMonth: number;
    thisWeek: number;
    topDatasets: Array<{ datasetId: string; title: string; count: number }>;
  };
  uploads: {
    thisMonth: number;
    thisWeek: number;
  };
  recentActivity: Array<{
    id: string;
    type: 'upload' | 'download' | 'approval' | 'user_registered';
    user: { id: string; name: string };
    dataset?: { id: string; title: string };
    timestamp: Date;
  }>;
}
```

**Implementation:**
```typescript
// nsgdp-backend/src/modules/admin/admin.service.ts
async getDashboardStats() {
  const [
    datasetStats,
    userStats,
    downloadStats,
    recentActivity
  ] = await Promise.all([
    this.getDatasetStats(),
    this.getUserStats(), // Already exists
    this.getDownloadStats(),
    this.getRecentActivity()
  ]);

  return {
    datasets: datasetStats,
    users: userStats,
    downloads: downloadStats,
    recentActivity
  };
}
```

**SQL Queries Needed:**
```sql
-- Dataset counts by status
SELECT status, COUNT(*) FROM datasets GROUP BY status;

-- Datasets by organisation
SELECT organisation_id, COUNT(*) FROM datasets GROUP BY organisation_id;

-- Downloads this month
SELECT COUNT(*) FROM dataset_downloads 
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE);

-- Top downloaded datasets
SELECT dataset_id, COUNT(*) as download_count 
FROM dataset_downloads 
GROUP BY dataset_id 
ORDER BY download_count DESC 
LIMIT 10;
```

---

### 🟡 Priority 2: Important for Full Analytics

#### 2. Platform Analytics API

**Endpoint:** `GET /admin/analytics`

**Query Params:**
- `startDate` - Filter from date
- `endDate` - Filter to date
- `granularity` - 'day' | 'week' | 'month' | 'year'

**Response Schema:**
```typescript
{
  timeRange: {
    startDate: Date;
    endDate: Date;
    granularity: string;
  };
  datasets: {
    uploadsTrend: Array<{ date: string; count: number }>;
    totalByOrganisation: Array<{ orgId: string; orgName: string; count: number }>;
    totalByCategory: Array<{ categoryId: string; categoryName: string; count: number }>;
    averageApprovalTime: number; // in hours
  };
  downloads: {
    downloadsTrend: Array<{ date: string; count: number }>;
    topDatasets: Array<{ datasetId: string; title: string; downloads: number }>;
    byFormat: Array<{ format: string; count: number }>;
  };
  users: {
    registrationsTrend: Array<{ date: string; count: number }>;
    activeUsers: number; // Users active in time range
    byOrganisation: Array<{ orgId: string; orgName: string; count: number }>;
  };
}
```

**SQL Queries:**
```sql
-- Uploads over time (grouped by month)
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as count
FROM datasets
WHERE created_at BETWEEN :startDate AND :endDate
GROUP BY month
ORDER BY month;

-- Downloads over time
SELECT 
  DATE_TRUNC('day', created_at) as day,
  COUNT(*) as count
FROM dataset_downloads
WHERE created_at BETWEEN :startDate AND :endDate
GROUP BY day
ORDER BY day;

-- Average approval time
SELECT 
  AVG(EXTRACT(EPOCH FROM (approved_at - submitted_at))/3600) as avg_hours
FROM datasets
WHERE status = 'approved' 
  AND approved_at IS NOT NULL
  AND submitted_at IS NOT NULL;
```

---

#### 3. Dataset Statistics API

**Endpoint:** `GET /admin/datasets/stats`

**Response:**
```typescript
{
  total: number;
  byStatus: {
    draft: number;
    pending: number;
    under_review: number;
    approved: number;
    rejected: number;
    archived: number;
  };
  byOrganisation: Array<{
    organisationId: string;
    organisationName: string;
    total: number;
    approved: number;
    pending: number;
  }>;
  byCategory: Array<{
    categoryId: string;
    categoryName: string;
    count: number;
  }>;
  byFormat: Array<{
    format: string;
    count: number;
  }>;
  recentSubmissions: Array<{
    id: string;
    title: string;
    organisation: string;
    submittedAt: Date;
    status: string;
  }>;
}
```

---

### 🟢 Priority 3: Nice to Have (Post-M2)

#### 4. System Health Monitoring

**Endpoint:** `GET /admin/system/health`

**Response:**
```typescript
{
  database: {
    status: 'healthy' | 'degraded' | 'down';
    responseTime: number; // ms
    connections: { active: number; idle: number; max: number };
  };
  storage: {
    status: 'healthy' | 'degraded' | 'down';
    totalSpace: number; // bytes
    usedSpace: number;
    availableSpace: number;
  };
  redis: {
    status: 'healthy' | 'degraded' | 'down';
    memory: { used: number; peak: number; max: number };
  };
  api: {
    uptime: number; // seconds
    requestsPerMinute: number;
    averageResponseTime: number; // ms
    errorRate: number; // percentage
  };
}
```

#### 5. Bulk Operations

**Endpoints:**
- `POST /admin/users/bulk-status` - Bulk activate/suspend users
- `POST /admin/datasets/bulk-approve` - Bulk approve datasets
- `POST /admin/datasets/bulk-archive` - Bulk archive datasets

**Use Case:** Admin selects multiple items and performs action on all

---

## Implementation Roadmap

### Week 1: Essential Dashboard Stats
**Priority:** 🔴 P1  
**Effort:** 2-3 days

**Tasks:**
1. Create `getDashboardStats()` service method
2. Add SQL queries for dataset/download aggregation
3. Create `GET /admin/dashboard/stats` endpoint
4. Wire frontend dashboard to real API
5. Test with real data

**Files to Create/Modify:**
- `admin.service.ts` - Add `getDashboardStats()`, `getDatasetStats()`, `getDownloadStats()`
- `admin.controller.ts` - Add `GET /admin/dashboard/stats`
- Frontend: `src/lib/api/admin.ts` - Add `getAdminDashboardStats()`
- Frontend: `src/app/admin/page.tsx` - Wire to real API

---

### Week 2: Dataset Statistics API
**Priority:** � P2  
**Effort:** 1-2 days

**Tasks:**
1. Create dataset statistics endpoint
2. Add aggregation queries for status/category/format
3. Wire to admin dashboard
4. Test with real data

**Files to Create/Modify:**
- `admin.service.ts` - Add `getDatasetStats()`
- `admin.controller.ts` - Add `GET /admin/datasets/stats`

---

### Week 3: Analytics API
**Priority:** 🟡 P2  
**Effort:** 3-4 days

**Tasks:**
1. Create analytics service with time-series queries
2. Add `GET /admin/analytics` endpoint
3. Build time-series chart components
4. Wire analytics page to real data
5. Add date range filters
6. Add export functionality

**Files to Create/Modify:**
- `analytics.service.ts` (new or add to admin.service)
- `admin.controller.ts` - Add `GET /admin/analytics`
- Frontend: `src/app/admin/analytics/page.tsx` - Complete implementation
- Frontend: `src/components/charts/analytics-charts.tsx` - Build Recharts components

---

### Week 4: Polish & Testing
**Priority:** 🟡 P2  
**Effort:** 2-3 days

**Tasks:**
1. Add dataset stats endpoint
2. Error handling and edge cases
3. Performance optimization (indexing, caching)
4. Integration testing
5. Load testing with realistic data volume

---

## Database Indices Needed

For optimal performance of analytics queries:

```sql
-- Speed up dashboard stats
CREATE INDEX idx_datasets_status ON datasets(status);
CREATE INDEX idx_datasets_created_at ON datasets(created_at);
CREATE INDEX idx_datasets_org_id ON datasets(organisation_id);

-- Speed up download analytics
CREATE INDEX idx_downloads_created_at ON dataset_downloads(created_at);
CREATE INDEX idx_downloads_dataset_id ON dataset_downloads(dataset_id);

-- Speed up user analytics
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Speed up audit log queries
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
```

---

## API Testing Checklist

### Dashboard Stats
- [ ] Returns correct dataset counts by status
- [ ] Returns correct user counts by role/status
- [ ] Download stats match actual download records
- [ ] Recent activity shows last 10 items
- [ ] Performance < 500ms with 10k datasets

### Organisation CRUD ✅ Backend Complete
- [x] Create validates all fields ✅
- [x] Update checks name uniqueness ✅
- [x] Cannot disable org with active datasets ✅
- [x] Slug regenerates on name change ✅
- [x] Audit log records all changes ✅

### Analytics
- [ ] Time-series data groups correctly by granularity
- [ ] Date range filters work correctly
- [ ] Top datasets sorted by download count
- [ ] Trend charts show accurate data
- [ ] Export CSV matches displayed data

---

## Frontend Integration Checklist

### After APIs are ready:

**Dashboard:**
- [ ] Wire KPI cards to real stats
- [ ] Wire recent activity feed
- [ ] Add loading skeletons
- [ ] Handle empty/error states

**Organisations:** ✅ Backend APIs Ready
- [ ] Build edit modal with form
- [ ] Add disable/enable toggle
- [ ] Wire to `PATCH /organisations/:id` endpoint
- [ ] Wire to `PATCH /organisations/:id/status` endpoint
- [ ] Show confirmation dialogs
- [ ] Refresh list after mutations

**Analytics:**
- [ ] Wire all charts to real data
- [ ] Add date range picker
- [ ] Implement CSV export
- [ ] Add loading states

---

## Estimated Total Effort

| Priority | Tasks | Effort | Status |
|----------|-------|--------|--------|
| P1 - Dashboard Stats | 1 endpoint | 2-3 days | ⏳ Not Started |
| P1 - Org CRUD | 2 endpoints | 0 days | ✅ **Already Complete** |
| P2 - Analytics | 2 endpoints | 3-4 days | ⏳ Not Started |
| P2 - Dataset Stats | 1 endpoint | 1-2 days | ⏳ Not Started |
| P3 - System Health | 1 endpoint | 2 days | 📋 Future |
| P3 - Bulk Operations | 3 endpoints | 2-3 days | 📋 Future |
| **Total (P1+P2)** | **4 endpoints** | **6-9 days** | |

---

## Success Criteria

✅ **M2 Ready** when:
1. Admin dashboard shows live platform statistics
2. Organisations can be created, edited, and disabled
3. Analytics page shows basic trends (uploads/downloads over time)
4. All pages load with real data (no mock data)
5. Performance is acceptable (< 1s load time)
6. Error handling is robust

---

**Status:** 📋 Ready for Implementation  
**Next Action:** Begin Week 1 - Dashboard Stats API  
**Backend Focus:** Dashboard stats, Dataset statistics, Platform analytics  
**Frontend Focus:** Wire organisation edit/disable UI to existing backend APIs  
**Owner:** Backend Team  
**Review Date:** After Week 2 completion
