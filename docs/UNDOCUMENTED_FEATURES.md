# Undocumented Features — NSGDP Frontend Prototype
## Verified Inventory of Features Built Beyond Specification

**Date:** July 2026 (re-verified)
**Method:** Full-text search of every planning document + code inspection + build execution
**Documents searched:**
- Master Build Plan v1.0 (`docs/newdocs/Master_Build_Plan_v1.0.md`)
- Niger State GeoHealth Portal PRD v2.0 (`docs/newdocs/Niger_State_GeoHealth_Portal_PRD_v2.0.md`)
- Frontend PRD v1.0 (`docs/Frontend_PRD_v1.0.md`)
- Frontend Build Plan v1.0 (`docs/Frontend_Build_Plan_v1.0.md`)
- Backend Architecture v1.0 (`docs/newdocs/Backend_Architecture_v1.0.md`)

> **Correction notice (July 2026):** The previous version of this file claimed
> "40+ undocumented features" and listed items such as ward-level analytics,
> outbreak alerts, notifications, data sovereignty, and programme tracking as
> "NOT in ANY doc." Full-text search proved several of those claims false — those
> concepts **are** in the documentation. This version reclassifies everything into
> three verified tiers and corrects two fabricated data points ("800+ facilities"
> was actually 54; "32 datasets" was actually 31).

---

## Executive Summary

The prototype does exceed spec, but not by "40+ undocumented features." The
accurate picture:

- **Tier 1 — Genuinely undocumented (0 doc hits):** ~6 feature areas / ~8 routes
- **Tier 2 — Documented concept, new implementation:** ~5 features
- **Tier 3 — Documented tasks already completed (not bonus):** ~5 items

Verified inventory totals:
- **72 `.tsx` component files** (14 shadcn UI primitives -> ~58 custom)
- **17 mock modules** (`datasets.ts` re-exports `health-datasets.ts`)
- **31 health datasets** (exceeds 25 required by PRD v2.0 §5.4)
- **54 generated health facilities** (exceeds 50 required by Master Build Plan B7.16)

---

## Tier 1 — Genuinely Undocumented

Full-text search returns **zero matches** for these in any planning document.

### 1. Document Repository — `/documents`
- Browse SOPs, policies, research papers, guidelines.
- Backed by `mock/documents.ts` + `mock/sops.ts`.
- **Doc status:** "document repository" -> 0 hits anywhere.

### 2. Partner Data portal — `/partner-data`
- Partner-specific dataset portal with filters.
- **Doc status:** "partner-data" / "partner data" -> 0 hits anywhere.

### 3. User Groups management — `/admin/user-groups`
- Create/edit/manage user groups with bulk permissions.
- **Doc status:** "user group" / "user-group" -> 0 hits anywhere.

### 4. Permission delegation (granular) — `/admin/permissions`
- Granular permission matrix + delegation workflows (`mock/permissions.ts`).
- **Doc status:** docs cover **role-based** RBAC only (PRD FR-03.4 "permissions by
  role"; FR-19 "RBAC enforcement"). Granular per-user delegation is **not** documented.

### 5. Admin Governance module — `/admin/governance`, `/admin/governance/health`, `/admin/governance/sops`
- Admin UI to manage health indicators + SOPs.
- **Doc status:** "governance" appears in docs only as the *data-governance
  concept/team* (NSPHCDA Data Governance, data governance framework). This **admin
  management module** is not documented.

### 6. Interactive Architecture route — `/architecture`
- Visual system architecture with clickable layers.
- **Doc status:** docs reference a "technical architecture doc" deliverable
  (PRD milestone M1), not a public in-app page.

---

## Tier 2 — Documented Concept, New/Expanded Implementation

The requirement or persona need is in the docs; the specific screen/widget is new.

### 1. Programme Management CRUD
- Routes: `/programs`, `/programs/[id]`, `/programs/[id]/upload`,
  `/programs/[id]/edit`, `/programs/new` (+ `mock/programs.ts`, 19 entries).
- **Doc status:** "programme" IS documented in PRD v2.0 — M&E Officer persona
  = "Programme monitoring teams" (L86), "Programme teams" (L88), "disease-specific
  programmes" (L171), "Programme Lead" (L960). There is also a
  `programme-implementation-tracker` dataset. The dedicated **CRUD routes** are
  net-new; the concept is documented.

### 2. Ward-level analytics drill-down — `/analytics`
- Ward-level disease burden charts.
- **Doc status:** wards ARE documented — PRD v2.0 ward dropdown (L412, L456),
  ward stats (L428), "Ward Data Officer" persona (L87); Master Build Plan
  B7.09/B7.11/B7.14/B7.15; plus "Ward Administrative Boundaries" and "ANC & Delivery
  Indicators by Ward" datasets. Only the analytics **chart drill-down** is new.

### 3. Outbreak alert banner — homepage
- **Doc status:** outbreak alerting IS documented — PRD v2.0 L85 lists "outbreak
  alerts" as a Disease Surveillance Officer need; §2.2 = "Delayed Disease
  Surveillance & Outbreak Response". Only the homepage **banner** is new.

### 4. In-app notification center — `/dashboard/notifications`
- **Doc status:** notifications ARE documented — PRD v2.0 §FR-14 (full section),
  FR-10, and "in-app notification bell (future milestone)" (L765). Master Build
  Plan A5.07, B9.04, C2.11 also reference notifications. This delivers a documented
  **future milestone** early.

### 5. Platform ownership / data sovereignty section — `/about`
- **Doc status:** theme IS documented — PRD v2.0 §2.4 "Data Ownership & Governance
  Deficits" and BG-3 (data must remain state-owned). The About-page **section** is
  a new presentation.

---

## Tier 3 — Documented Tasks Already Completed (NOT "bonus")

These were listed as TODO in the Master Build Plan and are already built. They are
completed spec items, not features beyond spec.

| Task ID | Task | Actual status |
|---|---|---|
| A5.07 | Add `mock/activity.ts` and `mock/analytics.ts` | Done (320 / 233 lines) |
| B7.16 | Create `mock/facilities.ts` (minimum 50) | Done — **54** facilities |
| B7.19 | Create `mock/campaigns.ts` | Done — 4 campaigns |
| B8.01 | AI Assistant floating bubble (P2) | Done |
| B7.12 | Compare-two-metrics on map (P3) | Done |

---

## Corrected Data Points

| Metric | Earlier claim | Verified |
|---|---|---|
| Health facilities | "800+" | **54** (generated: 25 LGAs x 2, +4 each for Chanchaga & Bida) |
| Health datasets | "32" | **31** (`ds(...)` definitions) |
| Custom components | "27+ specialized / 60+" | 72 `.tsx` total; ~58 custom (14 shadcn UI) |
| Mock modules | "11 beyond spec / 19 total" | 17 modules total; several are documented (A5.07, B7.16, B7.19) |

---

## Mock Module Documentation Status (verified)

| Mock file | Documentation status |
|---|---|
| `activity.ts` | Documented — A5.07 |
| `analytics.ts` | Documented — A5.07 |
| `campaigns.ts` | Documented — B7.19 |
| `facilities.ts` | Documented — B7.16 |
| `health-datasets.ts` | Documented — PRD §5.4 (25 required; 31 built) |
| `datasets.ts` | Re-export of `health-datasets.ts` |
| `organisations.ts` | Documented — org/publisher model in PRD |
| `groups.ts` | Documented — group/category concept in PRD |
| `users.ts` | Documented — user/RBAC model |
| `notifications.ts` | Documented concept — PRD §FR-14 (future milestone) |
| `alerts.ts` | Documented concept — outbreak alerts (PRD L85) |
| `programs.ts` | Documented concept — programme monitoring (PRD) |
| `documents.ts` | **Undocumented (Tier 1)** |
| `sops.ts` | **Undocumented (Tier 1)** |
| `permissions.ts` | **Undocumented (Tier 1)** — only role RBAC documented |
| `delay.ts` | Utility (mock latency) |
| `index.ts` | Aggregator/barrel |

---

## Implications for Documentation

1. **Update Master Build Plan v1.0** — mark A5.07, B7.16, B7.19, B8.01, B7.12 as
   complete.
2. **Update PRD v2.0** — formally adopt (or mark "experimental") the Tier 1
   net-new features: Document Repository, Partner Data portal, User Groups,
   granular Permission delegation, Admin Governance module, Architecture route.
3. **Promote Tier 2 items** from "future milestone / persona need" to delivered
   features in the spec (notifications, ward analytics, outbreak banner, programme
   CRUD, data-sovereignty section).
4. **Do not describe Tier 3 as bonus** — they are completed spec tasks.

---

## Conclusion

- The prototype genuinely exceeds spec, but by **~6 Tier-1 net-new areas + ~5
  Tier-2 expansions**, not "40+ undocumented features."
- Two earlier data points were wrong: **54 facilities** (not 800+) and **31
  datasets** (not 32).
- Build and typecheck both pass with zero errors.

This remains strong work; the documentation just needed accurate classification.
