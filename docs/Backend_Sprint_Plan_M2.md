# Backend Sprint Plan — Milestone 2 (Core Repository Build)

| Field | Detail |
|---|---|
| **Project** | Niger State GeoHealth Portal — Backend API |
| **Goal** | Achieve Milestone 2 deliverable: First Functional MVP on Staging |
| **Timeline** | 3 Sprints (flexible duration, task-driven) |
| **Starting Point** | Blank slate — no repository, no code |
| **Target** | End-to-end flow: register → upload → approve → download → audit log |
| **Reference Docs** | Backend Architecture v1.1 · Master Build Plan v1.1 · NSPHCDA Project Workplan |

---

## Sprint Overview

| Sprint | Focus | Key Deliverable | Sections |
|---|---|---|---|
| **Sprint 1** | Foundation + Auth | Database schema + Auth APIs working | 6 sections (40 tasks) |
| **Sprint 2** | Upload + Approval | Full dataset lifecycle + Version tracking + Email system | 7 sections (32 tasks) |
| **Sprint 3** | Polish + Testing | MVP ready for UAT + Dataset preview + Partner Data Portal | 7 sections (26 tasks) |
| **Total** | | **M2 Complete** | **20 sections (98 tasks)** |

---

## Technology Stack (Per Backend Architecture v1.1)

**Runtime & Framework:**
- Node.js 22 LTS
- Fastify (REST API framework)
- TypeScript

**Database & Storage:**
- PostgreSQL 16 + PostGIS 3.4
- Redis 7 (session store, cache, BullMQ backend)
- MinIO (S3-compatible object storage)

**Background Jobs:**
- BullMQ (Redis-backed job queues)

**Auth & Security:**
- JWT (access + refresh tokens)
- Argon2id (password hashing)
- ClamAV (file virus scanning — Sprint 3)

**Email:**
- Nodemailer + SMTP (SendGrid or Brevo)

**DevOps:**
- Docker + Docker Compose (local dev)
- GitHub Actions (CI/CD)

---

# SPRINT 1 — Foundation + Auth System

**Goal:** Project initialized, database schema deployed, authentication working

**Duration:** Flexible (task-driven, not time-driven)

**End State:** 
- Backend API server running locally
- Auth APIs complete (register, login, JWT, refresh, logout)
- User CRUD APIs (admin can manage users)
- Basic dataset CRUD (metadata only, no file uploads yet)

---

## Sprint 1 Tasks (6 sections, 40 tasks)

### 1.1 Project Setup & Initialization

| ID | Task | Output | Priority |
|---|---|---|---|
| 1.1.1 | Initialize Node.js project with TypeScript | `package.json`, `tsconfig.json` | P1 |
| 1.1.2 | Set up project folder structure | `src/` with routes, services, db, utils, types folders | P1 |
| 1.1.3 | Configure Fastify server with plugins | `src/server.ts` with CORS, Helmet, Rate Limit, JWT, Multipart | P1 |
| 1.1.4 | Set up ESLint + Prettier | `.eslintrc.js`, `.prettierrc` | P2 |
| 1.1.5 | Create `.env.example` and environment config loader | `src/config/env.ts` | P1 |
| 1.1.6 | Set up Docker Compose for local dev | `docker-compose.yml` (Postgres, Redis, MinIO) | P1 |
| 1.1.7 | Initialize Git repository + create `.gitignore` | GitHub repo created | P1 |

**Folder Structure:**
```
backend/
├── src/
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic layer
│   ├── db/              # Database connection, queries, migrations
│   ├── workers/         # BullMQ background workers
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript type definitions
│   ├── middleware/      # Auth, validation, error handling
│   ├── config/          # Environment config
│   └── server.ts        # Fastify app entry point
├── docker-compose.yml
├── package.json
├── tsconfig.json
└── .env.example
```

---

### 1.2 Database Schema Implementation

| ID | Task | Output | Priority |
|---|---|---|---|
| 1.2.1 | Create PostgreSQL connection singleton | `src/db/postgres.ts` | P1 |
| 1.2.2 | Create database migration system | `src/db/migrations/` folder + migration runner | P1 |
| 1.2.3 | Write migration: Core tables (users, organisations, categories) | Migration file `001_core_tables.sql` | P1 |
| 1.2.4 | Write migration: Dataset tables (datasets, dataset_resources, dataset_key_attributes, dataset_downloads) | Migration file `002_dataset_tables.sql` | P1 |
| 1.2.5 | Write migration: Submission workflow tables (submission_tickets, workflow_actions) | Migration file `003_submission_tables.sql` | P1 |
| 1.2.6 | Write migration: Auth tables (refresh_tokens, mfa_credentials, password_reset_tokens) | Migration file `004_auth_tables.sql` | P1 |
| 1.2.7 | Write migration: Audit & notification tables (audit_logs, notifications) | Migration file `005_audit_tables.sql` | P1 |
| 1.2.8 | Write migration: B10 tables (programmes, documents, user_groups, permissions, etc.) | Migration file `006_b10_tables.sql` | P2 |
| 1.2.9 | Run all migrations on local database | Database schema live locally | P1 |
| 1.2.10 | Seed database with test data (organisations, categories, 1 admin user) | Seed script `src/db/seeds/001_test_data.sql` | P2 |

**Note:** Implement full schema from Backend Architecture v1.1 upfront to avoid migration pain later.

---

### 1.3 Authentication System

| ID | Task | Output | Priority |
|---|---|---|---|
| 1.3.1 | Implement JWT token generation & verification utility | `src/utils/jwt.ts` | P1 |
| 1.3.2 | Implement password hashing utility (Argon2id) | `src/utils/hash.ts` | P1 |
| 1.3.3 | Create auth middleware (verify JWT + extract user) | `src/middleware/auth.ts` | P1 |
| 1.3.4 | Create RBAC middleware (check user role) | `src/middleware/rbac.ts` | P1 |
| 1.3.5 | Build AuthService (register, login, refresh, logout) | `src/services/AuthService.ts` | P1 |
| 1.3.6 | Build auth routes: POST /auth/register | `src/routes/auth.ts` | P1 |
| 1.3.7 | Build auth routes: POST /auth/login (return access + refresh tokens) | `src/routes/auth.ts` | P1 |
| 1.3.8 | Build auth routes: POST /auth/refresh (rotate access token) | `src/routes/auth.ts` | P1 |
| 1.3.9 | Build auth routes: POST /auth/logout (revoke refresh token) | `src/routes/auth.ts` | P1 |
| 1.3.10 | Build auth routes: GET /auth/me (return current user + role) | `src/routes/auth.ts` | P1 |

**Deferred to Sprint 2:**
- POST /auth/forgot-password
- POST /auth/reset-password
- POST /auth/verify-email
- MFA/2FA setup (defer to Sprint 3)

---

### 1.4 User Management APIs

| ID | Task | Output | Priority |
|---|---|---|---|
| 1.4.1 | Build AdminService (getUsers, createUser, updateUser, deleteUser, changeRole, changeStatus) | `src/services/AdminService.ts` | P1 |
| 1.4.2 | Build admin routes: GET /admin/users (list all users) | `src/routes/admin.ts` | P1 |
| 1.4.3 | Build admin routes: PATCH /admin/users/:id/role (change user role) | `src/routes/admin.ts` | P1 |
| 1.4.4 | Build admin routes: PATCH /admin/users/:id/status (suspend/activate user) | `src/routes/admin.ts` | P1 |

---

### 1.5 Basic Dataset CRUD (Metadata Only)

| ID | Task | Output | Priority |
|---|---|---|---|
| 1.5.1 | Build DatasetService (create, list, getBySlug, update, archive) | `src/services/DatasetService.ts` | P1 |
| 1.5.2 | Build dataset routes: GET /datasets (list with filters, pagination) | `src/routes/datasets.ts` | P1 |
| 1.5.3 | Build dataset routes: GET /datasets/:slug (get single dataset) | `src/routes/datasets.ts` | P1 |
| 1.5.4 | Build dataset routes: POST /datasets (create dataset metadata only) | `src/routes/datasets.ts` | P1 |
| 1.5.5 | Build dataset routes: PATCH /datasets/:slug (update metadata) | `src/routes/datasets.ts` | P1 |
| 1.5.6 | Build dataset routes: DELETE /datasets/:slug (soft delete/archive) | `src/routes/datasets.ts` | P1 |

**Note:** File upload and download deferred to Sprint 2.

---

### 1.6 Testing & Documentation

| ID | Task | Output | Priority |
|---|---|---|---|
| 1.6.1 | Write API tests for auth routes (register, login, refresh, logout) | Test file `tests/auth.test.ts` | P2 |
| 1.6.2 | Write API tests for user management routes | Test file `tests/admin.test.ts` | P2 |
| 1.6.3 | Create Postman/Thunder Client collection for manual testing | Collection JSON file | P2 |

---

## Sprint 1 Acceptance Criteria

✅ Local development environment running (Postgres, Redis, MinIO via Docker)  
✅ Backend API server starts successfully on port 3001  
✅ Database schema deployed with all tables  
✅ Auth flow works: Register → Login → Get access token → Call protected route  
✅ Admin can create/edit/disable users via API  
✅ Datasets can be created (metadata only) and listed  
✅ All P1 tasks complete  

---

# SPRINT 2 — Upload + Approval + Download

**Goal:** Full dataset lifecycle working end-to-end with file uploads, approval workflow, and downloads

**Duration:** Flexible (task-driven)

**End State:**
- File upload pipeline complete (multipart → validation → MinIO storage → ClamAV scan)
- Dataset approval workflow (3-step: Pending → Under Review → Approved/Rejected)
- Admin Review Queue API
- Download API with presigned URLs + audit logging
- Email notification system
- Audit logging for all CRUD events

---

## Sprint 2 Tasks (7 sections, 32 tasks)

### 2.1 File Upload Pipeline

| ID | Task | Output | Priority |
|---|---|---|---|
| 2.1.1 | Set up MinIO client connection | `src/db/minio.ts` | P1 |
| 2.1.2 | Create MinIO buckets (datasets, avatars, exports, temp) | Bucket creation script | P1 |
| 2.1.3 | Build UploadService (processFile, detectFormat, validateFile, enqueueIngestion, trackProgress) | `src/services/UploadService.ts` | P1 |
| 2.1.4 | Build upload route: POST /uploads (multipart file upload → MinIO) | `src/routes/uploads.ts` | P1 |
| 2.1.5 | Build upload route: GET /uploads/:jobId (poll ingestion job progress) | `src/routes/uploads.ts` | P1 |
| 2.1.6 | Build upload route: DELETE /uploads/:jobId (cancel pending job) | `src/routes/uploads.ts` | P2 |
| 2.1.7 | Set up BullMQ job queue system | `src/workers/queue.ts` | P1 |
| 2.1.8 | Create ValidationWorker (file format, size, mime type validation) | `src/workers/ValidationWorker.ts` | P1 |

**Note:** ClamAV virus scanning deferred to Sprint 3 (manually validate uploads for now).

---

### 2.2 Dataset Approval Workflow

| ID | Task | Output | Priority |
|---|---|---|---|
| 2.2.1 | Build 3-step approval workflow state machine | `src/services/ApprovalService.ts` | P1 |
| 2.2.2 | Build admin route: GET /admin/review-queue (pending submissions) | `src/routes/admin.ts` | P1 |
| 2.2.3 | Build admin route: POST /admin/datasets/:id/approve (approve dataset) | `src/routes/admin.ts` | P1 |
| 2.2.4 | Build admin route: POST /admin/datasets/:id/reject (reject with reason) | `src/routes/admin.ts` | P1 |
| 2.2.5 | Build admin route: POST /admin/datasets/:id/revise (request revision with comment) | `src/routes/admin.ts` | P1 |
| 2.2.6 | Build dataset route: POST /datasets/:slug/submit (submit for review) | `src/routes/datasets.ts` | P1 |

---

### 2.3 Download System

| ID | Task | Output | Priority |
|---|---|---|---|
| 2.3.1 | Build download route: POST /datasets/:slug/download (log + return presigned URL) | `src/routes/datasets.ts` | P1 |
| 2.3.2 | Implement presigned URL generation (MinIO 1-hour expiry) | `src/utils/presignedUrl.ts` | P1 |
| 2.3.3 | Log download events to dataset_downloads table | Update DatasetService | P1 |

---

### 2.4 Dataset Version Tracking

| ID | Task | Output | Priority |
|---|---|---|---|
| 2.4.1 | Add version tracking to datasets table (version column + updated_at) | Update migration `002_dataset_tables.sql` | P1 |
| 2.4.2 | Implement version increment logic on dataset resubmission | Update DatasetService | P1 |
| 2.4.3 | Build dataset route: GET /datasets/:slug/versions (list version history) | `src/routes/datasets.ts` | P1 |

---

### 2.5 Audit Logging System

| ID | Task | Output | Priority |
|---|---|---|---|
| 2.5.1 | Build AuditService (log event, query logs, export CSV) | `src/services/AuditService.ts` | P1 |
| 2.5.2 | Create audit logging middleware (auto-log all CRUD events) | `src/middleware/auditLog.ts` | P1 |
| 2.5.3 | Build admin route: GET /admin/audit-logs (searchable audit log) | `src/routes/admin.ts` | P1 |
| 2.5.4 | Build admin route: GET /admin/audit-logs/export (export as CSV) | `src/routes/admin.ts` | P2 |

---

### 2.6 Email Notification System

| ID | Task | Output | Priority |
|---|---|---|---|
| 2.6.1 | Set up Nodemailer with SMTP (SendGrid or Brevo) | `src/utils/email.ts` | P1 |
| 2.6.2 | Create email templates (submission confirmed, approved, rejected, account activated) | `src/templates/email/` folder with Handlebars templates | P1 |
| 2.6.3 | Build NotificationService (sendEmail, createInApp, markRead) | `src/services/NotificationService.ts` | P1 |
| 2.6.4 | Create NotificationWorker (BullMQ worker for async email dispatch) | `src/workers/NotificationWorker.ts` | P1 |
| 2.6.5 | Integrate email triggers into approval workflow | Update ApprovalService | P1 |

**Note:** Start with console logging in dev, add real SMTP in Sprint 3 if time-constrained.

---

### 2.7 Password Reset Flow

| ID | Task | Output | Priority |
|---|---|---|---|
| 2.7.1 | Build auth route: POST /auth/forgot-password (send reset email, always return 200) | `src/routes/auth.ts` | P2 |
| 2.7.2 | Build auth route: POST /auth/reset-password (consume token, set new password) | `src/routes/auth.ts` | P2 |
| 2.7.3 | Create password reset email template | `src/templates/email/password-reset.hbs` | P2 |

---

## Sprint 2 Acceptance Criteria

✅ End-to-end flow working: Register → Login → Upload file → Submit for review → Admin approves → Download file  
✅ File upload saves to MinIO and creates dataset record  
✅ Admin Review Queue shows pending submissions  
✅ Admin can approve/reject/request-revision with reason  
✅ Download generates presigned URL and logs download event  
✅ Dataset version tracking works (version increments on resubmission)  
✅ Version history accessible via GET /datasets/:slug/versions  
✅ Email notifications sent on submission/approval/rejection  
✅ Audit log records all CRUD events (upload, approve, download, user edits)  
✅ All P1 tasks complete  

---

# SPRINT 3 — Polish + Testing + Dataset Preview + Partner Data Portal

**Goal:** MVP ready for User Acceptance Testing + dataset preview + 1 bonus B10 feature

**Duration:** Flexible (task-driven)

**End State:**
- Search & filter APIs complete
- Dataset preview/metadata display working
- B10.02 Partner Data Portal (organization-filtered datasets)
- Integration testing complete
- ClamAV virus scanning enabled
- CI/CD pipeline deployed
- Staging environment live

---

## Sprint 3 Tasks (7 sections, 26 tasks)

### 3.1 Search & Filter APIs

| ID | Task | Output | Priority |
|---|---|---|---|
| 3.1.1 | Build SearchService (fullText, suggest, searchFacilities) | `src/services/SearchService.ts` | P1 |
| 3.1.2 | Build search route: GET /search (cross-entity full-text search) | `src/routes/search.ts` | P1 |
| 3.1.3 | Enhance GET /datasets with advanced filters (category, org, LGA, date range, format, visibility) | Update `src/routes/datasets.ts` | P1 |
| 3.1.4 | Build organisation routes: GET /organisations (list orgs) | `src/routes/organisations.ts` | P2 |
| 3.1.5 | Build organisation routes: GET /organisations/:slug (org detail + datasets) | `src/routes/organisations.ts` | P2 |
| 3.1.6 | Build category routes: GET /categories (list categories) | `src/routes/categories.ts` | P2 |
| 3.1.7 | Build category routes: GET /categories/:slug (category + datasets) | `src/routes/categories.ts` | P2 |

---

### 3.2 B10.02 Partner Data Portal

| ID | Task | Output | Priority |
|---|---|---|---|
| 3.2.1 | Build partner data route: GET /partner-data (org-filtered datasets with role-based visibility) | `src/routes/partnerData.ts` | P1 |

**Note:** Reuses existing dataset infrastructure, just adds organization-based filtering logic.

---

### 3.3 Dataset Preview & Metadata Display

| ID | Task | Output | Priority |
|---|---|---|---|
| 3.3.1 | Build dataset preview route: GET /datasets/:slug/preview (first 100 rows for CSV, simplified GeoJSON for spatial) | `src/routes/datasets.ts` | P1 |
| 3.3.2 | Implement preview caching in Redis (TTL 24h) | Update DatasetService | P1 |

---

### 3.4 Virus Scanning & Security

| ID | Task | Output | Priority |
|---|---|---|---|
| 3.4.1 | Integrate ClamAV into ValidationWorker (virus scan before storage) | Update `src/workers/ValidationWorker.ts` | P1 |
| 3.4.2 | Add ClamAV service to Docker Compose | Update `docker-compose.yml` | P1 |

---

### 3.5 Integration Testing

| ID | Task | Output | Priority |
|---|---|---|---|
| 3.5.1 | Write end-to-end test: Full lifecycle (register → upload → approve → download → audit log) | Test file `tests/e2e.test.ts` | P1 |
| 3.5.2 | Write integration tests for approval workflow (pending → review → approved/rejected) | Test file `tests/approval.test.ts` | P1 |
| 3.5.3 | Write integration tests for upload pipeline (validation → storage → job tracking) | Test file `tests/upload.test.ts` | P2 |
| 3.5.4 | Run full test suite and fix all failing tests | All tests passing | P1 |

---

### 3.6 DevOps & Deployment

| ID | Task | Output | Priority |
|---|---|---|---|
| 3.6.1 | Write Dockerfile for production build | `Dockerfile` | P1 |
| 3.6.2 | Set up GitHub Actions CI/CD pipeline (lint, test, build, deploy to staging) | `.github/workflows/ci.yml` | P1 |
| 3.6.3 | Deploy to staging server (Galaxy Backbone or approved hosting) | Staging URL live | P1 |
| 3.6.4 | Configure staging environment variables (database, Redis, MinIO, SMTP) | Staging env configured | P1 |
| 3.6.5 | Run database migrations on staging | Staging database schema live | P1 |
| 3.6.6 | Seed staging database with test data | Staging has test organisations, categories, users | P2 |

---

### 3.7 Documentation & Polish

| ID | Task | Output | Priority |
|---|---|---|---|
| 3.7.1 | Write API documentation (Swagger/OpenAPI 3.0) | `docs/api-spec.yaml` + Swagger UI at /api/docs | P1 |
| 3.7.2 | Write README.md (setup instructions, environment variables, running locally) | `README.md` | P1 |
| 3.7.3 | Create deployment runbook (how to deploy, migrate, rollback) | `docs/DEPLOYMENT.md` | P2 |
| 3.7.4 | Fix all bugs discovered during integration testing | Bug-free MVP | P1 |

---

## Sprint 3 Acceptance Criteria

✅ Full E2E test passes: register → upload → approve → download → audit log  
✅ Search & filter APIs work with all query parameters  
✅ Dataset preview working (first 100 rows for CSV, simplified GeoJSON for spatial)  
✅ Preview cached in Redis with 24h TTL  
✅ Partner Data Portal shows organization-filtered datasets  
✅ ClamAV virus scanning working on file uploads  
✅ Staging environment live and accessible  
✅ CI/CD pipeline auto-deploys to staging on push to main  
✅ API documentation published at /api/docs  
✅ README complete with setup instructions  
✅ All P1 tasks complete  

---

## Sprint Summary

| Sprint | Sections | Individual Tasks | Core Deliverables |
|---|---|---|---|
| **Sprint 1** | 6 sections | 40 tasks | Foundation + Auth + Database Schema + Basic Dataset CRUD |
| **Sprint 2** | 7 sections | 32 tasks | Upload + Approval + Download + Version Tracking + Email + Audit |
| **Sprint 3** | 7 sections | 26 tasks | Search + Preview + Partner Portal + Testing + Deployment |
| **Total** | **20 sections** | **98 tasks** | **Milestone 2 Complete** |

**End State After Sprint 3:**
- ✅ Auth system complete (register, login, JWT, RBAC)
- ✅ User management (admin CRUD)
- ✅ Dataset full lifecycle (upload → review → approve/reject → download)
- ✅ File storage (MinIO with virus scanning)
- ✅ Email notifications
- ✅ Audit logging
- ✅ Search & filter
- ✅ Partner Data Portal
- ✅ Staging deployment with CI/CD
- ✅ API documentation

**Ready for User Acceptance Testing with government stakeholders per Milestone 2 workplan! 🎯**
