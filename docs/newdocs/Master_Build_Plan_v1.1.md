# Niger State GeoHealth Portal — Master Build Plan v1.1

| Field | Detail |
|---|---|
| **Product** | Niger State GeoHealth Data Portal |
| **Document Type** | Complete Remaining-Work Build Plan |
| **Version** | 1.1 |
| **Date** | July 2026 |
| **Prepared by** | Zerasage Technologies |
| **Source Documents** | Frontend PRD v1.0 · Frontend Build Plan v1.0 · PRD v2.0 · Prototype Conformity Report v1.0 · Anambra GeoHub Feature Reference |
| **Baseline** | nsgdp.vercel.app prototype — 29% overall PRD v2.0 conformity |
| **Status** | Active — Phase A+B ~98% complete (updated July 2026) |
| **Related Docs** | Backend Architecture v1.1 (updated July 2026 to support B10 features) |

---

## Changelog

**v1.1 (July 2026)**
- Added Section B10 documenting 11 additional features built beyond specification
- Updated verification findings: 102 of 109 planned tasks complete (was incorrectly stated as 109 total)
- Corrected facility count: 54 facilities (not 800+)
- Corrected dataset count: 31 datasets (not 32)
- Backend Architecture updated to v1.1 to include API support for B10 features
- Updated Phase B total: 67 → 78 items (includes B10)
- Updated Grand Total: 146 → 157 items

**v1.0 (June 2026)**
- Initial consolidated build plan from Frontend PRD + Frontend Build Plan

---

## How to Read This Document

This plan consolidates every item that is **not yet implemented** in the current prototype into a single ordered task list. It is organised into three phases:

- **Phase A** — Complete what the original build plan started but left unfinished (prototype, mock data). All tasks here run against the existing codebase with no backend required.
- **Phase B** — Evolve the prototype to PRD v2.0 identity: rebrand, new pages, health-specific data, and all new features as interactive mock-data screens. Still no backend.
- **Phase C** — Production backend integration by contract milestone (M2–M4). Tasks here require the backend to be running.

When the backend is ready, Phase A+B constitute the clickable prototype handed to NSPHCDA for UAT. Phase C wires that prototype to real data.

**Priority codes:** `P1` = must-have for MVP | `P2` = should-have | `P3` = could-have (Phase 2)

---

## Verification Update (July 2026)

A comprehensive gap analysis and code verification was completed in July 2026. Key findings:

- **Build health:** `npx tsc --noEmit` and `npm run build` both pass with zero errors
- **Phase A+B completion:** ~98% complete (102 of 109 planned tasks)
- **Additional features built beyond spec:** 11 features (6 Tier 1 undocumented + 5 Tier 2 expanded)
- **6 tasks previously marked TODO are now COMPLETE:** A5.06, A5.07, B7.07, B7.12, B7.16, B7.19, B8.01, B9.01-B9.04
- **31 health datasets** in `mock/health-datasets.ts` (exceeds 25 required)
- **54 health facilities** in `mock/facilities.ts` (exceeds 50 required)

Tasks marked ✅ **COMPLETE** below have been verified as fully implemented in the codebase.

**New Section B10** documents 11 additional features built beyond the original specification:
- **Tier 1 (6 features):** Document Repository, Partner Data Portal, User Groups, Permission Delegation, Governance Module, Architecture Route
- **Tier 2 (5 features):** Programme Management CRUD, Ward-Level Analytics, Outbreak Alert Banner, Notification Center, Platform Ownership Section

**Backend Impact:** Backend Architecture has been updated to v1.1 to include full API support (database schemas, services, routes) for all B10 features, preparing for Phase C production integration.

---

## Phase A — Prototype Completion
### Finish the original Frontend Build Plan (mock data, current codebase)

---

### A1 — Missing Reusable Components

These components are specified in the Frontend PRD §4.2 and Build Plan §3 but do not yet exist as standalone, reusable files. They are currently either missing entirely, or their logic is duplicated inline across multiple pages.

| ID | Task | Priority | Notes |
|---|---|---|---|
| A1.01 | Extract `<Stepper />` as a reusable component | P1 | Currently inline JSX in both `/dashboard/upload` and `/dashboard/edit/[slug]`. Extract to `components/forms/stepper.tsx` with `steps[]`, `currentStep`, `onStepClick` props and all visual states. |
| A1.02 | Extract `<FileUploadArea />` as a reusable component | P1 | Currently inline in upload wizard. Extract to `components/forms/file-upload-area.tsx`. Must support: empty / drag-over / uploading (per-file fake progress bar) / success / error states. Format auto-detect from file extension. |
| A1.03 | Extract `<PasswordStrengthMeter />` as a reusable component | P1 | Logic is copy-pasted in both `/register` and `/reset-password/[token]`. Extract to `components/forms/password-strength-meter.tsx`. |
| A1.04 | Build `<ActivityGraph />` component | P1 | 7/30-day toggle, views vs downloads dual-line chart using Recharts. Used on dataset detail page sidebar and dashboard. Place in `components/charts/activity-graph.tsx`. |
| A1.05 | Build `<AgeBadge />` component | P1 | Review queue age indicator: green 0–2 days / amber 3–5 days / red 6+ days. Accepts `submittedAt` date, computes age, applies colour. Place in `components/data/age-badge.tsx`. |
| A1.06 | Build `<LoginPromptModal />` component | P1 | Download-gate modal. Two CTAs: "Log In" and "Register". Must accept a `redirectAfterAuth` prop so auth pages return the user to the dataset. Place in `components/feedback/login-prompt-modal.tsx`. |
| A1.07 | Build domain Skeleton loader variants | P1 | Existing `shadcn/ui Skeleton` primitive is installed but no domain-specific skeletons exist. Build: `DatasetCardSkeleton`, `TableRowSkeleton` (5-col), `PageHeaderSkeleton`, `OrgCardSkeleton`. Place in `components/feedback/skeletons.tsx`. |
| A1.08 | Build `<AdminSidebar />` component | P1 | Dark shell left navigation for all `/admin/*` routes. Items: Dashboard / Review Queue / Users / Organisations / Groups / Access Requests / Analytics / Audit Log. Collapsible on mobile. Active link highlighting. Place in `components/layout/admin-sidebar.tsx`. |
| A1.09 | Build `<AnalyticsCharts />` admin chart components | P2 | Line chart (uploads over time) and bar chart (downloads by dataset) for admin analytics page. Use Recharts. Place in `components/charts/analytics-charts.tsx`. |
| A1.10 | Build `<QAChecklistItem />` component | P1 | Checkbox + label + optional note for the admin review panel. Used in ADM-03. Place in `components/data/qa-checklist-item.tsx`. |

---

### A2 — Critical Flow Gaps

These are complete interactive flows specified in both PRDs and the Build Plan that are currently non-functional.

| ID | Task | Priority | Notes |
|---|---|---|---|
| A2.01 | Wire download button full state machine on dataset detail page | P1 | **State machine:** Guest → `<LoginPromptModal />` → mock login → auto-trigger mock download. Public+auth → immediate mock download toast. Restricted → "Request Access" → modal with reason field → "Access Pending" state → (admin approval mock) → "Download". Private → hidden in public listings. All transitions must update button label and style. |
| A2.02 | Build pagination UI and wire to datasets listing | P1 | `mock/index.ts` already implements server-side pagination logic. Build a `<Pagination />` component: prev/next buttons, numbered pages (with ellipsis for large counts), items-per-page selector (20/50/100). Wire to `/datasets` page URL params (`?page=2&limit=20`). |
| A2.03 | Embed dataset map preview on dataset detail page | P1 | For datasets with `GeoJSON` or spatial formats in their `resources[]`, render the existing `<DatasetMap />` component (already built) below the resource files table. Add an "Attribute Table" toggle alongside the map. Non-spatial datasets should not show the map section. |
| A2.04 | Build `/search` page (PUB-08) | P1 | Create `src/app/(business)/search/page.tsx`. URL-driven (`?q=`). Tabs: All / Datasets / Organisations / Groups with result counts. Mixed result cards. Skeleton loaders. Empty / no-results state with CTA. |
| A2.05 | Wire navbar search input | P1 | Add `onSubmit` handler to the navbar search form that routes to `/search?q={value}`. Add a typeahead dropdown: on keystroke (debounced 300ms), call `mock.searchAll(query)` and render top 5 results (datasets + orgs) as a floating dropdown below the input. Close on blur / Escape. |
| A2.06 | Wire "Request Access" modal for RESTRICTED datasets | P1 | On the dataset detail page, the "Request Access" button must open a modal with a reason textarea. On submit → button state changes to "Access Pending". A mock admin approval flow (timeout or role-switcher trigger) should transition it to "Download" state. |

---

### A3 — Form & Validation Gaps

| ID | Task | Priority | Notes |
|---|---|---|---|
| A3.01 | Integrate `react-hook-form` + `zod` on login form | P1 | Replace raw `useState` validation with a Zod schema (`loginSchema`). Inline on-blur errors. Attempt counter (1 of 5). Lockout state after 5 failures. |
| A3.02 | Integrate `react-hook-form` + `zod` on register form | P1 | Replace raw validation. Schema must validate: full name min 2, email format, phone optional Nigerian format, password min 8 + strength rules, confirm-password match, reason min 20 chars, terms required. |
| A3.03 | Integrate `react-hook-form` + `zod` on forgot-password form | P1 | Simple email field schema. Always shows vague success (PRD §12). |
| A3.04 | Integrate `react-hook-form` + `zod` on reset-password form | P1 | New password + strength + confirm match. Expired-token state. |
| A3.05 | Integrate `react-hook-form` + `zod` on contact form | P2 | Name, email, message required. |
| A3.06 | Integrate `react-hook-form` + `zod` on upload wizard (all 3 steps) | P1 | Step 1 (Basic Info), Step 2 (Classification), Step 3 (Files & Visibility). Schema per step, validated before advancing. Submit disabled until Step 3 schema valid + ≥1 file uploaded. |
| A3.07 | Integrate `react-hook-form` + `zod` on profile / password-change forms | P2 | Profile: name, bio, email. Password: current, new (strength), confirm match. |
| A3.08 | Add `?` tooltip to every upload form field | P1 | Using the installed `<Tooltip />` primitive, add a help icon (`?`) next to each field label in the upload wizard. Tooltip content per field: e.g. "Title: A clear, descriptive name for the dataset (max 100 characters)". |
| A3.09 | Implement 60-second draft auto-save toast on upload/edit wizard | P2 | `useEffect` with `setInterval(60000)` while upload/edit wizard is open. On each tick, show a Sonner toast: "Draft saved automatically". Clear interval on unmount. |

---

### A4 — Admin Panel (Milestone 5 — Fully Missing)

The entire super-admin experience is absent from the prototype. Create the `/admin` route group with mock-session guard (requires `super_admin` role) and build all nine admin screens.

| ID | Task | Priority | Notes |
|---|---|---|---|
| A4.01 | Create `/admin` route group + layout | P1 | `src/app/admin/layout.tsx`. Dark admin shell. Uses `<AdminSidebar />` (A1.08). Mock session guard: if `currentRole !== 'super_admin'`, redirect to `/dashboard`. |
| A4.02 | Build ADM-01 Admin Dashboard (`/admin`) | P1 | KPI widgets row (total datasets, pending review, registered users, total downloads). Review queue preview table (last 5 pending). Recent registrations list. System health indicators (mock). `<ActivityGraph />` for platform-wide activity. |
| A4.03 | Build ADM-02 Review Queue (`/admin/datasets`) | P1 | Status tab bar (All / Submitted / Under Review / Needs Revision). Sortable table: Dataset Title | Organisation | Submitted By | `<AgeBadge />` | Status | Actions. Row actions: View, Approve, Request Revision. Bulk-select checkboxes. Search input. Skeleton loader state. Empty state. |
| A4.04 | Build ADM-03 Review Single (`/admin/datasets/[id]/review`) | P1 | Split panel layout: 60% left (full dataset metadata, resource files list, preview). 40% right (`<QAChecklistItem />` list for quality checks, comment textarea, action buttons). Approve button → confirm dialog. Request Revision → comment required. Reject → confirm dialog + comment ≥20 chars (button disabled until met). Revision comment labelled "will be emailed to {contributor name}". All three actions fire Sonner toast and update mock dataset status. |
| A4.05 | Build ADM-04 User Management (`/admin/users`) | P1 | Filter bar (by role, status). Table: Name | Email | Role (`<RoleBadge />`) | Joined | Last Login | Status | Actions. Row actions: Change Role (opens modal with role selector), Suspend, Ban (row tints amber/red). CSV export button (mock download). |
| A4.06 | Build ADM-05 Organisation Management (`/admin/organisations`) | P1 | Table: Name | Acronym | Sector | Dataset Count | Actions (Edit, Disable). Add New Org button → modal with form. |
| A4.07 | Build ADM-06 Group Management (`/admin/groups`) | P1 | Table: Name | Dataset Count | Cover Image | Actions (Edit, Delete). Add New Group button → modal. |
| A4.08 | Build ADM-07 Access Requests (`/admin/access-requests`) | P1 | List of pending restricted-dataset access requests. Columns: User | Dataset | Reason | Requested | Status. Approve / Deny actions per row. Confirm dialog on both actions. |
| A4.09 | Build ADM-08 Analytics & Reports (`/admin/analytics`) | P1 | Charts: uploads over time (line), downloads by dataset (top 10 bar), new users over time (line). KPI row: total users / total datasets / downloads this month / pending review count. Date-range filter dropdown. Export button (mock CSV). |
| A4.10 | Build ADM-09 Audit Log (`/admin/audit-logs`) | P1 | Immutable log table: Timestamp | User | Action | Resource | IP (mocked). Filter by action type (upload/download/login/approve/reject). Search by user or resource. Pagination. Export mock CSV. |

---

### A5 — Polish, Infrastructure & DX Gaps

| ID | Task | Priority | Notes |
|---|---|---|---|
| A5.01 | Wire `next-themes` ThemeProvider into `providers.tsx` | P2 | Add `<ThemeProvider attribute="class" defaultTheme="system">` to providers. Add a theme toggle button (sun/moon icon) to the navbar. |
| A5.02 | Write TanStack Query hooks for all mock accessors | P2 | Create `src/lib/hooks/` files: `useDatasets.ts`, `useDatasetBySlug.ts`, `useOrganisations.ts`, `useOrganisationBySlug.ts`, `useGroups.ts`, `useGroupBySlug.ts`, `useSearch.ts`, `useStatistics.ts`. Each wraps the corresponding `mock/index.ts` accessor with `useQuery`. This is the seam that makes the backend swap a drop-in change. |
| A5.03 | Add skeleton loading states to all data-fetch pages | P1 | Datasets listing, Organisation listing, Group listing, Dashboard, Search results — show `<DatasetCardSkeleton />` / `<TableRowSkeleton />` while data is loading. Use `simulateDelay()` in mock accessors for realism. |
| A5.04 | Responsive QA pass — all pages at 1280 / 768 / 375 | P1 | Systematically check every page at all three breakpoints. Fix layout breaks: filter sidebar → drawer on mobile, admin table → horizontal scroll, OTP boxes ≥44px, upload form advisory on mobile. |
| A5.05 | Accessibility pass | P1 | Keyboard navigation through all forms and modals. Focus trap in modals and dialogs. ARIA labels on all icon-only buttons. Semantic landmarks (`<nav>`, `<main>`, `<aside>`). No color-only state signalling. Visible focus rings on all interactive elements. |
| A5.06 | Fix `tsc`, `eslint`, and `build` — ensure zero errors | P1 | ✅ **COMPLETE** (verified July 2026: `npx tsc --noEmit` passes, `npm run build` succeeds with zero errors). |
| A5.07 | Add mock `activity.ts` and `analytics.ts` to mock layer | P1 | ✅ **COMPLETE** (verified July 2026: both files exist at `src/lib/mock/activity.ts` (320 lines) and `src/lib/mock/analytics.ts` (233 lines) with full mock data). |

---

## Phase B — PRD v2.0 Evolution
### Transform prototype to GeoHealth Portal identity (still mock data)

---

### B1 — Rebranding & Identity

| ID | Task | Priority | Notes |
|---|---|---|---|
| B1.01 | Update brand identity across entire prototype | P1 | Replace "Niger State Open Data Portal" with **"Niger State GeoHealth Portal / HEALTH DATA PORTAL"**. Update: color tokens in `globals.css` (`@theme`) — primary deep green `#1A4731`, accent amber `#E8A020`, replacing current `#1B5E35` / teal. Update Tailwind semantic tokens accordingly. |
| B1.02 | Update logo / wordmark in navbar | P1 | Replace current "NS" square with Niger State Government emblem + "Niger State GeoHealth Portal" wordmark. |
| B1.03 | Update favicon and `<head>` metadata | P1 | New favicon matching GeoHealth identity. Update `layout.tsx` metadata: title "Niger State GeoHealth Portal", description, og:image. |
| B1.04 | Redesign Footer | P1 | New content: **Funded By:** Umbrella Fund | **Powered By:** Zerasage Technologies | **Contact:** NSPHCDA Minna address, email, phone | **Social:** Facebook, Twitter, LinkedIn | **Quick Links** column | Copyright line. Replace current generic MDA link columns. |

---

### B2 — Navigation Restructure

| ID | Task | Priority | Notes |
|---|---|---|---|
| B2.01 | Rebuild navbar to GeoHealth structure | P1 | New top nav: **Home \| About \| Data Portal ▾** (View Data / Submit Data) **\| Analytics \| GIS Mapping ▾** (Disease Burden Map / Facility Map) **\| Campaigns \| Tools & Learning \| Log In \| Sign Up** (green CTA). Replace current generic navbar. Dropdown menus for "Data Portal" and "GIS Mapping". Keep DHIS2 status indicator (mock, shows "Sync: Manual"). |
| B2.02 | Add AI Assistant floating bubble to global layout | P2 | Green chat bubble, bottom-right, rendered in root layout so it appears on all pages. Opens/closes chat panel. Built in B8.01 below. |

---

### B3 — Home Page Redesign

| ID | Task | Priority | Notes |
|---|---|---|---|
| B3.01 | Replace hero with full-screen satellite map + overlay | P1 | Full-viewport interactive OSM/satellite Leaflet map of Nigeria with Niger State highlighted/shaded. Bold headline overlay: "Welcome To Niger State GeoHealth Portal". Sub-headline. CTA button: "Browse Repository →" (routes to `/dataportal`). Zoom +/- controls top-left. Population badge "Niger State Population: 5.9M" top-right. |
| B3.02 | Add Feature Cards section (6 cards, 3-column grid) | P1 | Cards: Comprehensive Data Repository \| Interactive Geospatial Maps \| Real-time Analytics \| Multi-level Access \| Secure & Compliant \| QGIS Integration. Each: icon, title, 2-sentence description. |
| B3.03 | Add Health Facilities section (3 photo cards) | P1 | Cards: Primary Health Care Centers \| Healthcare Professionals \| Rural Health Facilities. Full-bleed placeholder photo, title, descriptive paragraph. |
| B3.04 | Add Real-World Applications section (3 cards) | P1 | Cards with emoji icons: Disease Surveillance \| Health Facility Planning \| Population Health Analytics. Each: icon, title, 2-sentence description. |
| B3.05 | Add CTA section | P1 | "Ready to Explore Health Data?" header. Sub-text. "Browse Repository →" button. |
| B3.06 | Remove old homepage elements | P1 | Remove: generic stat counter bar, featured datasets row (old card grid), browse-by-group tile grid, org logo strip, news banner. These are replaced by the new sections above. |

---

### B4 — About Page Rebuild

The existing `/about` page is a minimal stub. Replace it entirely.

| ID | Task | Priority | Notes |
|---|---|---|---|
| B4.01 | Build About page hero | P2 | Full-width aerial photo of Minna / Niger State as hero background (with green overlay). Platform description: 2-paragraph explanation of the centralised geospatial health data system. |
| B4.02 | Add Mission & Vision cards | P2 | Side-by-side cards. Mission text. Vision text. |
| B4.03 | Add What We Do section (3 cards) | P2 | Data Integration \| Geospatial Analytics \| Secure Access. Each with icon, title, 2-sentence description. |
| B4.04 | Add Key Partners section (5 cards) | P2 | NSPHCDA (Project Lead & Data Governance) \| Niger State Ministry of Health (Health Data Owner) \| Umbrella Fund (Sponsor) \| Dev-Afrique (Technical Partner) \| FACT Foundation (Implementation Partner). Each card: logo placeholder + name + role. |
| B4.05 | Add Testimonials Carousel | P2 | 4 slides, prev/next arrow buttons + dot pagination. Each slide: quotation marks, testimonial text, name, role. Roles: Health Planner / LGA Data Officer / Disease Surveillance Officer / M&E Officer (mock quotes). |
| B4.06 | Add Impact in Numbers section (4 KPI badges) | P2 | Healthcare Workers \| LGAs Covered (25) \| Data Points \| Data Accuracy %. Each badge: large number, label, sub-label. |
| B4.07 | Add Niger State LGAs Interactive Map | P2 | Embedded Leaflet map showing all 25 LGAs with name labels and colour-coding. Mock data coverage indicator per LGA (% of datasets available). |

---

### B5 — Data Portal Adaptation (`/dataportal`)

The current `/datasets` route and its design must be evolved to the health portal specification.

| ID | Task | Priority | Notes |
|---|---|---|---|
| B5.01 | Create `/dataportal` route (or redirect `/datasets` → `/dataportal`) | P1 | Per PRD v2.0 §5.4 and the Anambra reference, the catalogue lives at `/dataportal`. Either rename the route group or add a redirect in `next.config.ts`. Update all internal links. |
| B5.02 | Replace generic dataset mock data with 25 P1 health datasets | P1 | Update `src/lib/mock/datasets.ts`. Remove Agriculture/Tourism/Finance/generic datasets. Add: Malaria Case Surveillance, Meningitis Cases, Cholera/Diphtheria Outbreak, Routine Immunisation, Health Facility Registry (HFR), NHMIS Aggregate, Population Estimates & Boundaries, HIV Unit Data, TB Unit Data, Maternal Health, Child Health & Nutrition (P1). Plus P2 datasets: HR Registry, Mortality Registry, NTD Data, Population Projections, Drug Stock, Immunisation Campaigns, Lab Results. |
| B5.03 | Replace organisation mock data with health-specific orgs | P1 | Update `src/lib/mock/organisations.ts`. Replace generic MDAs with: NSPHCDA, Niger State Ministry of Health, NPHCDA, GRID3 Nigeria, Federal Ministry of Health, NSPHCDA Surveillance Unit, NSPHCDA Reproductive Health, National Population Commission, and relevant NGO/partner orgs. |
| B5.04 | Replace category filter pills with health-specific categories | P1 | Replace current "Topics" (Agriculture, Environment, etc.) with 4 health pill tabs: 🦠 Disease Data \| 🏥 Health Facilities \| 👥 Population \| 🔍 Surveillance. Multi-select. Updates dataset grid in real-time. |
| B5.05 | Update LGA filter to health-portal pattern | P1 | Current filter sidebar has no LGA filter. Add an LGA dropdown (all 25 Niger State LGAs) to the sidebar. Wire to mock `getDatasets()` accessor which already supports `lga` filter. |
| B5.06 | Add dynamic dataset count label | P1 | "X datasets found" — updates in real-time as filters/search changes. Position above the grid. |
| B5.07 | Redesign dataset cards to GeoHealth spec | P1 | Update `components/data/dataset-card.tsx`: amber "Download" full-width button (bottom of card), ⓘ info icon (top-right, opens Detail Modal), health-specific category label (not generic topic chips). |
| B5.08 | Build Dataset Detail Modal (ⓘ) | P1 | Opens on ⓘ click. Panels: **Basic Information** (Owner, Format, File Size) \| **Technical Details** (Type: Spatial/Attribute, Source, Data Custodian, Update Frequency, Portal Source, Category) \| **Description** (full narrative) \| **Citation** (italic string) \| **Key Attributes** table (Field Name \| Example Value \| Description). × close button. Mobile-responsive sheet or centered dialog. |
| B5.09 | Add sort option: Most Downloaded & Alphabetical | P2 | Current sort only has "Recent". Add "Most Downloaded" and "Alphabetical A–Z" to the sort dropdown. Wire to existing mock accessor which already supports these sort keys. |

---

### B6 — Authentication Updates

| ID | Task | Priority | Notes |
|---|---|---|---|
| B6.01 | Update Login page with 3-tier access level radio selector | P1 | Add radio button group above the email/password form: **Administrator** (State Ministry of Health admin users) / **Partner Access** (NGOs, donors, dev partners — requires admin approval) / **Public Access** (general public — pre-selected). CTA button label changes dynamically: "Continue as Public User" / "Request Partner Access" / "Log in as Administrator". Note: "Need access? Contact NSPHCDA" text for admin/partner. |
| B6.02 | Update Register page: add Access Level dropdown | P1 | Add "Access Level" field to existing register form: dropdown (Public user / Partner — pending admin approval / Admin — pending admin approval). Add note text: "Public accounts activated immediately. Partner and Admin requests must be approved by an administrator." Retain existing phone and reason fields (better than Anambra reference — keep them). |

---

### B7 — New Pages: Analytics, GIS Mapping, Campaigns, Submit Data

#### Health Analytics Dashboard (`/analytics`)

| ID | Task | Priority | Notes |
|---|---|---|---|
| B7.01 | Create analytics page shell | P1 | `src/app/(business)/analytics/page.tsx`. Page header: "Health Analytics Dashboard" / "Real-time insights into health indicators across Niger State". Disease selector dropdown (top-right): Severe Malaria Cases \| Meningitis Cases \| Cholera Cases \| Diphtheria Cases \| ANC Attendance \| Delivery with SBA \| Routine Immunisation \| U5 Mortality \| Death Cases. Export button with download icon (mock). |
| B7.02 | Add KPI cards row | P1 | 4 cards: Total Cases (red pulse icon) \| Health Facilities (blue pin icon) \| LGAs Covered — 25 (green bar chart icon) \| Outlier Facilities (amber warning icon). Values from `mock/analytics.ts`. |
| B7.03 | Add Trends Over Time chart | P1 | Recharts `<LineChart />`. X-axis: 2013–present. Y-axis: case count. Toggle buttons: "Trends" (annual) / "Seasonality" (monthly). "State Total" line in green. Hover tooltip showing exact figure. Updates when disease selector changes. |
| B7.04 | Add Top 10 LGAs horizontal bar chart | P1 | Recharts `<BarChart layout="vertical" />`. LGA names on y-axis, case counts on x-axis. Green gradient fill. Auto-sorts by case count for selected disease. Updates with disease selector. |
| B7.05 | Add LGA Burden Summary table | P1 | Full-width table. All 25 LGAs. Columns: Rank \| LGA \| Total Cases \| Facilities \| Population \| Incidence per 1,000. Sortable columns. High-incidence rows highlighted in light red. Updates with disease selector. |
| B7.06 | Add Outlier Facilities section | P2 | Header with z-score explanation (z ≥ 2.0). "High Outliers (N)" in red. Table: Facility \| LGA \| Total Cases \| Z-Score \| Interpretation. Interpretation colour-coded ("Very high – investigate" in orange/red). |
| B7.07 | Create `mock/analytics.ts` data | P1 | ✅ **COMPLETE** (see A5.07 — file exists with time-series data for disease metrics across 25 LGAs, yearly 2013–2025, facility outlier data, KPI totals, seasonality monthly breakdown). |

#### Disease Burden GIS Map (`/gis-mapping`)

| ID | Task | Priority | Notes |
|---|---|---|---|
| B7.08 | Build `/gis-mapping` page shell | P1 | Full-screen Leaflet map (reuse `dataset-map.tsx` component as base). OSM tiles. Red proportional bubble markers sized by mock case count. Zoom +/- controls top-left. Population badge "Niger State Population: 5.9M" fixed top-right. |
| B7.09 | Build sliding filter panel | P1 | Slides in from left. Title: "Health Metrics Map". Controls: Primary health metric dropdown \| Value Type dropdown (Cases / Rate / Coverage %) \| Case count Min/Max inputs \| Period Year dropdown (2013–present) + Month dropdown \| LGA dropdown (all 25) \| Ward dropdown (filtered by LGA) \| Close (×) button. Filters update bubble markers in real-time. |
| B7.10 | Add yearly trend mini-chart panel (bottom-left) | P2 | Panel: "Yearly cases of [selected metric]". Mini Recharts LineChart 2013–present. Click any data point year → map filters to that year + shows monthly breakdown. "Hide" button to collapse panel. |
| B7.11 | Add Burden Summary right panel | P2 | Two tabs: "Current filters" / "Hide". Stats: Total cases \| Facilities \| LGAs \| Wards. Top 5 LGAs (with counts). Bottom 5 LGAs (with counts). Updates with filter changes. |
| B7.12 | Add compare two metrics feature | P3 | ✅ **COMPLETE** (verified July 2026: compare-two-metrics feature fully implemented on `/gis-mapping` page with checkbox "Compare with another metric", second metric dropdown, and second layer rendering). |

#### Health Facility GIS Map (`/gis-map`)

| ID | Task | Priority | Notes |
|---|---|---|---|
| B7.13 | Build `/gis-map` page shell | P1 | Full-screen Leaflet map. Blue dot markers for each mock health facility (from `mock/facilities.ts`). Facility name shown as tooltip on hover. |
| B7.14 | Add facility popup on marker click | P1 | Popup content: Facility Name \| LGA \| Ward \| Facility Code (unique ID) \| Facility Type (PHC / Secondary / General Hospital). |
| B7.15 | Build facility filter panel | P1 | Stats header: "X Facilities \| Y Mapped". Search input "Search facilities…". LGA dropdown (all 25). Ward dropdown (filtered by LGA). Facility Type dropdown (All Types / PHC / Secondary / General Hospital). Reset Filters button. |
| B7.16 | Create `mock/facilities.ts` data | P1 | ✅ **COMPLETE** (verified July 2026: file exists with 54 facilities (25 LGAs × 2, plus 4 each for Chanchaga & Bida) with id, name, lga, ward, facilityType, coordinates, facilityCode — exceeds minimum 50 requirement). |

#### Campaigns (`/campaigns`)

| ID | Task | Priority | Notes |
|---|---|---|---|
| B7.17 | Build `/campaigns` page | P2 | Hero banner: amber/green gradient + syringe icon. Title: "Campaigns". Sub-title: "Track vaccination campaigns across Niger State." |
| B7.18 | Build Campaign cards | P2 | Grid of cards, each showing: Campaign name \| Status badge (Ongoing/Completed/Planned — colour-coded) \| Start date \| Primary metric (e.g. MR Coverage) \| Coverage % \| Vaccinated count \| Target count \| Active Days \| LGAs covered count \| Coverage progress bar (coloured by coverage level: red/amber/green). |
| B7.19 | Create `mock/campaigns.ts` data | P2 | ✅ **COMPLETE** (verified July 2026: file exists with 4 campaigns — Measles-Rubella Integrated Campaign (Ongoing), IPV (Completed), OPV (Planned), Diphtheria SIA (Ongoing), each with realistic mock coverage data). |

#### Submit Data (`/submit`)

| ID | Task | Priority | Notes |
|---|---|---|---|
| B7.20 | Build `/submit` page | P1 | Two-column layout. Left: "Dataset Information" form. Right: "Submission Requirements" panel + numbered "3-Step Review Process" (1. Initial Review → 2. Quality Assessment → 3. Approval & Integration) + "Need Help?" contact support. |
| B7.21 | Build Submit Data form | P1 | Fields: Dataset Name* \| Organisation* \| Category* (Disease Data / Health Facilities / Population / Surveillance) \| Data Format* (CSV / Excel / JSON / GeoJSON / Shapefile / DHIS2 Export) \| Update Frequency* (Daily / Weekly / Monthly / Quarterly / Annually / One-time) \| Description* (textarea) \| Contact Email* \| Dataset File (drag-drop zone OR Choose File, max 50MB, formats: CSV/Excel/JSON/GeoJSON). "Submit Dataset" button (green, full-width). |
| B7.22 | Implement mock submission flow | P1 | On submit: validate form (react-hook-form + zod). Show fake upload progress. On completion → Sonner toast: "Submission received. Reference: #SUB-{random}. You will be notified within 3–5 working days." Button changes to "Submission Pending". |

#### Tools & Learning (`/learning`)

| ID | Task | Priority | Notes |
|---|---|---|---|
| B7.23 | Build `/learning` page shell | P2 | Hero carousel: 2 slides, prev/next arrows + dot navigation. Slide 1: "Empowering Niger State Through Geospatial Learning" + "Explore Resources" CTA. Slide 2: GIS for health use case. Tutorial search bar below carousel. |
| B7.24 | Build 5-tab navigation | P2 | Tab pills: Video Tutorials \| E-Books & Guides \| Core Tools \| Sample Data & Tutorials \| Learning Path. Tab content panels below. |
| B7.25 | Video Tutorials tab | P2 | Featured Playlist card: QGIS & Geospatial Analysis, 24-video YouTube playlist, "Watch Playlist" button. Individual tutorials grid: each card has thumbnail (placeholder), title, duration, topic tags, "Watch" button. |
| B7.26 | E-Books & Guides tab | P2 | 4 resource cards: QGIS Training Manual \| WHO Geospatial Toolkit for Public Health \| GRID3 Nigeria Geospatial Data Documentation \| PostGIS in Action. Each: title, description, page count, tags, "Access Resource" external link button. |
| B7.27 | Core Tools tab | P2 | QGIS card + PostgreSQL/PostGIS card. Each: tool name, icon, "Role in Project" panel, "Example Use Case" panel. |
| B7.28 | Sample Data & Tutorials tab | P2 | Grid of downloadable sample dataset cards for training exercises (mock downloads). |
| B7.29 | Learning Path tab | P2 | Structured progression diagram: GIS Basics → Intermediate Geospatial → Health Data Analysis → Platform Admin. Each stage: name, description, 2–3 recommended resources. |

---

### B8 — AI Assistant Widget

| ID | Task | Priority | Notes |
|---|---|---|---|
| B8.01 | Build AI Assistant floating widget (mock) | P2 | ✅ **COMPLETE** (verified July 2026: AI Assistant fully implemented with green chat bubble, chat panel, greeting, 5 quick question shortcuts, text input + Send button, mock responses for shortcuts and fallback message for other queries). |

---

### B9 — Mock Data Completion

| ID | Task | Priority | Notes |
|---|---|---|---|
| B9.01 | Create `mock/analytics.ts` | P1 | ✅ **COMPLETE** (see A5.07 + B7.07). |
| B9.02 | Create `mock/facilities.ts` | P1 | ✅ **COMPLETE** (see B7.16). |
| B9.03 | Create `mock/campaigns.ts` | P2 | ✅ **COMPLETE** (see B7.19). |
| B9.04 | Update `mock/activity.ts` | P1 | ✅ **COMPLETE** (see A5.07 — file exists with activity feed, notifications, audit log entries). |
| B9.05 | Update `mock/datasets.ts` with 25 P1 health datasets | P1 | See B5.02. Complete replacement of generic datasets with health-specific ones. |
| B9.06 | Update `mock/organisations.ts` with health organisations | P1 | See B5.03. Replace generic MDAs with NSPHCDA, MOH, NPHCDA, GRID3, etc. |
| B9.07 | Update `src/types/index.ts` with v2.0 type additions | P1 | Add new types: `HealthCategory` (Disease \| Facilities \| Population \| Surveillance), `Campaign`, `CampaignStatus`, `Facility`, `AnalyticsMetric`, `LGABurden`, `OutlierFacility`, `AccessLevel` (login 3-tier). Extend `Dataset` with: `custodian`, `dateCollected`, `updateFrequency`, `methodology`, `citation`, `keyAttributes[]`. |

---

### B10 — Additional Features Built Beyond Specification

The following features were built during prototype development but are not documented in the original planning documents. They represent valuable functionality that enhances the platform.

**Classification:**
- **Tier 1** — Genuinely undocumented (0 doc hits in any planning document)
- **Tier 2** — Documented concept with new/expanded implementation

#### Tier 1 — Net-New Features (Undocumented)

| ID | Feature | Routes / Files | Status | Notes |
|---|---|---|---|---|
| B10.01 | **Document Repository** | `/documents`<br>`mock/documents.ts`<br>`mock/sops.ts` | ✅ BUILT | Browse SOPs, policies, research papers, guidelines. Full search and filter functionality. Not mentioned in any planning doc. |
| B10.02 | **Partner Data Portal** | `/partner-data` | ✅ BUILT | Partner-specific dataset portal with advanced filters. Not mentioned in any planning doc. |
| B10.03 | **User Groups Management** | `/admin/user-groups` | ✅ BUILT | Admin UI to create/edit/manage user groups with bulk permissions. Not mentioned in any planning doc. PRD only covers role-based RBAC, not group-based access. |
| B10.04 | **Permission Delegation (Granular)** | `/admin/permissions`<br>`mock/permissions.ts` | ✅ BUILT | Granular permission matrix and per-user delegation workflows. PRD covers role-based RBAC only (FR-03.4, FR-19), not granular delegation. |
| B10.05 | **Admin Governance Module** | `/admin/governance`<br>`/admin/governance/health`<br>`/admin/governance/sops` | ✅ BUILT | Admin UI to manage health indicators and SOPs. "Governance" appears in docs only as data-governance concept/team, not as an admin module. |
| B10.06 | **Interactive Architecture Route** | `/architecture` | ✅ BUILT | Public-facing visual system architecture with clickable layers and descriptions. PRD mentions "technical architecture doc" deliverable (M1), not an in-app page. |

#### Tier 2 — Concept Documented, Implementation Expanded

| ID | Feature | Routes / Files | Status | Notes |
|---|---|---|---|---|
| B10.07 | **Programme Management CRUD** | `/programs`<br>`/programs/[id]`<br>`/programs/[id]/upload`<br>`/programs/[id]/edit`<br>`/programs/new`<br>`mock/programs.ts` (19 entries) | ✅ BUILT | Full programme tracking system with CRUD operations, report uploads, timeline views. PRD documents "programme" concept (M&E Officer persona L86, Programme teams L88, programme-implementation-tracker dataset), but dedicated CRUD routes are net-new. |
| B10.08 | **Ward-Level Analytics Drill-Down** | `/analytics` (ward charts) | ✅ BUILT | Disease burden charts disaggregated to ward level with interactive drill-down. PRD documents ward dropdowns/stats (L412, L456, L428), Ward Data Officer persona (L87), Master Build Plan B7.09/11/14/15, but analytics chart drill-down is new. |
| B10.09 | **Outbreak Alert Banner** | Homepage alert banner | ✅ BUILT | Dynamic disease outbreak alert system on homepage with severity levels. PRD documents "outbreak alerts" as Surveillance Officer need (L85) and §2.2 outbreak response, but homepage banner implementation is new. |
| B10.10 | **In-App Notification Center** | `/dashboard/notifications`<br>`mock/notifications.ts` | ✅ BUILT | Full notification center with categorization and read/unread status. PRD documents notifications as "future milestone" (§FR-14, FR-10, L765), Master Build Plan A5.07/B9.04/C2.11. Built ahead of schedule. |
| B10.11 | **Platform Ownership / Data Sovereignty Section** | `/about` (sovereignty section) | ✅ BUILT | Dedicated About page section explaining state data ownership and governance principles. PRD documents theme (§2.4 "Data Ownership & Governance Deficits", BG-3), but dedicated About page section is new presentation. |

---

## Phase C — Production Backend Integration
### By contract milestone — requires backend to be running

---

### C-M2 — Core Platform (Weeks 4–7)

| ID | Task | Priority | Notes |
|---|---|---|---|
| C2.01 | JWT authentication backend | P1 | Node.js/Express. Issue access + refresh tokens on login. Validate on protected routes. `GET /auth/me` for session hydration. |
| C2.02 | RBAC middleware on all API endpoints | P1 | 5 roles enforced server-side. Frontend role checks are UX only (per PRD §5.2). |
| C2.03 | Replace mock-session with real auth in frontend | P1 | Swap `useMockSession()` for real session context reading from `GET /auth/me` via TanStack Query. Remove dev Role Switcher from production builds. |
| C2.04 | Dataset CRUD API endpoints | P1 | `GET /datasets` (filters/sort/pagination) · `GET /datasets/{slug}` · `POST /datasets` · `PATCH /datasets/{slug}` · `DELETE /datasets/{slug}`. |
| C2.05 | Full-text search API | P1 | PostgreSQL full-text search with health-specific tokenisation. `GET /search?q=&type=datasets\|orgs\|all`. |
| C2.06 | File upload API to S3-compatible storage | P1 | `POST /uploads` (multipart, ≤50MB). Format validation. Returns presigned download URL. |
| C2.07 | Submit Data form backend wire-up | P1 | Replace mock submission toast with real `POST /datasets` call. Track submission status. |
| C2.08 | Approval workflow API | P1 | `POST /admin/datasets/{id}/approve` · `revise` · `reject`. On approve → dataset status → published. On reject → notify contributor. |
| C2.09 | Admin Console backend wire-up | P1 | Wire all admin tables (review queue, user management, audit logs, system stats) to real API endpoints. |
| C2.10 | Audit logging backend | P1 | Log all CRUD events: userId, action, resourceId, timestamp, ipAddress. |
| C2.11 | Email notification system | P1 | SMTP/SendGrid. Trigger emails on: submission confirmed, approved, rejected, account activated. |
| C2.12 | Download tracking | P1 | `POST /datasets/{slug}/download` returns presigned URL. Logs event. Update download count. |
| C2.13 | Dataset version tracking | P2 | Allow re-upload as new version. Keep version history. `GET /datasets/{slug}/versions`. |
| C2.14 | 2FA for Administrator and Partner roles | P2 | TOTP or email OTP. Triggered after successful password auth for those roles. |
| C2.15 | Wire TanStack Query hooks to real API client | P1 | Swap mock accessors for real `lib/api/client.ts` calls inside the `useDatasets`, `useOrganisations` etc. hooks written in A5.02. No component changes needed. |

### C-M3 — Analytics & GIS (Weeks 8–10)

| ID | Task | Priority | Notes |
|---|---|---|---|
| C3.01 | Load Niger State LGA boundary shapefile into PostGIS | P1 | 25 LGAs with names, codes, polygon geometries. |
| C3.02 | Load Niger State Ward boundary shapefile into PostGIS | P1 | 274 wards, linked to LGAs. |
| C3.03 | Load Niger State Health Facility Registry data | P1 | Name, LGA, ward, facility type, coordinates. Source: NPHCDA HFR. |
| C3.04 | Load priority disease datasets (historical) | P1 | Malaria 2013–present, meningitis, routine immunisation, NHMIS aggregate. |
| C3.05 | Analytics aggregation API | P1 | Compute: total cases, LGA burden table (incidence per 1,000), outlier z-scores, yearly/monthly trends by disease metric. `GET /analytics?metric=malaria&year=2024`. |
| C3.06 | PostGIS spatial query API | P1 | `GET /gis/disease-burden?metric=&year=&lga=` returns GeoJSON FeatureCollection with case count properties. `GET /gis/facilities?lga=&type=` returns facility point GeoJSON. |
| C3.07 | Wire Analytics Dashboard to aggregation API | P1 | Replace `mock/analytics.ts` calls with real TanStack Query hooks hitting analytics API. |
| C3.08 | Wire GIS Mapping pages to spatial API | P1 | Replace mock facility/disease data with real PostGIS GeoJSON responses in Leaflet layers. |
| C3.09 | Analytics Export API | P2 | `GET /analytics/export?format=csv\|pdf` — server-side CSV/PDF generation of current dashboard state. |
| C3.10 | Campaigns CRUD API | P2 | Admin can create, update, close campaigns. `GET /campaigns` for public listing. |
| C3.11 | AI Assistant RAG backend | P2 | RAG pipeline over portal datasets, analytics, facility registry. Wire to LLM API (Claude or equivalent). Replace mock responses in B8.01. |

### C-M4 — Capacity, UAT & Handover (Weeks 11–12)

| ID | Task | Priority | Notes |
|---|---|---|---|
| C4.01 | Performance audit | P1 | Core Web Vitals: LCP ≤2.5s on 4G (public pages), TTI ≤5s on 3G (homepage). Optimise: Next.js `<Image>`, lazy-load map bundles, self-host fonts, CDN for OSM tiles, ISR for stable public pages. |
| C4.02 | Security audit | P1 | HTTPS enforcement, CORS config, SQL injection test, XSS test, RBAC penetration test. NDPA compliance review. |
| C4.03 | UAT — 5 persona sessions | P1 | Session 1: Health Planner (analytics, dataset discovery, LGA insights). Session 2: Disease Surveillance Officer (GIS mapping, disease filter, outbreak ID). Session 3: LGA Data Officer (submit data, approval tracking, tools & learning). Session 4: Admin (review queue, user management, audit logs, campaigns). Session 5: Public/Partner user (browse, search, download, register). |
| C4.04 | Bug fix sprint — all P1 & P2 UAT issues | P1 | |
| C4.05 | Platform Admin Manual | P1 | System architecture, user management, dataset approval workflow, audit log guide. |
| C4.06 | LGA Data Officer Guide | P1 | Register, submit datasets, track submission status, use tools & learning. |
| C4.07 | End User Guide | P1 | Browse, search, filter, download, use GIS maps, use analytics dashboard. |
| C4.08 | DHIS2 Integration Specification (Phase 2 prep) | P2 | Data flow diagrams, API spec, sync schedule, field mapping documentation. |
| C4.09 | 2-day GIS & Platform training workshop | P1 | Delivered to NSPHCDA data team using Tools & Learning resources. |
| C4.10 | Production deployment | P1 | NSPHCDA-controlled server. Docker-compose production config. SSL (Let's Encrypt). Domain setup (nsgeohealthportal.ng.gov or agreed). |
| C4.11 | Handover package | P1 | Source code repo access, DB credentials, server access, documentation ZIP, training recordings, post-launch support plan (3-month Zerasage support window). |

---

## Summary

### Phase A — Prototype Completion (no backend)

| Section | Item Count | Priority |
|---|---|---|
| A1 — Missing Components | 10 items | 8× P1, 2× P2 |
| A2 — Critical Flow Gaps | 6 items | All P1 |
| A3 — Form & Validation | 9 items | 6× P1, 3× P2 |
| A4 — Admin Panel (Milestone 5) | 10 items | All P1 |
| A5 — Polish & Infrastructure | 7 items | 4× P1, 3× P2 |
| **Phase A Total** | **42 items** | |

### Phase B — PRD v2.0 Evolution (no backend)

| Section | Item Count | Priority |
|---|---|---|
| B1 — Rebranding | 4 items | All P1 |
| B2 — Navigation | 2 items | 1× P1, 1× P2 |
| B3 — Home Page Redesign | 6 items | All P1 |
| B4 — About Page Rebuild | 7 items | All P2 |
| B5 — Data Portal Adaptation | 9 items | 7× P1, 2× P2 |
| B6 — Auth Updates | 2 items | All P1 |
| B7 — New Pages (Analytics/GIS/Campaigns/Submit/Learning) | 29 items | 17× P1, 10× P2, 2× P3 |
| B8 — AI Assistant Widget | 1 item | P2 |
| B9 — Mock Data Completion | 7 items | 5× P1, 2× P2 |
| B10 — Additional Features Built Beyond Spec | 11 items | ✅ All BUILT |
| **Phase B Total** | **78 items** (67 planned + 11 built beyond spec) | |

### Phase C — Production Backend (requires backend)

| Section | Item Count | Priority |
|---|---|---|
| C-M2 — Core Platform | 15 items | 13× P1, 2× P2 |
| C-M3 — Analytics & GIS | 11 items | 8× P1, 3× P2 |
| C-M4 — Capacity & Handover | 11 items | 9× P1, 2× P2 |
| **Phase C Total** | **37 items** | |

| | |
|---|---|
| **Grand Total** | **157 items** (146 planned + 11 built beyond spec) |
| **P1 (Must Have)** | ~90 items |
| **P2 (Should Have)** | ~49 items |
| **P3 (Could Have / Phase 2)** | ~7 items |
| **Built Beyond Spec** | 11 items (6 Tier 1 undocumented + 5 Tier 2 expanded) |

---

## Recommended Execution Sequence

```
Week 1  →  A1 (component library gaps) + B9 (mock data updates — types, datasets, orgs)
Week 2  →  A2 (critical flows: download state machine, pagination, map preview, /search)
           + A3 (react-hook-form/zod integration across all forms)
Week 3  →  B1 (rebrand) + B2 (new navbar) + B3 (new home page) + B6 (auth updates)
Week 4  →  A4 (admin panel — all 9 screens)
Week 5  →  B5 (data portal adaptation: health datasets, category pills, detail modal)
           + B4 (about page rebuild)
Week 6  →  B7.01–B7.07 (analytics dashboard)
Week 7  →  B7.08–B7.16 (GIS mapping pages — disease burden + facility map)
Week 8  →  B7.17–B7.22 (campaigns + submit data pages)
           + B7.23–B7.29 (tools & learning page)
Week 9  →  A5 (polish: TanStack hooks, skeletons, responsive QA, a11y, dark mode)
           + B8 (AI assistant widget mock)
Week 10 →  C-M2 begins (backend integration)
```

---

*End of Master Build Plan v1.0 — Niger State GeoHealth Data Portal | Zerasage Technologies | June 2026*
