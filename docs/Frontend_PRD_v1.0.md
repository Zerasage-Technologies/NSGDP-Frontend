# Frontend PRD — Niger State Government Open Data Portal

| Field | Detail |
|---|---|
| **Product** | Niger State Government Open Data Portal — Frontend Application |
| **Document Type** | Frontend Product Requirements Document (Engineering Build Spec) |
| **Version** | 1.0 |
| **Date** | June 2026 |
| **Prepared by** | Zerasage Technologies |
| **Primary Audience** | Frontend Developers, UI/UX Designer, Prototype Lead, QA |
| **Source Documents** | Niger State Data Portal PRD v1.0 (Wireframe Reference); Zerasage FACT Proposal v2; FACT Inception Report; FACT ToR |
| **Status** | Draft for build kickoff |

---

## 1. Purpose & Scope

This document is the **engineering contract for the frontend build**. Where the Wireframe PRD v1.0 defines *what each screen contains*, this document defines *how the frontend is built*: the technology stack, project structure, routing, state management, API integration contract, design system implementation, role-based rendering, performance budgets, accessibility, and a phased delivery plan.

**In scope:** Everything the browser runs — the React/Next.js application, component library, client-side routing, data fetching, form handling, map rendering, auth/session handling in the UI, and responsive/accessible delivery.

**Out of scope (defined elsewhere):** Database schema, REST API internals, hosting/infra, server-side business logic. The backend exposes a documented REST API (OpenAPI 3.0); the frontend consumes it.

**Design brief (one sentence):** A government open data portal where anyone can browse and discover Niger State datasets publicly, registered users can download them, designated MDA staff can upload them, and admins control what gets published — clean, professional, and operable by non-technical government staff on modest hardware and bandwidth.

---

## 2. Technology Stack (Frontend)

Locked per the approved proposal — all open-source, no proprietary lock-in.

| Concern | Technology | License | Notes |
|---|---|---|---|
| Framework | **Next.js (App Router) + React** | MIT | SSR/SSG for SEO on public pages; CDN-served; mobile-optimised |
| Language | **TypeScript** (strict) | Apache 2.0 | Type-safe API contracts and components |
| Styling | **Tailwind CSS** | MIT | Utility-first; government theme via design tokens |
| Component primitives | **shadcn/ui** (Radix UI under the hood) | MIT | Accessible primitives; copy-in components we own |
| Icons | **Lucide Icons** | ISC | Single icon library — never mix styles |
| Maps | **Leaflet.js** + react-leaflet | BSD-2 | No API key; performs on 3G/4G; full GeoJSON support |
| Data fetching / cache | **TanStack Query** | MIT | Server-state caching, loading/error states, retries |
| Forms | **React Hook Form + Zod** | MIT | Inline validation, schema-shared types |
| Charts | **Recharts** (or Chart.js) | MIT | Activity graphs, admin analytics |
| Tables | **TanStack Table** | MIT | Admin/dashboard data-dense tables, sort/paginate |
| HTTP client | **fetch** wrapped in a typed API client | — | Centralised auth headers + error normalisation |
| Date handling | **date-fns** | MIT | Relative time ("3 days ago"), formatting |
| Fonts | **Inter** or **DM Sans** (self-hosted) | OFL | Self-host for offline/low-bandwidth; no external CDN call |

**Decision notes**
- App Router with React Server Components for public pages (homepage, listings, detail) to maximise SEO and first-paint on slow connections; client components for interactive areas (filters, upload form, maps, admin tables).
- shadcn/ui is copied into the repo (not an npm dependency) so the government IT team fully owns the code at handover.

---

## 3. Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public-facing route group
│   │   ├── page.tsx              # PUB-01 Homepage
│   │   ├── datasets/
│   │   │   ├── page.tsx          # PUB-02 Listing
│   │   │   └── [slug]/page.tsx   # PUB-03 Detail
│   │   ├── organisations/...     # PUB-04 / PUB-05
│   │   ├── groups/...            # PUB-06 / PUB-07
│   │   ├── search/page.tsx       # PUB-08
│   │   └── about|contact|terms|privacy|api/docs
│   ├── (auth)/                   # AUTH-01..06
│   ├── (dashboard)/              # USR-01..07  (auth-guarded)
│   │   ├── dashboard/...
│   │   ├── settings/
│   │   └── datasets/new|[slug]/edit
│   └── admin/                    # ADM-01..09  (super-admin-guarded)
├── components/
│   ├── ui/                       # shadcn/ui primitives (Button, Input, …)
│   ├── data/                     # DatasetCard, OrgCard, GroupTile, VisibilityBadge…
│   ├── layout/                   # Navbar, Footer, AdminSidebar, FilterSidebar
│   ├── forms/                    # UploadStepper, field components
│   ├── map/                      # LeafletMap, GeoPreview, AttributeTable
│   └── feedback/                 # Toast, EmptyState, Skeletons, Modals
├── lib/
│   ├── api/                      # Typed API client + endpoint modules
│   ├── auth/                     # Session/role helpers, route guards
│   ├── hooks/                    # useDatasets, useFilters, useDebounce…
│   ├── schemas/                  # Zod schemas (forms + API responses)
│   └── utils/                    # formatters, constants (LGAs, formats)
├── styles/                       # globals.css, design tokens
└── types/                        # Shared TS types
```

---

## 4. Design System Implementation

The Wireframe PRD §7 lists the component checklist; this section binds those to code.

### 4.1 Design Tokens (Tailwind theme)

| Token | Value | Use |
|---|---|---|
| `primary` (Niger State Green) | `#1B5E35` (approx) | Brand, primary buttons, links |
| `accent` (Teal) | teal-600 family | Interactive/secondary CTAs, "Upload" button |
| `success` / PUBLIC | green-600 | Public badge, success toasts, Approve |
| `warning` / RESTRICTED | amber-500 | Restricted badge, warnings, Request Revision |
| `danger` | red-600 | Reject/Delete, error states |
| `neutral` | slate/gray scale | Backgrounds, borders, body text |
| `admin-shell` | darker slate | Admin header/sidebar — signals "admin mode" |

- All color pairings must meet **WCAG AA (4.5:1 normal text)**. Never convey state by color alone — always pair with text/icon.
- Typography: Inter/DM Sans, legible at small sizes for data-dense tables. Type scale defined once in `globals.css`.

### 4.2 Core Reusable Components (build order)

Build the component library **before** screens. Each component ships with all required states (see Wireframe PRD §7) and Storybook-style isolated verification.

**Tier 1 — primitives (shadcn/ui):** Button (primary/secondary/danger + loading), Input, Textarea (+char count), Select, Checkbox, Radio, Modal/Dialog (+destructive confirm), Toast (success/warn/error/info), Tooltip.

**Tier 2 — domain components:**
- `DatasetCard` — title, org logo+name, group chips (max 3), format badges, **VisibilityBadge** (top-right), relative updated date, download count, description snippet. States: default/hover/public/restricted/private.
- `VisibilityBadge` — PUBLIC (green) / RESTRICTED (amber) / PRIVATE (grey).
- `StatusBadge` (dataset) — Draft / Submitted / Under Review / Needs Revision / Published / Rejected / Archived.
- `RoleBadge` — Public / Registered / Contributor / Org Admin / Super Admin.
- `AgeBadge` (review queue) — green 0–2d / amber 3–5d / red 6d+.
- `OrgCard`, `GroupTile` (cover image + overlay + count).
- `FilterSidebar` — expanded/collapsed/with-active-filters; sticky on scroll, drawer on mobile.
- `TagChipInput`, `FileUploadArea` (empty/dragover/uploading/success/error), `Stepper`.
- `ActivityGraph` (mini, 7/30-day, views vs downloads).
- `EmptyState`, `Skeleton` loaders (card/table row/page), `QAChecklistItem`.

---

## 5. Routing & Access Control

### 5.1 Route Map

| Group | Routes | Guard |
|---|---|---|
| Public | `/`, `/datasets`, `/datasets/[slug]`, `/organisations`, `/organisations/[slug]`, `/groups`, `/groups/[slug]`, `/search`, `/about`, `/api/docs`, `/contact`, `/terms`, `/privacy` | None |
| Auth | `/register`, `/verify-email`, `/login`, `/login/verify`, `/forgot-password`, `/reset-password/[token]` | Logged-out only |
| User | `/dashboard`, `/settings`, `/dashboard/downloads`, `/dashboard/datasets`, `/dashboard/organisation`, `/datasets/new`, `/datasets/[slug]/edit` | Min role per page |
| Admin | `/admin`, `/admin/datasets`, `/admin/datasets/[id]/review`, `/admin/users`, `/admin/organisations`, `/admin/groups`, `/admin/access-requests`, `/admin/analytics`, `/admin/audit-logs` | Super Admin |

### 5.2 Role-Based Rendering

Five roles: **Public Visitor · Registered User · Data Contributor · Organisation Admin · Super Admin**. The UI adapts per role (nav items, CTAs, visible actions).

- **Guards:** Next.js middleware checks session for `(dashboard)` and `/admin` groups; per-page minimum-role checks redirect unauthorised users.
- **Security principle:** Frontend role checks are **UX only**. Every privileged action is re-validated by the API. Never trust client-side role state for authorisation — hide UI for cleanliness, but the API is the source of truth.
- **Adaptive Navbar** (Wireframe PRD §4.1): logged-out shows Register/Log In; Registered shows avatar+menu; Contributor+ shows teal **Upload** CTA; Super Admin shows admin badge + review-queue count.

```diagram
╭──────────────╮   role/session   ╭──────────────────╮
│  Session ctx │ ───────────────▶ │  <RoleGate role>  │
╰──────────────╯                  ╰─────────┬────────╯
        │                                   │ allowed
        │ middleware (route group)          ▼
        ▼                          renders feature/CTA
  redirect if unauth
```

---

## 6. State Management & Data Fetching

| State type | Tool | Examples |
|---|---|---|
| Server state | **TanStack Query** | Datasets, orgs, groups, review queue, analytics |
| URL state | **Next.js searchParams** | Filters, sort, pagination, search query (shareable URLs) |
| Auth/session | **React Context** (+ httpOnly cookie from API) | Current user, role, token presence |
| Local UI state | `useState`/`useReducer` | Modals, stepper step, drawer open |
| Form state | **React Hook Form** | All forms |

**Conventions**
- Filters/sort/pagination live in the **URL** (`/datasets?group=health&lga=bida&format=csv&sort=recent&page=2`) so results are linkable and back-button works. Active filter chips read from URL; "Clear all" resets it.
- Every data-fetch interaction has **loading (skeleton)**, **error**, and **empty** states. No blank screens (ToR low-resource constraint).
- Mutations (upload, review actions, role change) invalidate the relevant queries and surface toasts.

---

## 7. API Integration Contract (Frontend Expectations)

The frontend consumes a documented REST API (OpenAPI 3.0). A typed client in `lib/api/` centralises base URL, auth header/cookie, and error normalisation. Endpoints the UI depends on (indicative — confirm against backend spec):

| Area | Endpoint (indicative) | Used by |
|---|---|---|
| Auth | `POST /auth/register`, `/auth/login`, `/auth/verify-otp`, `/auth/forgot`, `/auth/reset`, `GET /auth/me` | AUTH-*, session ctx |
| Datasets | `GET /datasets?filters`, `GET /datasets/{slug}`, `POST /datasets`, `PATCH /datasets/{slug}` | PUB-02/03, USR-04/05 |
| Downloads | `POST /datasets/{slug}/download` (returns presigned URL) | PUB-03 download |
| Files | `POST /uploads` (multipart, progress), returns format-detected resource | USR-04 step 3 |
| Orgs | `GET /organisations`, `GET /organisations/{slug}`, `POST /organisations/{slug}/join` | PUB-04/05 |
| Groups | `GET /groups`, `GET /groups/{slug}` | PUB-06/07 |
| Search | `GET /search?q=` (+typeahead) | PUB-08, navbar |
| Access requests | `POST /datasets/{slug}/access-request`, admin `GET/PATCH /access-requests` | Flow E, ADM-07 |
| Admin review | `GET /admin/datasets?status=`, `POST /admin/datasets/{id}/approve|revise|reject` | ADM-02/03 |
| Admin mgmt | users/orgs/groups CRUD, `GET /admin/analytics`, `GET /admin/audit-logs` | ADM-04..09 |
| Geo | dataset resources return/serve **GeoJSON** for map preview | Map component |

**Cross-cutting expectations**
- Files served via **time-limited presigned URLs**, never direct paths.
- Download requires auth → API returns 401 for guests; UI shows login modal (not redirect) and auto-resumes download after login.
- Standard error envelope so the client maps codes → toast/inline messages consistently.

---

## 8. Key Flows (Frontend Behaviour)

Implement these as clickable, state-driven flows (Wireframe PRD §5).

- **A — Public discovery & download:** browse → filter (URL-driven) → detail → click Download → if guest, **modal** with Log In / Register → after auth, return to page and **auto-trigger** download.
- **B — Registration:** single-column form, inline on-blur validation, password strength meter, Nigerian phone hint → holding page (no auto-login) → email verify → login → Contributors/Admins get 2FA OTP (6 auto-advancing boxes, auto-submit on 6th digit).
- **C — Upload (Contributor):** 3-step stepper (Basic Info → Classification → Files & Visibility); per-field `?` tooltips; **auto-save draft every 60s**; drag-drop upload with per-file progress + format auto-detect; visibility as 3 option cards (not dropdown); Submit disabled until ≥1 file; Save as Draft available on any step.
- **D — Admin review:** split-panel (60% metadata / 40% QA checklist); Reject requires ≥20-char comment (button disabled until met); all three actions confirm via dialog; revision comment labelled "emailed to {contributor}".
- **E — Restricted access request:** RESTRICTED badge → "Request Access" → modal with reason → button states cycle: Request Access → Access Pending → Request Approved – Download.

### Download button state machine (PUB-03)
```diagram
 guest ─────────▶ [Log in to download] ──auth──▶ [Download]
 public+auth ───▶ [Download]
 restricted ────▶ [Request Access] ─submit─▶ [Access Pending] ─approve─▶ [Download]
 private ───────▶ (not shown in public listings)
```

---

## 9. Geospatial / Map Requirements

- **Leaflet + react-leaflet**, no API key, OSM or self-hosted tiles; lazy-loaded (map code split out of initial bundle).
- Dataset detail renders a **map preview** for spatial resources (GeoJSON/KML/Shapefile/georeferenced CSV) with an **attribute table** view alongside.
- LGA boundary layers for all **25 Niger State LGAs** available for spatial filtering; LGA multi-select in the filter sidebar.
- Map must perform on low bandwidth: cluster large point sets, debounce viewport queries, degrade gracefully to summary on mobile.

---

## 10. Performance Budget (Low-Resource Optimised)

ToR mandates reliable performance on modest hardware and moderate connections.

| Metric | Target |
|---|---|
| LCP (public pages, 4G) | ≤ 2.5s |
| Initial JS (public route, gzipped) | ≤ ~180KB; map/admin bundles code-split |
| TTI on 3G (homepage) | usable ≤ 5s |
| Images | Next.js `<Image>`, responsive sizes, lazy-load below fold; group/org cover images optimised with fallbacks |
| Fonts | self-hosted, `font-display: swap`, subset |
| Data tables | server-side pagination (20/50/100); virtualise long lists |
| Caching | TanStack Query stale-while-revalidate; SSG/ISR for stable public pages |

Every async action shows a loading state (skeletons). No unexplained delays or blank screens.

---

## 11. Accessibility & Responsive Design

- **WCAG 2.1 AA** target: keyboard-navigable, screen-reader labels on all form fields, visible focus states, semantic landmarks, no color-only signalling.
- **Breakpoints:** desktop-first 1280px → tablet 768px → mobile 375px (government staff primarily desktop, but full mobile support required).
- Mobile rules: filter sidebar becomes drawer; group grid 2-col; dataset detail sidebar moves below content; OTP boxes ≥44px tap targets; upload form may show a "better on desktop" advisory but must remain functional.
- Language: **Nigerian English**, plain language (secondary-school reading level) for all labels, errors, help text.
- Government branding: Niger State crest/logo on all pages; official, trustworthy tone — not playful/startup.

---

## 12. Forms & Validation Standards

- **React Hook Form + Zod**; the same Zod schema validates the form and types the API payload.
- Inline validation **on blur**: red border + message below field. Submit disabled until required fields valid.
- Password strength meter on register + reset; confirm-password match.
- Char counters on limited textareas (e.g. Reason for Registering, 500).
- Security messaging matches PRD: forgot-password always shows the same vague success; login shows attempt counter (X of 5) and lockout state.

---

## 13. Build, Tooling & Handover Readiness

Since the codebase transfers to government IT at handover, frontend tooling prioritises clarity and ownership.

- **Tooling:** ESLint + Prettier, TypeScript strict, Husky pre-commit, Vitest + React Testing Library (component/unit), Playwright (key-flow E2E).
- **CI:** GitHub Actions — lint, typecheck, test, build on every PR.
- **Docs:** component usage notes, environment setup (`.env.example`), and a frontend README in the handover package; shadcn/ui components live in-repo (owned, not hidden in node_modules).
- **No proprietary lock-in:** every dependency is permissively licensed and documented.

---

## 14. Phased Frontend Delivery Plan

Aligned to the proposal's 4-month timeline.

| Month | Frontend Focus | Output |
|---|---|---|
| **1 — Inception & Architecture** | Project scaffold, design tokens, **component library** (Tier 1+2 with states), low-fi → hi-fi wireframes/prototype, API client stubs against mock data | Clickable prototype; design system; typed API contract |
| **2 — Core Build (MVP)** | Public pages (PUB-01/02/03/04/05/06/07/08), auth flows (AUTH-*), download-gating modal, role-adaptive navbar, dataset upload form (USR-04), basic admin review (ADM-01/02/03), Leaflet map preview | MVP on staging for usability session #1 |
| **3 — Advanced & Integration** | Admin analytics/reporting (ADM-08), access-request system (Flow E, ADM-07), user/org/group management (ADM-04/05/06), audit log (ADM-09), notifications, search typeahead, full filter sidebar, API docs page; refinements from testing #1 | Full feature set on staging; usability session #2 |
| **4 — Launch & Handover** | Performance hardening, a11y audit pass, responsive QA across breakpoints, error/empty/loading polish, production build, frontend docs in handover package | Live production frontend; trained staff; source handover |

---

## 15. Definition of Done (Frontend, per screen)

A screen is "done" when:
1. Matches the Wireframe PRD spec for components and UX notes.
2. Implements all role variations and download/visibility/status states relevant to it.
3. Has loading (skeleton), empty, and error states.
4. Is responsive at 1280 / 768 / 375.
5. Passes keyboard + screen-reader checks; meets AA contrast.
6. All actions wired to the typed API client with toasts/inline errors; privileged actions assume API re-validation.
7. Filters/sort/pagination (where applicable) reflected in the URL.
8. Has at least component-level tests; key flows covered by E2E.

---

*End of Frontend PRD v1.0 — Niger State Government Open Data Portal | Zerasage Technologies | June 2026*
