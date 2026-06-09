# Frontend Build Plan — Dummy-Data Phase

| Field | Detail |
|---|---|
| **Product** | Niger State Government Open Data Portal — Frontend |
| **Phase** | UI/UX build with **mock data only** (no backend yet) |
| **Goal** | Build every screen with realistic dummy data, fully designed and interactive |
| **Version** | 1.0 |
| **Source** | Niger State Data Portal PRD v1.0 (Wireframe), Frontend PRD v1.0 |
| **Status** | Active plan |

---

## 1. Objective & Principles

Build the **complete, clickable frontend** of the portal using local mock data, so the design and interactions can be reviewed and user-tested before the backend exists.

**Principles for this phase:**
- **Design-first**: every screen matches the Wireframe PRD spec (components, layout, UX notes).
- **Mock data, not real API**: all data comes from typed fixtures in `src/lib/mock/`. The data shape matches `src/types/` so swapping to the real API later is a drop-in change.
- **Interactive**: filters, search, modals, steppers, tabs, sort, pagination, role switching, form validation, toasts — all work client-side against mock data.
- **Stateful UI**: loading (skeleton), empty, and error states are designed even though data is local (simulate with small delays where useful).
- **Role simulation**: a dev-only role switcher lets us preview Public / Registered / Contributor / Org Admin / Super Admin without auth.
- **No real auth, no real uploads, no real downloads** — these are simulated (modals, fake progress bars, toasts).

---

## 2. Mock Data Strategy

Create `src/lib/mock/` with typed fixtures and helper accessors that mimic the future API.

| File | Contents |
|---|---|
| `mock/datasets.ts` | ~30 datasets across all groups/orgs/visibilities/statuses/formats, with resources, LGA coverage, descriptions, download counts, activity data |
| `mock/organisations.ts` | ~12 organisations across sectors, with brand colours, logos (placeholder), descriptions |
| `mock/groups.ts` | 10 groups with cover images (placeholder), descriptions, counts |
| `mock/users.ts` | sample users per role; the "current user" for role simulation |
| `mock/activity.ts` | recent activity feed, access requests, audit log, notifications |
| `mock/analytics.ts` | KPI numbers, chart series (uploads vs downloads), system health |
| `mock/index.ts` | typed accessors: `getDatasets(filters)`, `getDatasetBySlug()`, `searchAll()`, etc. — simulate filtering/sort/pagination in-memory |

**Helpers:**
- `mock/delay.ts` — optional `await sleep(ms)` to demo loading skeletons.
- Accessors return data shaped exactly like the planned API responses (Frontend PRD §7), wrapped so TanStack Query hooks can later point at the real client with no component changes.

**Role simulation:**
- `src/lib/auth/mock-session.tsx` — React Context holding the current mock user + a setter.
- A floating **dev Role Switcher** (only rendered in development) to flip roles instantly.

**Placeholder assets:**
- Group cover images & org logos: use generated placeholders (solid brand-colour blocks with initials, or `/public/placeholders/`). Initials-avatar fallback for orgs without logos.

---

## 3. Reusable Components to Build First

Per Frontend PRD §4.2 — build the library **before** wiring screens. Already done: VisibilityBadge, StatusBadge, RoleBadge, shadcn primitives.

**Still to build (Milestone 0):**

| Component | Notes / states |
|---|---|
| `layout/Navbar` | Role-adaptive: logged-out (Register/Log In) · Registered (avatar menu) · Contributor+ (Upload CTA) · Super Admin (admin badge + review count). Compact centre search. |
| `layout/Footer` | Gov logo + "Powered by Zerasage", link columns, copyright. |
| `layout/AdminSidebar` | Dark shell nav for `/admin/*`. |
| `layout/Container` | Max-width page wrapper. |
| `data/DatasetCard` | Title, org logo+name, group chips (max 3), format badges, VisibilityBadge (top-right), relative date, download count, snippet. Default/hover. |
| `data/OrgCard` | Logo/initials, name, sector badge, dataset count, description, "View Datasets". |
| `data/GroupTile` | Cover image + colour overlay, name (white), count badge, hover lift. |
| `data/AgeBadge` | Review queue: green 0–2d / amber 3–5d / red 6d+. |
| `filters/FilterSidebar` | Group, Org, LGA multi-select (25), Format, License, Update Frequency, Date range. Sticky; drawer on mobile. |
| `filters/ActiveFilterChips` | Chips with × + "Clear all"; reads/writes URL. |
| `feedback/EmptyState` | Illustration + message + optional CTA. |
| `feedback/Skeletons` | Card / table-row / page skeletons. |
| `feedback/LoginPromptModal` | Download-gate modal (Log In / Register). |
| `forms/Stepper` | 3-step upload progress header. |
| `forms/TagChipInput` | Add/remove tags, max limit. |
| `forms/FileUploadArea` | Drag-drop, per-file fake progress, format auto-detect, success/error. |
| `forms/PasswordStrengthMeter` | Visual strength bar. |
| `map/DatasetMapPreview` | Leaflet preview + attribute table toggle (lazy-loaded). |
| `charts/ActivityGraph` | Mini 7/30-day views vs downloads (Recharts). |
| `charts/AnalyticsCharts` | Admin line/bar charts. |
| `dev/RoleSwitcher` | Dev-only role toggle. |

---

## 4. Page Build Plan (by Milestone)

All screen IDs reference the Wireframe PRD. Each page = matches spec + responsive (1280/768/375) + loading/empty/error states + interactive against mock data.

### Milestone 0 — Shell & Component Library
- [ ] Mock data fixtures + accessors (§2)
- [ ] Mock session context + dev Role Switcher
- [ ] Navbar (role-adaptive) + Footer + Container
- [ ] Core reusable components (§3)
- [ ] Public layout wrapper (Navbar + Footer)

### Milestone 1 — Public Discovery (highest value)
- [ ] **PUB-01 Homepage** — hero search, animated stat counters, featured datasets row, browse-by-group grid, org logo strip, recent activity feed, optional news banner
- [ ] **PUB-02 Dataset Listing** — filter sidebar, active chips, sort dropdown, results grid, pagination, items-per-page, grid/list toggle, empty + skeleton states
- [ ] **PUB-03 Dataset Detail** — breadcrumb, header, action bar, **download button state machine** (login-gate modal), metadata panel, resource files table, right sidebar (activity graph + related), activity log, map preview for geo datasets
- [ ] **PUB-08 Search Results** — query bar, result-type tabs (All/Datasets/Orgs/Groups), mixed results, no-results state, typeahead dropdown in navbar

### Milestone 2 — Orgs, Groups & Static
- [ ] **PUB-04 Organisation Listing** — sector filter tabs (with counts), instant name search, 3-col card grid, empty state
- [ ] **PUB-05 Organisation Detail** — coloured brand banner, stats bar, description, dataset listing (reuse PUB-02 pattern), "Join Organisation" (logged-in only)
- [ ] **PUB-06 Groups Listing** — rich 2×5 cover-image grid, hover overlay
- [ ] **PUB-07 Group Detail** — cover banner, group dataset listing
- [ ] **PUB-09–13** — About, API Docs (static), Contact (form), Terms, Privacy

### Milestone 3 — Authentication (simulated)
- [ ] **AUTH-01 Register** — single-column form, inline on-blur validation, password strength, phone hint, reason textarea w/ counter, terms checkbox → success → holding page
- [ ] **AUTH-02 Email Verification** — holding page, resend w/ 60s cooldown
- [ ] **AUTH-03 Login** — form, remember me, attempt counter / lockout simulation, download-gate context banner
- [ ] **AUTH-04 2FA OTP** — 6 auto-advancing boxes, auto-submit, resend cooldown (shown for Contributor/Admin mock logins)
- [ ] **AUTH-05 Forgot Password** — vague success message
- [ ] **AUTH-06 Reset Password** — new password + strength, expired-token + success states

> Auth is **simulated**: "logging in" sets the mock session role and redirects; no real credentials.

### Milestone 4 — Authenticated User Area
- [ ] **USR-01 Dashboard** — role-adaptive widgets (stats, recent downloads, my datasets w/ status badges, pending actions, notifications, my orgs)
- [ ] **USR-02 Profile & Settings** — editable profile form, password change, preferences
- [ ] **USR-03 My Downloads** — history table, re-download
- [ ] **USR-04 Upload Dataset** — **3-step stepper**, all metadata fields, `?` tooltips, drag-drop upload w/ fake progress, visibility option cards, draft auto-save toast, Save Draft / Submit
- [ ] **USR-05 Edit Dataset** — same form pre-filled
- [ ] **USR-06 My Datasets** — table w/ status badges, actions
- [ ] **USR-07 My Organisation** — org profile edit, member queue (Org Admin)

### Milestone 5 — Admin Panel
- [ ] **ADM-01 Admin Dashboard** — dark shell, KPI widgets, review queue preview, recent registrations, system health, activity chart
- [ ] **ADM-02 Review Queue** — status tabs, table w/ AgeBadge, row actions, bulk select, search, sort
- [ ] **ADM-03 Review Single** — split panel (metadata / QA checklist), comment box, Approve/Revise/Reject w/ confirm dialogs + validation (reject ≥20 chars)
- [ ] **ADM-04 User Management** — filter bar, table, role-change modal, suspend/ban row tints, CSV export (mock)
- [ ] **ADM-05 Organisation Management** — org CRUD table
- [ ] **ADM-06 Group Management** — group CRUD table
- [ ] **ADM-07 Access Requests** — request list, approve/deny
- [ ] **ADM-08 Analytics & Reports** — charts, KPIs, date-range
- [ ] **ADM-09 Audit Log** — filterable immutable log table

### Milestone 6 — Polish
- [ ] Responsive QA across all pages (1280/768/375)
- [ ] Accessibility pass (keyboard, focus, labels, contrast, no colour-only)
- [ ] Loading/empty/error states consistency
- [ ] Animations & micro-interactions (count-up, hover, transitions)
- [ ] Remove temporary design-system showcase from homepage
- [ ] Cross-screen navigation/flow check (clickable prototype)

---

## 5. Interactive Elements Checklist (must actually work on mock data)

- [ ] Hero search → navigates to listing/search with query in URL
- [ ] Navbar typeahead live dropdown
- [ ] Filter sidebar updates results instantly; chips appear/remove; "Clear all"
- [ ] Sort dropdown + pagination + items-per-page
- [ ] Grid/list view toggle
- [ ] Download button full state machine + login-gate modal + auto-resume after mock login
- [ ] Restricted "Request Access" → modal → pending → approved cycle
- [ ] Role switcher changes navbar, CTAs, dashboard, route access
- [ ] Register/login form validation (inline, on-blur) + password strength
- [ ] OTP auto-advance + auto-submit
- [ ] 3-step upload stepper, drag-drop fake upload progress, draft auto-save toast
- [ ] Admin review actions with confirm dialogs + comment validation
- [ ] Tabs, modals, tooltips, toasts throughout
- [ ] Map preview renders mock GeoJSON; attribute table toggle
- [ ] Animated stat count-up on homepage
- [ ] Skeleton loaders on simulated fetch

---

## 6. Routing Setup

Establish the App Router groups now (Frontend PRD §5.1):

```
src/app/
├── (public)/      → Navbar + Footer layout
├── (auth)/        → centred card layout
├── (dashboard)/   → user shell (auth-guarded via mock session)
└── admin/         → dark admin shell (super-admin via mock session)
```

Route guards use the **mock session** in this phase (redirect if role insufficient). Filters/sort/pagination/search live in the **URL** so screens are linkable and the back button works.

---

## 7. Definition of Done (this phase, per page)

1. Matches Wireframe PRD components + UX notes.
2. All relevant role / visibility / status / download states render.
3. Loading (skeleton), empty, and error states present.
4. Responsive at 1280 / 768 / 375.
5. Keyboard-navigable; AA contrast; labelled controls.
6. Interactions work against mock data (filters, forms, modals, toasts).
7. URL reflects filters/sort/pagination where applicable.
8. No console errors; `tsc`, `eslint`, `build` all pass.

---

## 8. Suggested Build Order

1. **Milestone 0** (shell + components + mock data) — unblocks everything
2. **Milestone 1** (public discovery) — the core, highest-value flow
3. **Milestone 2** (orgs/groups/static)
4. **Milestone 3** (auth, simulated)
5. **Milestone 4** (user area + upload form)
6. **Milestone 5** (admin panel)
7. **Milestone 6** (polish + a11y + responsive QA)

When the backend is ready: replace `src/lib/mock/` accessors with the typed API client (Frontend PRD §7) — components and hooks stay unchanged.

---

*End of Frontend Build Plan v1.0 — Niger State Government Open Data Portal | Zerasage Technologies*
