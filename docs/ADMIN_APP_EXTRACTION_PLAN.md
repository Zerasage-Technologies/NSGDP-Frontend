# Admin Portal Extraction Plan
**Goal:** Extract super admin portal (`/admin/*`) into a separate Next.js application  
**Timeline:** Phased approach to minimize disruption  
**Current State:** Admin portal exists within main app at `src/app/admin/`  
**Target State:** Standalone admin app with shared packages

---

## Why Extract the Admin Portal?

### Benefits:
1. **Independent Deployment** - Deploy admin updates without affecting public portal
2. **Enhanced Security** - Separate domain, stricter access controls, different security policies
3. **Performance** - Smaller bundle size for public portal (no admin code)
4. **Team Autonomy** - Admin team can work independently from public portal team
5. **Scalability** - Different hosting/scaling strategies for each app
6. **Access Control** - Can be hosted on internal network or VPN if needed

### URLs After Extraction:
- **Public Portal:** `https://portal.nigerstate-geohealth.ng`
- **Admin Portal:** `https://admin.nigerstate-geohealth.ng`

---

## Current Admin Portal Inventory

### Pages (10 pages):
```
/admin (dashboard)
/admin/users
/admin/datasets
/admin/organisations
/admin/audit-logs
/admin/analytics
/admin/access-requests
/admin/permissions
/admin/user-groups
/admin/governance
```

### Components (Admin-Specific):
```
components/admin/
├── approval-pipeline.tsx
├── create-organisation-modal.tsx
├── permission-delegation-panel.tsx
├── permission-matrix.tsx
└── user-group-form.tsx

components/layout/
├── admin-header.tsx
└── admin-sidebar.tsx
```

### API Clients (Admin-Specific):
```
lib/api/
├── admin.ts (user management, audit logs)
├── organisations.ts (partial - CRUD operations)
├── datasets.ts (partial - approval workflow)
```

### Shared with Public Portal:
- UI components (`components/ui/`)
- Auth logic (`lib/auth/`)
- Shared types (`lib/types/`)
- Utility functions (`lib/utils/`)
- API base client (`lib/api/client.ts`)

---

## Phase 1: Create New Admin App (Week 1)

### 1.1 Initialize New Next.js Project

```bash
cd NSGDP
npx create-next-app@latest nsgdp-admin --typescript --tailwind --app --import-alias "@/*"
```

**Project Structure:**
```
NSGDP/
├── NSGDP-Frontend/          # Public portal (existing)
├── nsgdp-backend/            # Backend API (existing)
├── nsgdp-admin/              # 🆕 New admin portal
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── styles/
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── shared-packages/          # 🆕 Shared code (future)
```

### 1.2 Setup Base Configuration

**Files to create:**

1. **`nsgdp-admin/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3002
NEXT_PUBLIC_PORTAL_URL=http://localhost:3000
```

2. **`nsgdp-admin/next.config.js`**
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Images from backend/MinIO
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
```

3. **`nsgdp-admin/package.json`** (add dependencies)
```json
{
  "name": "nsgdp-admin",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev -p 3002",
    "build": "next build",
    "start": "next start -p 3002",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "zod": "^3.22.0",
    "react-hook-form": "@hookform/resolvers",
    "lucide-react": "^0.300.0",
    "date-fns": "^3.0.0",
    "recharts": "^2.10.0"
  }
}
```

### 1.3 Copy shadcn/ui Configuration

**Copy from `NSGDP-Frontend` to `nsgdp-admin`:**
```
components.json
tailwind.config.ts (merge with generated one)
src/components/ui/ (entire folder)
src/lib/utils.ts
```

---

## Phase 2: Migrate Shared Foundation (Week 2)

### 2.1 Auth System

**Copy & Adapt:**
```
NSGDP-Frontend/src/lib/auth/
  ├── auth-context.tsx       → nsgdp-admin/src/lib/auth/
  ├── auth-provider.tsx      → nsgdp-admin/src/lib/auth/
  └── use-auth.ts            → nsgdp-admin/src/lib/auth/

Changes needed:
- Update redirect URLs (/ → /admin)
- Remove non-admin role handling
- Add super_admin role validation
```

**New: Super Admin Guard**
```typescript
// nsgdp-admin/src/lib/auth/super-admin-guard.tsx
'use client';

import { useAuth } from './use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function SuperAdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'super_admin')) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== 'super_admin') {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
```

### 2.2 API Client Base

**Copy & Adapt:**
```
NSGDP-Frontend/src/lib/api/
  ├── client.ts              → nsgdp-admin/src/lib/api/client.ts
  └── routes.ts              → nsgdp-admin/src/lib/api/routes.ts (admin routes only)
```

**Changes:**
- Remove public portal API routes
- Keep only admin-specific endpoints
- Update base URL configuration

### 2.3 Shared Types

**Copy:**
```
NSGDP-Frontend/src/lib/types/
  ├── user.ts                → nsgdp-admin/src/lib/types/
  ├── dataset.ts             → nsgdp-admin/src/lib/types/
  ├── organisation.ts        → nsgdp-admin/src/lib/types/
  └── audit-log.ts           → nsgdp-admin/src/lib/types/
```

### 2.4 Utility Functions

**Copy:**
```
NSGDP-Frontend/src/lib/utils/
  ├── cn.ts (already in utils.ts)
  ├── format-date.ts         → nsgdp-admin/src/lib/utils/
  ├── format-bytes.ts        → nsgdp-admin/src/lib/utils/
  └── constants.ts           → nsgdp-admin/src/lib/constants/
```

---

## Phase 3: Migrate Admin Pages (Week 3-4)

### 3.1 Root Layout & Dashboard

**Create:**
```typescript
// nsgdp-admin/src/app/layout.tsx
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth/auth-provider';
import { QueryProvider } from '@/lib/providers/query-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NSGDP Admin Portal',
  description: 'Super Admin Portal for Niger State GeoHealth Data Portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
```

**Create:**
```typescript
// nsgdp-admin/src/app/(admin)/layout.tsx
import { SuperAdminGuard } from '@/lib/auth/super-admin-guard';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { AdminHeader } from '@/components/layout/admin-header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SuperAdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6 bg-muted/30">
            {children}
          </main>
        </div>
      </div>
    </SuperAdminGuard>
  );
}
```

### 3.2 Migrate Pages (Priority Order)

**Week 3:**
1. Dashboard (`/admin/page.tsx`) ← Wire to new dashboard stats API
2. Users (`/admin/users/page.tsx`)
3. Organisations (`/admin/organisations/page.tsx`)
4. Datasets (`/admin/datasets/page.tsx`)
5. Audit Logs (`/admin/audit-logs/page.tsx`)

**Week 4:**
6. Analytics (`/admin/analytics/page.tsx`)
7. Access Requests (`/admin/access-requests/page.tsx`)
8. Permissions (`/admin/permissions/page.tsx`)
9. User Groups (`/admin/user-groups/page.tsx`)
10. Governance (`/admin/governance/page.tsx`)

**Migration Process for Each Page:**

```bash
# For each page:
# 1. Copy page file
cp NSGDP-Frontend/src/app/admin/users/page.tsx nsgdp-admin/src/app/(admin)/users/page.tsx

# 2. Update imports (change relative paths)
# Before: import { UserTable } from '@/components/admin/user-table'
# After:  import { UserTable } from '@/components/admin/user-table' (same, but check paths)

# 3. Test the page works
# 4. Update API calls if needed
```

---

## Phase 4: Migrate Components (Week 5)

### 4.1 Layout Components

**Copy:**
```
NSGDP-Frontend/src/components/layout/
  ├── admin-header.tsx       → nsgdp-admin/src/components/layout/
  ├── admin-sidebar.tsx      → nsgdp-admin/src/components/layout/
  ├── container.tsx          → nsgdp-admin/src/components/layout/
  ├── geohealth-logo.tsx     → nsgdp-admin/src/components/layout/
  └── notification-bell.tsx  → nsgdp-admin/src/components/layout/
```

**Update `admin-sidebar.tsx`:**
- Remove "Back to Portal" link (or link to public portal URL)
- Keep only super admin navigation items
- Remove org admin sections

### 4.2 Admin-Specific Components

**Copy:**
```
NSGDP-Frontend/src/components/admin/
  ├── approval-pipeline.tsx       → nsgdp-admin/src/components/admin/
  ├── create-organisation-modal.tsx → nsgdp-admin/src/components/admin/
  ├── permission-delegation-panel.tsx → nsgdp-admin/src/components/admin/
  ├── permission-matrix.tsx       → nsgdp-admin/src/components/admin/
  └── user-group-form.tsx         → nsgdp-admin/src/components/admin/
```

### 4.3 Shared Components

**Copy only what admin uses:**
```
NSGDP-Frontend/src/components/shared/
  └── (analyze usage, copy only referenced components)
```

---

## Phase 5: API Integration (Week 6)

### 5.1 Admin API Clients

**Copy & Clean:**
```
NSGDP-Frontend/src/lib/api/
  ├── admin.ts               → nsgdp-admin/src/lib/api/admin.ts
  ├── organisations.ts       → nsgdp-admin/src/lib/api/organisations.ts
  ├── audit-logs.ts          → nsgdp-admin/src/lib/api/audit-logs.ts
  └── datasets.ts (partial)  → nsgdp-admin/src/lib/api/datasets.ts (approval only)
```

**Remove from copies:**
- Public portal endpoints
- Org admin specific endpoints (if any)

### 5.2 React Query Hooks

**Copy:**
```
NSGDP-Frontend/src/lib/hooks/
  ├── useUsers.ts            → nsgdp-admin/src/lib/hooks/
  ├── useOrganisations.ts    → nsgdp-admin/src/lib/hooks/
  ├── useAuditLogs.ts        → nsgdp-admin/src/lib/hooks/
  └── useDatasets.ts         → nsgdp-admin/src/lib/hooks/
```

---

## Phase 6: Authentication & Security (Week 7)

### 6.1 Login Page

**Create:**
```typescript
// nsgdp-admin/src/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Will redirect to / (dashboard) after login
    } catch (err) {
      setError('Invalid credentials or insufficient permissions');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Admin Portal</h1>
          <p className="text-muted-foreground">Super Admin Access Only</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label>Password</Label>
            <Input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <p className="text-sm text-destructive">{error}</p>}
          
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
      </div>
    </div>
  );
}
```

### 6.2 Role Validation

**Update auth context to enforce super_admin:**
```typescript
// In nsgdp-admin/src/lib/auth/auth-context.tsx
// Add check after login:
if (user.role !== 'super_admin') {
  throw new Error('Access denied. Super admin privileges required.');
}
```

### 6.3 Environment-Specific Security

**Production `.env`:**
```env
# Force HTTPS
NEXT_PUBLIC_FORCE_HTTPS=true

# Strict CSP headers
CSP_POLICY="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"

# API URL (backend)
NEXT_PUBLIC_API_URL=https://api.nigerstate-geohealth.ng

# Public portal URL (for "View Portal" links)
NEXT_PUBLIC_PORTAL_URL=https://portal.nigerstate-geohealth.ng
```

---

## Phase 7: Testing & Validation (Week 8)

### 7.1 Functional Testing Checklist

- [ ] Login with super admin account
- [ ] Login with non-super admin account (should fail)
- [ ] Dashboard loads with real stats
- [ ] User management (list, edit role, suspend)
- [ ] Organisation management (create, edit, disable)
- [ ] Dataset approval workflow
- [ ] Audit log viewing and export
- [ ] Analytics page (if using real data)
- [ ] All navigation links work
- [ ] Logout and session expiry

### 7.2 Security Testing

- [ ] Cannot access admin without authentication
- [ ] Non-super admin users cannot access any page
- [ ] JWT tokens stored securely
- [ ] CSRF protection enabled
- [ ] API calls use HTTPS in production
- [ ] No sensitive data in client-side code

### 7.3 Performance Testing

- [ ] Initial load time < 3s
- [ ] Page transitions smooth
- [ ] Large tables paginated correctly
- [ ] API calls cached appropriately

---

## Phase 8: Deployment (Week 9)

### 8.1 Build Configuration

**Create `nsgdp-admin/Dockerfile`:**
```dockerfile
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3002

ENV PORT 3002

CMD ["node", "server.js"]
```

### 8.2 Docker Compose

**Update `NSGDP/docker-compose.yml`:**
```yaml
services:
  frontend:
    build: ./NSGDP-Frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001
    networks:
      - nsgdp-network

  admin:
    build: ./nsgdp-admin
    ports:
      - "3002:3002"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:3001
      - NEXT_PUBLIC_PORTAL_URL=http://frontend:3000
    networks:
      - nsgdp-network
    depends_on:
      - backend

  backend:
    build: ./nsgdp-backend
    ports:
      - "3001:3001"
    networks:
      - nsgdp-network

networks:
  nsgdp-network:
```

### 8.3 Nginx Configuration (Production)

**Create `/etc/nginx/sites-available/nsgdp-admin`:**
```nginx
server {
    listen 80;
    server_name admin.nigerstate-geohealth.ng;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.nigerstate-geohealth.ng;

    ssl_certificate /etc/letsencrypt/live/admin.nigerstate-geohealth.ng/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.nigerstate-geohealth.ng/privkey.pem;

    # Security headers
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Phase 9: Cleanup Main App (Week 10)

### 9.1 Remove Admin Code from Public Portal

**Delete from `NSGDP-Frontend`:**
```bash
# Pages
rm -rf src/app/admin/

# Admin components
rm -rf src/components/admin/
rm src/components/layout/admin-header.tsx
rm src/components/layout/admin-sidebar.tsx

# Admin-only API clients (keep shared ones)
# Review each file in src/lib/api/ and remove admin-only endpoints

# Admin-only hooks
# Review src/lib/hooks/ and remove or update
```

### 9.2 Update Public Portal Navigation

**Remove from `NSGDP-Frontend/src/components/layout/navbar.tsx`:**
- Admin dashboard link (or change to external link)

**Add external link (optional):**
```tsx
{user?.role === 'super_admin' && (
  <a 
    href="https://admin.nigerstate-geohealth.ng"
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2"
  >
    <Settings className="h-4 w-4" />
    Admin Portal
    <ExternalLink className="h-3 w-3" />
  </a>
)}
```

---

## Phase 10: Documentation & Handoff (Week 11)

### 10.1 Create Documentation

**Files to create:**

1. **`nsgdp-admin/README.md`**
```markdown
# NSGDP Admin Portal

Super Admin portal for Niger State GeoHealth Data Portal.

## Local Development

1. Install dependencies: `npm install`
2. Copy environment file: `cp .env.example .env.local`
3. Update API URL in `.env.local`
4. Run dev server: `npm run dev`
5. Open http://localhost:3002

## Login Credentials

Super admin access only. Use your super_admin account credentials.

## Deployment

See DEPLOYMENT.md for production deployment instructions.
```

2. **`nsgdp-admin/DEPLOYMENT.md`**
- Docker build instructions
- Nginx configuration
- SSL certificate setup
- Environment variable reference

3. **`nsgdp-admin/DEVELOPMENT.md`**
- Project structure explanation
- How to add new admin pages
- API client usage
- Component patterns

### 10.2 Update Project README

**Update `NSGDP/README.md`:**
```markdown
# Niger State GeoHealth Data Portal

## Project Structure

- `NSGDP-Frontend/` - Public portal (Next.js)
- `nsgdp-admin/` - Admin portal (Next.js) - Super admin only
- `nsgdp-backend/` - Backend API (NestJS)

## Running Locally

### Public Portal
\`\`\`bash
cd NSGDP-Frontend
npm run dev  # http://localhost:3000
\`\`\`

### Admin Portal
\`\`\`bash
cd nsgdp-admin
npm run dev  # http://localhost:3002
\`\`\`

### Backend
\`\`\`bash
cd nsgdp-backend
npm run start:dev  # http://localhost:3001
\`\`\`

## Production URLs

- Public Portal: https://portal.nigerstate-geohealth.ng
- Admin Portal: https://admin.nigerstate-geohealth.ng
- API: https://api.nigerstate-geohealth.ng
```

---

## Migration Checklist Summary

### ✅ Phase 1: Setup (Week 1)
- [ ] Create new Next.js project (`nsgdp-admin`)
- [ ] Configure package.json, next.config.js
- [ ] Copy shadcn/ui components
- [ ] Setup Tailwind CSS

### ✅ Phase 2: Foundation (Week 2)
- [ ] Migrate auth system
- [ ] Copy API client base
- [ ] Copy shared types
- [ ] Copy utility functions

### ✅ Phase 3: Pages - Part 1 (Week 3)
- [ ] Dashboard (wire to stats API)
- [ ] Users
- [ ] Organisations
- [ ] Datasets
- [ ] Audit Logs

### ✅ Phase 4: Pages - Part 2 (Week 4)
- [ ] Analytics
- [ ] Access Requests
- [ ] Permissions
- [ ] User Groups
- [ ] Governance

### ✅ Phase 5: Components (Week 5)
- [ ] Layout components
- [ ] Admin-specific components
- [ ] Shared components (selective)

### ✅ Phase 6: API Integration (Week 6)
- [ ] Admin API clients
- [ ] React Query hooks
- [ ] Error handling

### ✅ Phase 7: Auth & Security (Week 7)
- [ ] Login page
- [ ] Super admin guard
- [ ] Role validation
- [ ] Security headers

### ✅ Phase 8: Testing (Week 8)
- [ ] Functional testing
- [ ] Security testing
- [ ] Performance testing

### ✅ Phase 9: Deployment (Week 9)
- [ ] Dockerfile
- [ ] Docker Compose
- [ ] Nginx config
- [ ] SSL certificates
- [ ] Deploy to staging
- [ ] Deploy to production

### ✅ Phase 10: Cleanup (Week 10)
- [ ] Remove admin code from public portal
- [ ] Update navigation
- [ ] Bundle size verification

### ✅ Phase 11: Documentation (Week 11)
- [ ] README.md
- [ ] DEPLOYMENT.md
- [ ] DEVELOPMENT.md
- [ ] Update root README

---

## Risk Mitigation

### Risk: Breaking Changes During Migration
**Mitigation:**
- Work in feature branch
- Keep both portals running simultaneously during migration
- Test thoroughly before removing old code

### Risk: Shared Component Divergence
**Mitigation:**
- Future: Extract to shared npm package
- For now: Copy and maintain separately
- Document any customizations

### Risk: Authentication Issues
**Mitigation:**
- Test with multiple user roles
- Verify JWT token handling
- Test session expiry

### Risk: Deployment Complexity
**Mitigation:**
- Use Docker Compose for local testing
- Deploy to staging first
- Have rollback plan ready

---

## Future Optimization: Shared Packages

**After extraction is complete, consider:**

```
NSGDP/
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── auth/                # Shared auth logic
│   ├── api-client/          # Shared API client
│   └── types/               # Shared TypeScript types
├── apps/
│   ├── portal/              # Public portal
│   └── admin/               # Admin portal
└── nsgdp-backend/           # Backend
```

**Benefits:**
- Single source of truth for shared code
- Easier to maintain consistency
- Can use Turborepo or Nx for monorepo management

---

**Status:** 📋 Ready for Implementation  
**Timeline:** 11 weeks (can be compressed with parallel work)  
**Next Step:** Phase 1 - Create new Next.js project  
**Owner:** Frontend Team  
**Review:** After each phase completion
