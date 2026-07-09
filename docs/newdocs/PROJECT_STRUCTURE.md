# Project Structure

## Overview
Niger State Open Data Portal - Frontend built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4.

## Directory Structure

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth pages group (centered layout)
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── verify-email/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── (business)/               # Public pages (with nav + footer)
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── datasets/
│   │   │   ├── organisations/
│   │   │   ├── groups/
│   │   │   ├── privacy/
│   │   │   ├── terms/
│   │   │   └── api/docs/
│   │   ├── (dashboard)/              # Authenticated user area
│   │   │   └── dashboard/
│   │   │       ├── page.tsx          # Dashboard home
│   │   │       ├── profile/
│   │   │       ├── my-datasets/
│   │   │       ├── my-downloads/
│   │   │       ├── upload/
│   │   │       ├── edit/[slug]/
│   │   │       └── organisation/
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css
│   │
│   ├── components/                   # React components
│   │   ├── layout/                   # Layout components
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   └── container.tsx
│   │   ├── data/                     # Data display components
│   │   │   ├── dataset-card.tsx
│   │   │   ├── org-card.tsx
│   │   │   ├── group-tile.tsx
│   │   │   ├── status-badge.tsx
│   │   │   ├── visibility-badge.tsx
│   │   │   └── role-badge.tsx
│   │   ├── filters/                  # Filter components
│   │   │   ├── filter-sidebar.tsx
│   │   │   └── active-filter-chips.tsx
│   │   ├── feedback/                 # User feedback components
│   │   │   └── empty-state.tsx
│   │   ├── dev/                      # Development tools
│   │   │   └── role-switcher.tsx
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── ... (other UI primitives)
│   │   └── providers.tsx             # App providers
│   │
│   ├── lib/                          # Utilities and helpers
│   │   ├── mock/                     # Mock data layer
│   │   │   ├── datasets.ts
│   │   │   ├── organisations.ts
│   │   │   ├── groups.ts
│   │   │   ├── users.ts
│   │   │   ├── delay.ts
│   │   │   └── index.ts
│   │   ├── auth/                     # Auth utilities
│   │   │   └── mock-session.tsx
│   │   ├── constants.ts              # App constants
│   │   └── utils.ts                  # Utility functions
│   │
│   └── types/                        # TypeScript types
│       └── index.ts                  # Shared types
│
├── public/                           # Static assets
│   ├── file.svg
│   ├── globe.svg
│   └── ... (other icons)
│
├── docs/                             # Documentation
│   ├── Frontend_PRD_v1.0.md
│   └── Frontend_Build_Plan_v1.0.md
│
├── next.config.ts                    # Next.js config
├── tailwind.config.ts                # Tailwind config
├── tsconfig.json                     # TypeScript config
├── package.json                      # Dependencies
├── vercel.json                       # Vercel config
├── .env.example                      # Environment variables template
├── DEPLOYMENT.md                     # Deployment guide
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
- `/login` - Login with 2FA support
- `/login/verify` - 2FA OTP verification
- `/register` - Registration with validation
- `/verify-email` - Email verification holding page
- `/forgot-password` - Password reset request
- `/reset-password/[token]` - Password reset form

### Public Pages (13 pages)
- `/` - Homepage with hero, stats, featured datasets
- `/datasets` - Dataset listing with filters
- `/datasets/[slug]` - Dataset detail page
- `/organisations` - Organisation listing
- `/organisations/[slug]` - Organisation detail
- `/groups` - Groups listing
- `/groups/[slug]` - Group detail
- `/about` - About page
- `/contact` - Contact form
- `/terms` - Terms of use
- `/privacy` - Privacy policy
- `/api/docs` - API documentation

### Dashboard (7 pages)
- `/dashboard` - Role-adaptive dashboard
- `/dashboard/profile` - User profile & settings
- `/dashboard/my-datasets` - User's datasets management
- `/dashboard/my-downloads` - Download history
- `/dashboard/upload` - Upload new dataset (3-step)
- `/dashboard/edit/[slug]` - Edit existing dataset
- `/dashboard/organisation` - Organisation management (Org Admin+)

## User Roles

1. **Public** - Not authenticated
2. **Registered** - Basic authenticated user
3. **Contributor** - Can upload datasets
4. **Org Admin** - Manages organisation
5. **Super Admin** - System administrator

## Features

### Implemented
✅ Mock data layer (30 datasets, 14 orgs, 10 groups)
✅ Role-based authentication simulation
✅ Dev-only role switcher
✅ Responsive design (mobile, tablet, desktop)
✅ Dark mode support
✅ Filtering and search
✅ Pagination
✅ File upload simulation
✅ Form validation
✅ Toast notifications
✅ Loading states
✅ Empty states
✅ Error handling

### When Backend is Ready
🔄 Replace mock API with real API client
🔄 Add real authentication (JWT/OAuth)
🔄 Implement actual file uploads
🔄 Add real-time notifications
🔄 Connect analytics
🔄 Enable actual downloads

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

See `.env.example` for all available environment variables.

## Deployment

See `DEPLOYMENT.md` for detailed Vercel deployment instructions.
