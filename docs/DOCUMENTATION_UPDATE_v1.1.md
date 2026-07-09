# Documentation Update v1.1 — July 2026

## Files Updated

### 1. Backend_Architecture_v1.0.md → v1.1.md
**What Changed:**
- Added backend support for 6 Tier 1 undocumented prototype features (B10.01-B10.05, B10.07)
- **New Services (5):** ProgrammeService, DocumentService, GovernanceService, UserGroupService, PermissionService
- **New Database Tables (8):** programmes, programme_reports, documents, user_groups, user_group_members, permissions, indicator_revisions, sop_register
- **New API Routes (~40 endpoints):** §5.7-§5.12 covering /programs, /documents, /partner-data, /admin/user-groups, /admin/permissions, /admin/governance
- **Fixed:** Typo "getBySl ug()" → "getBySlug()"

**Impact:** API surface expanded from ~60 to ~100 endpoints

---

### 2. Master_Build_Plan_v1.0.md → v1.1.md
**What Changed:**
- Added changelog documenting v1.0 → v1.1 evolution
- Added "Related Docs" field linking to Backend Architecture v1.1
- Updated verification section to reference Backend Architecture v1.1 support for B10 features
- Removed reference to deleted `UNDOCUMENTED_FEATURES.md`

**Impact:** Document now cross-references Backend Architecture v1.1

---

### 3. PROJECT_STRUCTURE.md → v1.1.md
**What Changed:**
- Added explicit version number (v1.1) and changelog
- Updated header with "Related Docs" field linking to Master Build Plan v1.1 and Backend Architecture v1.1
- Documented 11 B10 features in structure overview

**Impact:** All three core docs now version-synchronized and cross-referenced

---

## Why These Updates

The prototype (Phase A+B) contains **11 features not in original planning docs**. Backend Architecture v1.1 now provides complete API specifications (database schemas, services, REST endpoints) for the **6 features that require backend APIs** (B10.01-B10.05, B10.07). The remaining 5 features (B10.06, B10.08-B10.11) are frontend-only and require no backend changes.

---

## Summary

| Document | v1.0 → v1.1 | Key Addition |
|---|---|---|
| Backend Architecture | June → July 2026 | 5 services, 8 tables, ~40 API endpoints for B10 features |
| Master Build Plan | June → July 2026 | Changelog + Backend v1.1 cross-reference |
| PROJECT_STRUCTURE | (no version) → v1.1 | Version control + changelog + cross-references |

All documents now reference each other and document the same 11 B10 features consistently.
