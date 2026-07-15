# Admin Separation Plan: Role-Based Access Strategy
**Goal:** Minimize code duplication while cleanly separating Super Admin from other users, making future app extraction easy

---

## Current Structure Analysis

```
NSGDP-Frontend/
├── src/app/
│   ├── (business)/         # Public pages - homepage, browse, search
│   ├── (auth)/             # Login, register, forgot password
│   ├── (dashboard)/        # User dashboard (all authenticated users)
│   └── admin/              # ❌ MIXED: Both org admin AND super admin
│       ├── users/
│       ├── datasets/
│       ├── organisations/
│       └── ... (10 pages total)
│
├── src/lib/
│   ├── api/                # API clients (mixed concerns)
│   ├── hooks/              # React Query hooks (mixed)
│   ├── auth/               # Authentication (shared)
│   ├── constants/          # Constants (shared)
│   └── utils/              # Utilities (shared)
│
└── src/components/
    ├── admin/              # Admin-specific components
    ├── layout/             # Layouts (navbar, sidebar, footer)
    ├── ui/                 # Base UI components (shared)
    └── ... (mixed concerns)
```

**Problems:**
- ❌ Super Admin mixed with Org Admin (hard to extract later)
- ❌ Org Admin features scattered between `/dashboard` and `/admin`
- ❌ Hard to apply different security policies to Super Admin

---

## Target Structure (Simplified - Less Duplication)

**Key Insight:** Most admin features are similar, just with different scoping. Use role-based visibility!

```
NSGDP-Frontend/
├── src/app/
│   ├── (business)/              # Public portal (unauthenticated)
│   │   ├── dataportal/
│   │   ├── datasets/
│   │   ├── organisations/
│   │   └── ...
│   │
│   ├── (auth)/                  # Authentication
│   │   ├── login/
│   │   ├── register/
│   │   └── register/invite/
│   │
│   ├── (dashboard)/             # 🎯 ALL AUTHENTICATED USERS (expanded)
│   │   ├── layout.tsx           # Shared layout for all users
│   │   ├── page.tsx             # Role-based dashboard redirect
│   │   │
│   │   ├── overview/            # Personal overview (all roles)
│   │   ├── my-datasets/         # Personal datasets (contributors)
│   │   ├── my-downloads/        # Download history (all)
│   │   ├── profile/             # User profile (all)
│   │   ├── notifications/       # Notifications (all)
│   │   ├── upload/              # Upload datasets (contributors)
│   │   │
│   │   ├── team/                # 🆕 Org team management (org admins only)
│   │   │   ├── page.tsx         # Requires: role === 'admin'
│   │   │   └── invites/         # Send invites (org admins)
│   │   │
│   │   ├── datasets/            # 🆕 Dataset review queue (org admins only)
│   │   │   ├── page.tsx         # Requires: role === 'admin'
│   │   │   └── [id]/review/     # Review datasets
│   │   │
│   │   └── organisation/        # 🆕 Org settings (org admins only)
│   │       └── page.tsx         # Requires: role === 'admin'
│   │
│   └── admin/                   # � SUPER ADMIN ONLY (platform-wide)
│       ├── layout.tsx           # Auth guard: role === 'super_admin'
│       ├── page.tsx             # Platform dashboard
│       ├── organisations/       # CRUD all organisations
│       ├── users/               # Manage all users
│       ├── datasets/            # Review all datasets (no org filter)
│       ├── invites/             # Manage all invites (all orgs)
│       ├── analytics/           # Platform-wide analytics
│       ├── system/              # System configuration
│       └── audit/               # Full audit logs
│
├── src/lib/
│   ├── api/
│   │   ├── shared/              # 🆕 Shared API clients (auth, base client)
│   │   ├── public/              # 🆕 Public portal APIs
│   │   ├── org-admin/           # 🆕 Org admin APIs (org-scoped)
│   │   └── super-admin/         # 🆕 Super admin APIs (platform-wide)
│   │
│   ├── hooks/
│   │   ├── shared/              # 🆕 Shared hooks (auth, etc.)
│   │   ├── public/              # 🆕 Public portal hooks
│   │   ├── org-admin/           # 🆕 Org admin hooks
│   │   └── super-admin/         # 🆕 Super admin hooks
│   │
│   ├── components-lib/          # 🆕 Shared business logic components
│   │   ├── dataset/             # Dataset-related reusable logic
│   │   ├── organisation/        # Organisation-related logic
│   │   └── user/                # User-related logic
│   │
│   └── ... (auth, utils, constants - shared)
│
└── src/components/
    ├── shared/                  # 🆕 Truly shared UI components
    │   ├── ui/                  # Base UI (buttons, inputs, cards)
    │   ├── data/                # Data display (badges, tables)
    │   ├── forms/               # Form components
    │   └── layout/              # Shared layouts (container, footer)
    │
    ├── public/                  # 🆕 Public portal specific
    │   ├── home/
    │   ├── map/
    │   └── filters/
    │
    ├── org-admin/               # 🆕 Org admin specific
    │   ├── layouts/             # Org admin sidebar, header
    │   ├── team-management/
    │   └── invite-modal/
    │
    └── super-admin/             # 🆕 Super admin specific
        ├── layouts/             # Super admin sidebar, header
        ├── platform-dashboard/
        ├── org-creation/
        └── system-config/
```

**Benefits of This Approach:**
- ✅ **No duplication** - Org admin pages in `/dashboard` with role guards
- ✅ **Clear separation** - Super admin isolated in `/admin`
- ✅ **Easy extraction** - Just extract `/admin` folder when needed
- ✅ **Shared components** - Reuse same UI across all roles
- ✅ **Simple navigation** - One sidebar with role-based visibility

---

## Role-Based Access Matrix

| Route | REGISTERED | CONTRIBUTOR | ORG ADMIN | SUPER ADMIN |
|-------|-----------|-------------|-----------|-------------|
| **`/dashboard`** |
| `/dashboard/overview` | ✅ | ✅ | ✅ | ✅ |
| `/dashboard/my-datasets` | ❌ | ✅ | ✅ | ✅ |
| `/dashboard/my-downloads` | ✅ | ✅ | ✅ | ✅ |
| `/dashboard/profile` | ✅ | ✅ | ✅ | ✅ |
| `/dashboard/upload` | ❌ | ✅ | ✅ | ✅ |
| `/dashboard/notifications` | ✅ | ✅ | ✅ | ✅ |
| `/dashboard/team` | ❌ | ❌ | ✅ (org only) | ❌ |
| `/dashboard/datasets` (review) | ❌ | ❌ | ✅ (org only) | ❌ |
| `/dashboard/organisation` | ❌ | ❌ | ✅ (own org) | ❌ |
| **`/admin`** (Super Admin Only) |
| `/admin/*` (all pages) | ❌ | ❌ | ❌ | ✅ |

---

## Implementation Plan

### 📦 Phase 1: Expand Dashboard for Org Admins (Week 1-2)

**Goal:** Move org admin features from `/admin` to `/dashboard` with role guards

#### Current `/admin` pages → New `/dashboard` pages mapping:

| Old `/admin` Page | New Location | Access |
|-------------------|--------------|--------|
| `/admin` (if org admin) | `/dashboard` | org admin redirected here |
| `/admin/datasets` (org scoped) | `/dashboard/datasets` | org admin only |
| `/admin/users` (org scoped) | `/dashboard/team` | org admin only |
| `/admin/organisations` (own org) | `/dashboard/organisation` | org admin only |
| `/admin/invites` (org scoped) | `/dashboard/team/invites` | org admin only |
| `/admin` (if super admin) | `/admin` | super admin stays here |
| `/admin/datasets` (all) | `/admin/datasets` | super admin only |
| `/admin/users` (all) | `/admin/users` | super admin only |
| `/admin/organisations` (all) | `/admin/organisations` | super admin only |
| `/admin/*` (platform features) | `/admin/*` | super admin only |

#### Step 1.1: Create Org Admin Pages in Dashboard

```bash
src/app/(dashboard)/
├── team/
│   ├── page.tsx                 # 🆕 Team management (org admins)
│   └── invites/
│       └── page.tsx             # 🆕 Send/manage invites
├── datasets/
│   ├── page.tsx                 # 🆕 Review queue (org admins)
│   └── [id]/
│       └── review/page.tsx      # 🆕 Review dataset
└── organisation/
    └── page.tsx                 # 🆕 Org settings (org admins)
```

**Implementation:**
```typescript
// src/app/(dashboard)/team/page.tsx
"use client";

import { useAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function TeamPage() {
  const { user } = useAuth();
  
  // Role guard - only org admins
  if (user?.role !== 'admin') {
    redirect('/dashboard');
  }
  
  // Show org-scoped team list
  return (
    <div>
      <h1>Team Management</h1>
      {/* List team members from user's org */}
    </div>
  );
}
```

#### Step 1.2: Update Dashboard Sidebar with Role-Based Menu

```typescript
// src/components/layout/dashboard-sidebar.tsx
export function getDashboardNavItems(userRole: string) {
  const baseItems = [
    { href: '/dashboard/overview', label: 'Overview', icon: Home },
    { href: '/dashboard/my-downloads', label: 'Downloads', icon: Download },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
    { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  ];

  const contributorItems = [
    { href: '/dashboard/my-datasets', label: 'My Datasets', icon: Database },
    { href: '/dashboard/upload', label: 'Upload', icon: Upload },
  ];

  const orgAdminItems = [
    { href: '/dashboard/datasets', label: 'Review Queue', icon: FileCheck },
    { href: '/dashboard/team', label: 'Team', icon: Users },
    { href: '/dashboard/organisation', label: 'Organisation', icon: Building2 },
  ];

  if (userRole === 'admin') {
    return [...baseItems, ...contributorItems, ...orgAdminItems];
  }
  
  if (userRole === 'contributor') {
    return [...baseItems, ...contributorItems];
  }

  return baseItems; // registered users
}
```

---

### 🎯 Phase 2: Isolate Super Admin in `/admin` (Week 3)

**Goal:** Keep ONLY super admin pages in `/admin`, remove org admin pages

#### Step 2.1: Clean Up `/admin` - Remove Org Admin Pages

**Remove these from `/admin`:**
- ❌ `/admin/access-requests` (org-scoped) → Move to `/dashboard/access-requests`
- ❌ `/admin/user-groups` (org-scoped) → Move to `/dashboard/groups` or remove
- ❌ `/admin/permissions` (org-scoped) → Move to `/dashboard/permissions` or remove
- ❌ `/admin/governance` (org-scoped) → Move to `/dashboard/governance` or remove

**Keep only super admin pages in `/admin`:**
- ✅ `/admin` - Platform dashboard
- ✅ `/admin/organisations` - CRUD all organisations
- ✅ `/admin/users` - Manage all users (no org filter)
- ✅ `/admin/datasets` - Review all datasets (no org filter)
- ✅ `/admin/invites` - Manage all invites (all orgs)
- ✅ `/admin/analytics` - Platform-wide analytics
- ✅ `/admin/audit-logs` - Full audit trail
- ✅ `/admin/system` - System configuration (if exists)

#### Step 2.2: Update Admin Layout Guard

```typescript
// src/app/admin/layout.tsx
"use client";

import { useAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  // STRICT guard - ONLY super admins
  if (user?.role !== 'super_admin') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <SuperAdminSidebar />
      <SuperAdminHeader />
      <main className="flex-1 p-6 lg:p-8">{children}</main>
    </div>
  );
}
```

#### Step 2.3: Create Super Admin Navigation

```typescript
// src/components/layout/super-admin-sidebar.tsx
export const superAdminNavItems = [
  { href: '/admin', label: 'Platform Overview', icon: LayoutDashboard },
  { href: '/admin/organisations', label: 'Organisations', icon: Building2 },
  { href: '/admin/users', label: 'All Users', icon: Users },
  { href: '/admin/datasets', label: 'All Datasets', icon: Database },
  { href: '/admin/invites', label: 'All Invites', icon: Mail },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: ScrollText },
];
```

---

### 🔗 Phase 3: Smart Components (Week 4)

**Goal:** Create components that adapt based on user role

#### Shared Dataset List Component

```typescript
// src/components/shared/dataset-list.tsx
interface DatasetListProps {
  scope?: 'personal' | 'org' | 'platform';
}

export function DatasetList({ scope = 'personal' }: DatasetListProps) {
  const { user } = useAuth();
  
  // API call adjusts based on scope
  const { data } = useDatasets({
    organisationId: scope === 'org' ? user?.organisationId : undefined,
    ownerId: scope === 'personal' ? user?.id : undefined,
    // no filter for 'platform' scope
  });

  return <DatasetTable data={data} />;
}

// Usage:
// /dashboard/my-datasets → <DatasetList scope="personal" />
// /dashboard/datasets (org admin) → <DatasetList scope="org" />
// /admin/datasets (super admin) → <DatasetList scope="platform" />
```

#### Shared Invite Component

```typescript
// src/components/shared/invite-modal.tsx
interface InviteModalProps {
  organisationId?: string; // undefined = super admin can select org
}

export function InviteModal({ organisationId }: InviteModalProps) {
  const { user } = useAuth();
  
  return (
    <Dialog>
      {/* If no organisationId, show org selector (super admin) */}
      {!organisationId && user?.role === 'super_admin' && (
        <OrganisationSelector />
      )}
      
      <EmailInput />
      <RoleSelector />
      <Button onClick={handleSendInvite}>Send Invite</Button>
    </Dialog>
  );
}

// Usage:
// /dashboard/team/invites → <InviteModal organisationId={user.organisationId} />
// /admin/invites → <InviteModal /> (can select any org)
```

---

### 🚀 Phase 4: Migration & Testing (Week 5)

#### Step 4.1: Update All Links

**Dashboard links** - no change needed  
**Admin links** - update to check role:

```typescript
// src/components/layout/navbar.tsx
function AdminLink() {
  const { user } = useAuth();
  
  if (user?.role === 'super_admin') {
    return <Link href="/admin">Admin Panel</Link>;
  }
  
  if (user?.role === 'admin') {
    return <Link href="/dashboard/team">Team Management</Link>;
  }
  
  return null; // no admin access
}
```

#### Step 4.2: Dashboard Homepage Router

```typescript
// src/app/(dashboard)/page.tsx
"use client";

import { useAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  
  // Smart redirect based on role
  if (!user) redirect('/login');
  
  // Redirect to appropriate landing page
  if (user.role === 'admin') {
    redirect('/dashboard/datasets'); // Org admin sees review queue
  }
  
  if (user.role === 'contributor') {
    redirect('/dashboard/my-datasets'); // Contributors see their datasets
  }
  
  redirect('/dashboard/overview'); // Registered users see overview
}

```

---

## Benefits of This Simplified Approach

### ✅ Immediate Benefits

1. **Minimal Code Duplication**
   - Org admin features live in `/dashboard` with role guards
   - Same components, just different data scoping
   - One codebase, role-based visibility

2. **Clear Separation**
   - `/dashboard` = All authenticated users (registered, contributors, org admins)
   - `/admin` = Super admin only (platform-wide)
   - Easy to understand and maintain

3. **Easy Future Extraction**
   - Just copy `/admin` folder to new app
   - `/dashboard` stays in main app
   - Minimal dependencies between them

4. **Better User Experience**
   - All users start in `/dashboard`
   - Org admins see extra menu items (team, review queue)
   - Super admins go to completely separate `/admin` portal

5. **Simpler Development**
   - Don't need to duplicate dataset review UI
   - Don't need to duplicate user management UI
   - Just add `organisationId` filter where needed

---

## Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **Phase 1: Expand Dashboard** | Week 1-2 | Add org admin pages to dashboard |
| **Phase 2: Isolate Super Admin** | Week 3 | Clean up `/admin`, remove org features |
| **Phase 3: Smart Components** | Week 4 | Create scope-aware components |
| **Phase 4: Migration & Testing** | Week 5 | Update links, test all flows |

**Total:** 4-5 weeks

---

## Future Extraction (When Needed)

When ready to separate super admin into its own app:

1. **Copy `/admin` folder** to new app
2. **Extract shared components** to npm packages:
   - `@nsgdp/ui` - Base UI components
   - `@nsgdp/api-client` - API client
   - `@nsgdp/datasets` - Dataset components
3. **Deploy separately:**
   - Main app: `https://portal.nigerstate-geohealth.ng`
   - Super admin: `https://admin.nigerstate-geohealth.ng`

---

## Next Steps

**This Week:**
1. ✅ Review and approve this simplified plan
2. ⬜ Create `/dashboard/team` page (org admin only)
3. ⬜ Create `/dashboard/datasets` page (org admin review queue)
4. ⬜ Create `/dashboard/organisation` page (org settings)
5. ⬜ Build invite UI in `/dashboard/team/invites`

**For Invite Feature (Priority):**
- `/dashboard/team/invites` - Org admins send invites to their org
- `/admin/invites` - Super admins manage all invites across all orgs
- Shared `<InviteModal>` component with org selector for super admins

---

**Status:** 📋 UPDATED - Simplified Approach
**Last Updated:** January 2026

