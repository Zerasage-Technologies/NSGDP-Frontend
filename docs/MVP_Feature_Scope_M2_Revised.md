# MVP Feature Scope (Milestone 2) — Revised

## Milestone 2 Goal

**"Get the core data pipeline working end-to-end: users can register, upload datasets, admins can review/approve, and approved datasets can be downloaded and searched."**

---

## In Scope for Milestone 2 MVP

| Epic | Features | Priority | Status |
|---|---|---|---|
| **Authentication** | Registration, login, role-based access, admin approval, password reset | Must Have | ✅ In Sprint Plan |
| **Dataset Repository** | Upload, download, metadata form, dataset approval workflow, **version tracking**, dataset detail page | Must Have | ✅ In Sprint Plan |
| **Search & Discovery** | Global search, filter by disease/programme/LGA/ward/organisation/dataset category/date | Must Have | ✅ In Sprint Plan |
| **Data Governance** | Dataset owner assignment, validation status, approval workflow, audit trail, metadata standards enforcement | Must Have | ✅ In Sprint Plan |
| **Admin Panel** | User management, approval queue, audit log viewer, organisation registry management | Must Have | ✅ In Sprint Plan |
| **Homepage** | NSPHCDA branding, portal name, repository statistics, featured datasets, quick links (mobile-accessible) | Must Have | ✅ Frontend exists |
| **Notifications** | Upload approved, upload rejected, new dataset available, approval pending alerts | High | ✅ In Sprint Plan |
| **Partner Portal** | Partner organisation accounts, upload submissions, submission tracking | High | ✅ In Sprint Plan |
| **Dataset Preview** | Display first 100 rows (CSV) or simplified GeoJSON (spatial) before download | High | ✅ Added to Sprint 3 |

---

## Deferred to Milestone 3 (Weeks 9-13)

| Epic | Features | Priority | Deferred To | Rationale |
|---|---|---|---|---|
| **GIS Foundation** | Interactive facility map, LGA/ward boundary layers, disease burden layer, spatial filtering by LGA and ward | Must Have | Week 10 (M3) | Workplan explicitly schedules GIS in Week 10. Frontend has UI with mock data. Complex PostGIS setup better suited after core proven. |
| **Programme Structure** | Programme → Campaign → Activity → Dataset hierarchy for repository organisation | Must Have | Week 11 (M3) | Database tables exist (future-proofed in Sprint 1), but APIs deferred. Not blocking core upload/download flow. |
| **Document Repository** | Upload and archive SOPs, reports, guidelines, campaign documentation | High | Week 11 (M3) | Standalone module, doesn't block core flow. Frontend has UI with mock data. Similar to dataset upload (can reuse patterns). |

---

## Also Deferred to Milestone 3

### Analytics Module (Week 9-10)
- KPI dashboard (Total Cases, Facilities, LGAs, Outliers)
- Trends over time (annual, monthly)
- LGA burden summary table
- Outlier detection (Z-score)

### Campaigns Module (Week 11)
- Campaign CRUD
- Campaign LGA coverage tracking
- Campaign progress monitoring

### AI Assistant (Week 11)
- RAG pipeline over portal data
- LLM integration (Claude/OpenAI)

### Additional B10 Features
- B10.03: User Groups Management
- B10.04: Permission Delegation
- B10.05: Governance Module

### Other Features
- Access request system (restricted datasets)
- Bulk import tool
- DHIS2 integration (if applicable)

---

## Milestone 2 Deliverables (Week 8)

✅ **First Functional MVP on Staging**
- Users can register and log in
- Contributors can upload datasets with metadata
- Datasets go through 3-step approval workflow
- Admins can review, approve, or reject submissions
- Approved datasets are searchable with filters
- Approved datasets can be downloaded
- Version tracking on dataset resubmission
- Dataset preview before download
- Email notifications on submission/approval/rejection
- Full audit trail of all actions
- Partner portal with organization-filtered view

✅ **User Testing Report #1**
- Usability findings from government stakeholders
- Design revisions implemented

---

## Success Criteria

**Milestone 2 is successful when:**
1. ✅ Core user journey works end-to-end (register → upload → approve → download)
2. ✅ Admin can manage users, review queue, and view audit logs
3. ✅ Search and filtering work across all datasets
4. ✅ Email notifications delivered for key events
5. ✅ Staging environment deployed and accessible
6. ✅ Ready for User Acceptance Testing with government stakeholders

**What's NOT required for M2:**
- ❌ GIS/maps functionality (M3 Week 10)
- ❌ Analytics dashboard (M3 Week 9-10)
- ❌ Document repository (M3 Week 11)
- ❌ Programme management APIs (M3 Week 11)
- ❌ Campaigns (M3 Week 11)
- ❌ AI Assistant (M3 Week 11)

---

## Alignment with Backend Sprint Plan

| Sprint | Covers These Epics |
|---|---|
| **Sprint 1** | Authentication, Admin Panel (partial), Dataset Repository (metadata only) |
| **Sprint 2** | Dataset Repository (upload/download/approval/version tracking), Data Governance, Notifications |
| **Sprint 3** | Search & Discovery, Partner Portal, Dataset Preview, Testing, Deployment |

**Total:** 51 tasks across 3 sprints → Milestone 2 complete

---

## Changes from Original Scope

### ✅ Added to M2:
- Dataset version tracking (was "Must Have", added to Sprint 2)
- Dataset preview (usability enhancement, added to Sprint 3)

### ⏭️ Deferred to M3:
- GIS Foundation (moved from M2 to M3 Week 10 per workplan)
- Programme Structure APIs (tables exist, APIs deferred to M3 Week 11)
- Document Repository (moved from M2 to M3 Week 11)

### 📋 Rationale:
Keep M2 focused on **core data pipeline** (upload → approve → download). Build advanced features (GIS, Analytics, Documents, Programmes) in M3 on a proven foundation.

---

**Last Updated:** July 2026  
**Sprint Plan:** Backend_Sprint_Plan_M2.md  
**Architecture:** Backend_Architecture_v1.1.md
