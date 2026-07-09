# Project Structure v1.1

## Overview
Niger State GeoHealth Portal - Frontend built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4.

**Version:** 1.1  
**Last Updated:** July 2026  
**Status:** Production-ready prototype (Phase A+B ~98% complete)  
**Related Docs:** Master Build Plan v1.1 · Backend Architecture v1.1

---

## Changelog

**v1.1 (July 2026)**
- Documented 11 additional features built beyond specification (Section: Completion Details)
- Updated route inventory to include all B10 features (programs, documents, partner-data, user-groups, permissions, governance, architecture)
- Updated completion metrics: 102 of 109 planned tasks
- Corrected data counts: 54 facilities, 31 datasets
- Added reference to Backend Architecture v1.1 which now supports B10 features

**v1.0 (June 2026)**
- Initial project structure documentation

---

## Directory Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth pages group (centered layout)
│   │   │   ├── login/
│   │   │   │   ├── page.tsx
│   │   │   │   └── verify/          # 2FA OTP verification
│   │   │   ├── register/
│   │   │   ├── verify-email/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/[token]/
│   │   ├── (business)/               # Public pages (with nav + footer)
│   │   │   ├── page.tsx              # Homepage (full-screen map hero)
│   │   │   ├── about/                # Mission, Vision, Partners, Testimonials
│   │   │   ├── analytics/            # Health Analytics Dashboard
│   │   │   ├── api/docs/             # API documentation
│   │   │   ├── architecture/         # 🆕 Interactive system architecture
│   │   │   ├── campaigns/            # Vaccination campaigns
│   │   │   ├── contact/
│   │   │   ├── dataportal/           # Dataset catalogue
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/           # Dataset detail
│   │   │   ├── datasets/             # (Legacy route)
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   ├── documents/            # 🆕 Document repository (SOPs, policies)
│   │   │   ├── gis-map/              # Health facility map
│   │   │   ├── gis-mapping/          # Disease burden map
│   │   │   ├── groups/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   ├── learning/             # Tools & Learning
│   │   │   ├── organisations/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   ├── partner-data/         # 🆕 Partner dataset portal
│   │   │   ├── privacy/
│   │   │   ├── programs/             # 🆕 Programme management
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/             # Programme detail
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── upload/       # Report upload
│   │   │   │   └── new/              # Create programme
│   │   │   ├── search/               # Global search
│   │   │   ├── submit/               # Submit data form
│   │   │   └── terms/
│   │   ├── (dashboard)/              # Authenticated user area
│   │   │   └── dashboard/
│   │   │       ├── page.tsx          # Role-adaptive dashboard
│   │   │       ├── edit/[slug]/      # Edit dataset
│   │   │       ├── my-datasets/
│   │   │       ├── my-downloads/
│   │   │       ├── notifications/    # 🆕 Notification center
│   │   │       ├── organisation/
│   │   │       ├── profile/
│   │   │       └── upload/           # Upload dataset (3-step)
│   │   ├── admin/                    # Admin panel (dark shell)
│   │   │   ├── page.tsx              # Admin dashboard
│   │   │   ├── access-requests/
│   │   │   ├── analytics/
│   │   │   ├── audit-logs/
│   │   │   ├── datasets/
│   │   │   │   ├── page.tsx          # Review queue
│   │   │   │   └── [id]/review/      # Review single
│   │   │   ├── governance/           # 🆕 Governance module
│   │   │   │   ├── page.tsx
│   │   │   │   ├── health/           # Health indicators
│   │   │   │   └── sops/             # SOP management
│   │   │   ├── groups/
│   │   │   ├── organisations/
│   │   │   ├── permissions/          # 🆕 Permission delegation
│   │   │   ├── user-groups/          # 🆕 User group management
│   │   │   └── users/
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css
│   │
│   ├── components/                   # React components (~72 .tsx files)
│   │   ├── layout/                   # Layout components
│   │   │   ├── navbar.tsx
│   │   │   ├── navbar-search.tsx     # Search with typeahead
│   │   │   ├── footer.tsx
│   │   │   ├── container.tsx
│   │   │   ├── admin-sidebar.tsx
│   │   │   ├── admin-header.tsx
│   │   │   └── geohealth-logo.tsx
│   │   ├── data/                     # Data display components
│   │   │   ├── dataset-card.tsx
│   │   │   ├── geohealth-dataset-card.tsx
│   │   │   ├── org-card.tsx
│   │   │   ├── group-tile.tsx
│   │   │   ├── status-badge.tsx
│   │   │   ├── visibility-badge.tsx
│   │   │   ├── role-badge.tsx
│   │   │   ├── lifecycle-badge.tsx
│   │   │   ├── freshness-indicator.tsx
│   │   │   ├── age-badge.tsx
│   │   │   └── qa-checklist-item.tsx
│   │   ├── filters/                  # Filter components
│   │   │   ├── filter-sidebar.tsx
│   │   │   ├── advanced-dataset-filters.tsx
│   │   │   ├── mobile-filter-drawer.tsx
│   │   │   └── active-filter-chips.tsx
│   │   ├── feedback/                 # User feedback components
│   │   │   ├── empty-state.tsx
│   │   │   ├── skeletons.tsx
│   │   │   └── login-prompt-modal.tsx
│   │   ├── modals/                   # Modal components
│   │   │   └── dataset-detail-modal.tsx
│   │   ├── maps/                     # Map components
│   │   │   ├── dataset-map.tsx
│   │   │   ├── dataset-map-section.tsx
│   │   │   ├── layer-comparison.tsx
│   │   │   ├── map-legend.tsx
│   │   │   └── map-tooltip.tsx
│   │   ├── charts/                   # Chart components
│   │   │   ├── activity-graph.tsx
│   │   │   ├── analytics-charts.tsx
│   │   │   └── ward-analytics-chart.tsx
│   │   ├── forms/                    # Form components
│   │   │   ├── stepper.tsx
│   │   │   ├── file-upload-area.tsx
│   │   │   ├── password-strength-meter.tsx
│   │   │   ├── tag-chip-input.tsx
│   │   │   ├── program-form.tsx
│   │   │   └── field-label-tooltip.tsx
│   │   ├── home/                     # Homepage components
│   │   │   ├── home-hero-section.tsx
│   │   │   ├── outbreak-alert-banner.tsx
│   │   │   └── repository-dashboard.tsx
│   │   ├── programs/                 # Programme components
│   │   │   └── (programme-related components)
│   │   ├── admin/                    # Admin components
│   │   │   ├── approval-pipeline.tsx
│   │   │   ├── permission-matrix.tsx
│   │   │   ├── permission-delegation-panel.tsx
│   │   │   └── user-group-form.tsx
│   │   ├── notifications/            # Notification components
│   │   │   └── notification-bell.tsx
│   │   ├── architecture/             # Architecture diagram
│   │   │   └── portal-architecture-view.tsx
│   │   ├── ai/                       # AI Assistant
│   │   │   └── ai-assistant-widget.tsx
│   │   ├── dev/                      # Development tools
│   │   │   └── role-switcher.tsx
│   │   ├── ui/                       # shadcn/ui components (14 primitives)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ... (other UI primitives)
│   │   └── providers.tsx             # App providers
│   │
│   ├── lib/                          # Utilities and helpers
│   │   ├── mock/                     # Mock data layer (17 modules)
│   │   │   ├── health-datasets.ts    # 31 health datasets
│   │   │   ├── datasets.ts           # Re-export
│   │   │   ├── organisations.ts
│   │   │   ├── groups.ts
│   │   │   ├── users.ts
│   │   │   ├── facilities.ts         # 54 health facilities
│   │   │   ├── campaigns.ts          # 4 campaigns
│   │   │   ├── analytics.ts          # LGA burden, time series
│   │   │   ├── activity.ts           # Activity feed, audit logs
│   │   │   ├── notifications.ts      # In-app notifications
│   │   │   ├── alerts.ts             # Outbreak alerts
│   │   │   ├── programs.ts           # Programme tracking (19 entries)
│   │   │   ├── documents.ts          # Document repository
│   │   │   ├── sops.ts               # Standard operating procedures
│   │   │   ├── permissions.ts        # Permission system
│   │   │   ├── delay.ts              # Mock latency utility
│   │   │   └── index.ts              # Aggregator
│   │   ├── auth/                     # Auth utilities
│   │   │   └── mock-session.tsx
│   │   ├── constants.ts              # App constants
│   │   └── utils.ts                  # Utility functions
│   │
│   └── types/                        # TypeScript types
│       └── index.ts                  # Shared types
│
├── public/                           # Static assets
│   ├── images/
│   │   ├── hero-image.png
│   │   ├── moh-logo.png
│   │   └── nsphcda-logo.jpeg
│   ├── favicon-*.png
│   ├── file.svg
│   ├── globe.svg
│   └── ... (other icons)
│
├── docs/                             # Documentation
│   ├── Frontend_PRD_v1.0.md          # Engineering specification
│   ├── Frontend_Build_Plan_v1.0.md   # Build methodology
│   ├── Niger_State_Data_Portal_PRD_v1.0.docx  # Original wireframe (archived)
│   └── newdocs/
│       ├── Master_Build_Plan_v1.0.md         # Current build plan (updated July 2026)
│       ├── Niger_State_GeoHealth_Portal_PRD_v2.0.md  # Current PRD
│       ├── Backend_Architecture_v1.0.md
│       └── PROJECT_STRUCTURE.md              # This file
│
├── next.config.ts                    # Next.js config
├── tailwind.config.ts                # Tailwind config
├── tsconfig.json                     # TypeScript config
├── package.json                      # Dependencies
├── .env.example                      # Environment variables template
└── README.md                         # Project readme
```

## Key Technologies

- **Framework**: Next.js 15 (App Router)
- **React**: v19
- **TypeScript**: v5 (strict mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Base UI)
- **Icons**: Lucide React
- **Date Formatting**: date-fns
- **Forms**: React Hook Form + Zod
- **State**: React Context (mock auth)
- **Notifications**: Sonner

## Page Inventory

### Authentication (6 pages)
- `/login` - Login with 3-tier access selector (Public/Partner/Administrator)
- `/login/verify` - 2FA OTP verification
- `/register` - Registration with access level cards
- `/verify-email` - Email verification holding page
- `/forgot-password` - Password reset request
- `/reset-password/[token]` - Password reset form

### Public Pages (20+ pages) 
- `/` - Homepage with full-screen map hero, feature cards, health facilities, outbreak alerts
- `/about` - Complete with Mission/Vision, What We Do, Partners, Testimonials, Impact Numbers, LGA Map
- `/analytics` - Health Analytics Dashboard (disease selector, KPIs, LGA burden, outliers, ward-level drill-down)
- `/gis-mapping` - Disease Burden Map (proportional bubbles, filter panel, layer comparison)
- `/gis-map` - Health Facility Map (54 facilities across 25 LGAs)
- `/campaigns` - Vaccination campaigns tracking
- `/dataportal` - Dataset catalogue (31 health datasets)
- `/dataportal/[slug]` - Dataset detail with download state machine
- `/datasets` - Legacy dataset listing
- `/datasets/[slug]` - Legacy dataset detail
- `/organisations` - Organisation listing
- `/organisations/[slug]` - Organisation detail
- `/groups` - Groups listing
- `/groups/[slug]` - Group detail
- `/programs` - 🆕 Programme tracking (19 programmes)
- `/programs/[id]` - 🆕 Programme detail with reports
- `/programs/[id]/upload` - 🆕 Programme report upload
- `/programs/new` - 🆕 Create programme
- `/documents` - 🆕 Document repository (SOPs, policies, research)
- `/partner-data` - 🆕 Partner dataset portal
- `/architecture` - 🆕 Interactive system architecture diagram
- `/learning` - Tools & Learning (QGIS tutorials, e-books, sample data)
- `/submit` - Submit data form (3-step review process)
- `/search` - Global search with typeahead
- `/contact` - Contact form
- `/terms` - Terms of use
- `/privacy` - Privacy policy
- `/api/docs` - API documentation

### Dashboard (8 pages)
- `/dashboard` - Role-adaptive dashboard
- `/dashboard/profile` - User profile & settings
- `/dashboard/my-datasets` - User's datasets management
- `/dashboard/my-downloads` - Download history
- `/dashboard/upload` - Upload new dataset (3-step wizard with RHF + Zod)
- `/dashboard/edit/[slug]` - Edit existing dataset
- `/dashboard/organisation` - Organisation management (Org Admin+)
- `/dashboard/notifications` - 🆕 Notification center with read/unread status

### Admin Panel (13 pages)
- `/admin` - Admin dashboard (KPIs, review queue preview, activity chart)
- `/admin/datasets` - Review queue (status tabs, sortable table, bulk actions)
- `/admin/datasets/[id]/review` - Review single (split panel, QA checklist, approve/revise/reject)
- `/admin/users` - User management (role change, suspend, ban)
- `/admin/organisations` - Organisation management
- `/admin/groups` - Group management
- `/admin/access-requests` - Access request approvals
- `/admin/analytics` - Analytics & Reports (charts, KPIs, date-range filter)
- `/admin/audit-logs` - Audit log (filterable, immutable)
- `/admin/governance` - 🆕 Governance settings dashboard
- `/admin/governance/health` - 🆕 Health indicators management
- `/admin/governance/sops` - 🆕 SOP management
- `/admin/permissions` - 🆕 Granular permission delegation
- `/admin/user-groups` - 🆕 User group management

## User Roles

1. **Public** - Not authenticated
2. **Registered** - Basic authenticated user
3. **Contributor** - Can upload datasets
4. **Org Admin** - Manages organisation
5. **Super Admin** - System administrator

## Features

### Implemented ✅
✅ Mock data layer (31 health datasets, 54 facilities, 19 programmes, 17 mock modules)  
✅ Role-based authentication simulation (5 roles)  
✅ Dev-only role switcher  
✅ Responsive design (mobile, tablet, desktop)  
✅ Health-specific branding (GeoHealth Portal identity)  
✅ 3-tier access level selector (Public/Partner/Administrator)  
✅ Filtering and search with typeahead  
✅ Pagination  
✅ File upload simulation with progress  
✅ Form validation (React Hook Form + Zod on 8/9 forms)  
✅ Toast notifications (Sonner)  
✅ Loading states (skeletons)  
✅ Empty states  
✅ Error handling  
✅ Interactive maps (Leaflet) - disease burden + facility mapping  
✅ Health Analytics Dashboard - disease selector, LGA burden, outliers, ward-level  
✅ Campaigns tracking (4 vaccination campaigns)  
✅ AI Assistant widget (mock responses)  
✅ Download state machine (guest → login modal → auto-download)  
✅ Programme Management CRUD (beyond spec)  
✅ Document Repository (beyond spec)  
✅ Governance Module (beyond spec)  
✅ Permission Delegation (beyond spec)  
✅ User Groups (beyond spec)  
✅ In-app Notification Center (beyond spec)  
✅ Outbreak Alert Banner (beyond spec)  
✅ Build passes (`npm run build`, `npx tsc --noEmit` - zero errors)

### When Backend is Ready (Phase C)
🔄 Replace mock API with real API client (TanStack Query hooks ready)  
🔄 Add real authentication (JWT)  
🔄 Implement actual file uploads (S3-compatible storage)  
🔄 Wire real-time notifications  
🔄 Connect analytics to PostGIS spatial queries  
🔄 Enable actual downloads with presigned URLs  
🔄 DHIS2 integration (manual sync → automated sync)  
🔄 AI Assistant RAG backend

## Build Status

**Phase A + B (Prototype with Mock Data):** ~98% Complete  
**Verified:** July 2026

### Completion Details
- ✅ 102 of 109 planned tasks complete
- ✅ 11 additional features built beyond specification
- ✅ TypeScript: zero errors (`npx tsc --noEmit`)
- ✅ Build: succeeds (`npm run build`)
- ✅ All ~60 routes compile successfully

### Remaining Items
- [ ] Niger State Government emblem asset (replace logo + favicon)
- [ ] End-to-end flow testing (download, access request, upload wizard)
- [ ] Responsive QA (systematic 375/768/1280 audit)
- [ ] Accessibility audit (WCAG AA)
- [ ] Footer verification (Funded By / Powered By content)

See `docs/newdocs/Master_Build_Plan_v1.1.md` for complete task breakdown.

---

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Variables

See `.env.example` or `example.env` for all available environment variables.

---

## Documentation

- **`Master_Build_Plan_v1.0.md`** - Current build plan with task breakdown (updated July 2026)
- **`Niger_State_GeoHealth_Portal_PRD_v2.0.md`** - Product requirements (features, user personas, flows)
- **`Backend_Architecture_v1.0.md`** - Backend system architecture
- **`Frontend_PRD_v1.0.md`** - Engineering specification (tech stack, component library, API contract)
- **`Frontend_Build_Plan_v1.0.md`** - Build methodology (milestones, mock data strategy)
- **`PROJECT_STRUCTURE.md`** - This file (project structure overview)

---

## Deployment

Deployed on Vercel at: `nsgdp.vercel.app`  
Production domain (planned): `nsgeohealthportal.ng.gov`

---

*Last Updated: July 2026 | Niger State GeoHealth Portal | Zerasage Technologies*
