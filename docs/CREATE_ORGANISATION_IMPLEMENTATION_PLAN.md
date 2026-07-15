# Create Organisation Feature - Implementation Plan

**Feature:** Allow Super Admin to create new organisations from the admin panel  
**Date:** January 2026  
**Status:** 📋 Ready for Implementation

---

## 🎯 Goal

Implement full CRUD capability for organisations, starting with CREATE functionality that allows super admins to:
- Create new organisations via `/admin/organisations` page
- Validate organisation data (name uniqueness, required fields)
- Auto-generate URL-friendly slugs
- Set organisation metadata (type, contact info, branding)

---

## 📊 Current State Analysis

### ✅ What Exists

**Backend:**
- ✅ Organisation entity with all fields (`organisation.entity.ts`)
- ✅ OrganisationType enum (government, ngo, private, international, academic, community)
- ✅ GET endpoints (list all, get by slug)
- ✅ Service methods for reading organisations
- ✅ Proper database schema with slug uniqueness

**Frontend:**
- ✅ Admin organisations page with table view
- ✅ Organisation API client with getOrganisations
- ✅ useOrganisations hook for data fetching
- ✅ UI components (Button, Dialog, Form components)
- ✅ Form validation with Zod and react-hook-form
- ✅ Super admin access control on `/admin` layout

### ❌ What's Missing

**Backend:**
- ❌ POST `/organisations` endpoint
- ❌ CreateOrganisationDto validation class
- ❌ Service method to create organisation
- ❌ Slug generation utility
- ❌ Name/slug uniqueness validation
- ❌ Super admin role guard on create endpoint

**Frontend:**
- ❌ Create organisation modal/form
- ❌ Organisation form schema (Zod)
- ❌ createOrganisation API function
- ❌ useCreateOrganisation mutation hook
- ❌ Form with all organisation fields
- ❌ Success/error handling with toast notifications

---
## 🏗️ Implementation Architecture

### Data Flow

```
User clicks "Add New Org" 
  → Opens CreateOrganisationModal
  → User fills form with validation
  → Submit triggers useCreateOrganisation mutation
  → Calls POST /organisations API
  → Backend validates & creates organisation
  → Auto-generates slug from name
  → Returns created organisation
  → Frontend invalidates organisations query cache
  → Table refreshes with new organisation
  → Shows success toast
```

### Field Mapping

| UI Field | Entity Field | Type | Required | Validation |
|----------|--------------|------|----------|------------|
| Organisation Name | name | string | ✅ | 3-100 chars, unique |
| Slug | slug | string | Auto | Generated from name, unique |
| Type | type | enum | ✅ | One of 6 types |
| Description | description | text | ❌ | 0-500 chars |
| Website | website | string | ❌ | Valid URL format |
| Email | email | string | ❌ | Valid email format |
| Phone | phone | string | ❌ | Valid phone format |
| Address | address | string | ❌ | 0-200 chars |
| Logo URL | logo_url | string | ❌ | Valid URL (future: file upload) |
| Active Status | is_active | boolean | ✅ | Default: true |
| Created By | created_by | uuid | Auto | Current user ID |

---
## 📋 Implementation Steps

### Phase 1: Backend API (1-2 hours)

#### Step 1.1: Create DTO
**File:** `nsgdp-backend/src/modules/organisations/dto/create-organisation.dto.ts`

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsEmail,
  IsUrl,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
import { OrganisationType } from '../entities/organisation.entity';

export class CreateOrganisationDto {
  @ApiProperty({ 
    example: 'Niger State Primary Health Care Agency',
    description: 'Organisation name (3-100 characters)'
  })
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @ApiPropertyOptional({ 
    example: 'The primary healthcare coordinating agency in Niger State',
    description: 'Organisation description'
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @ApiProperty({ 
    enum: OrganisationType,
    example: OrganisationType.GOVERNMENT,
    description: 'Type of organisation'
  })
  @IsEnum(OrganisationType, { message: 'Invalid organisation type' })
  type: OrganisationType;

  @ApiPropertyOptional({ 
    example: 'https://nsphcda.org',
    description: 'Organisation website URL'
  })
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid URL' })
  website?: string;

  @ApiPropertyOptional({ 
    example: 'info@nsphcda.org',
    description: 'Organisation contact email'
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiPropertyOptional({ 
    example: '+234 803 123 4567',
    description: 'Organisation phone number'
  })
  @IsOptional()
  @IsString()
  @Matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, {
    message: 'Please provide a valid phone number'
  })
  phone?: string;

  @ApiPropertyOptional({ 
    example: 'Plot 123, Minna, Niger State',
    description: 'Organisation physical address'
  })
  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Address must not exceed 200 characters' })
  address?: string;

  @ApiPropertyOptional({ 
    example: 'https://storage.example.com/logos/nsphcda.png',
    description: 'URL to organisation logo image'
  })
  @IsOptional()
  @IsUrl({}, { message: 'Logo URL must be a valid URL' })
  logoUrl?: string;
}
```

**Key Points:**
- Follow existing DTO patterns (class-validator decorators)
- Use ApiProperty for Swagger documentation
- Validate email, URL, and phone formats
- Map `logoUrl` to `logo_url` in service layer

---
#### Step 1.2: Create Slug Generation Utility
**File:** `nsgdp-backend/src/common/utils/slug.utils.ts` (create if doesn't exist)

```typescript
/**
 * Generate URL-friendly slug from a string
 * @param text - Input text to slugify
 * @returns URL-friendly slug
 * @example generateSlug("Niger State Health Agency") -> "niger-state-health-agency"
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')           // Replace spaces and underscores with hyphens
    .replace(/[^\w\-]+/g, '')          // Remove non-word chars except hyphens
    .replace(/\-\-+/g, '-')            // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')                // Trim hyphens from start
    .replace(/-+$/, '');               // Trim hyphens from end
}

/**
 * Generate unique slug by appending number if needed
 * @param baseSlug - Base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @returns Unique slug
 */
export function makeSlugUnique(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}
```

---
#### Step 1.3: Add Service Method
**File:** `nsgdp-backend/src/modules/organisations/organisations.service.ts`

Add this method to the OrganisationsService class:

```typescript
import { ConflictException } from '@nestjs/common';
import { generateSlug, makeSlugUnique } from '../../common/utils/slug.utils';
import { CreateOrganisationDto } from './dto/create-organisation.dto';

/**
 * Create a new organisation (Super Admin only)
 */
async create(
  createDto: CreateOrganisationDto,
  createdBy: string,
): Promise<Organisation> {
  // Check name uniqueness
  const existingByName = await this.organisationsRepository.findOne({
    where: { name: createDto.name },
  });

  if (existingByName) {
    throw new ConflictException(
      `Organisation with name "${createDto.name}" already exists`,
    );
  }

  // Generate slug from name
  const baseSlug = generateSlug(createDto.name);
  
  // Check slug uniqueness and append number if needed
  const existingSlugs = (await this.organisationsRepository.find({
    select: ['slug'],
  })).map(org => org.slug);
  
  const uniqueSlug = makeSlugUnique(baseSlug, existingSlugs);

  // Create organisation
  const organisation = this.organisationsRepository.create({
    name: createDto.name,
    slug: uniqueSlug,
    description: createDto.description,
    type: createDto.type,
    website: createDto.website,
    email: createDto.email,
    phone: createDto.phone,
    address: createDto.address,
    logo_url: createDto.logoUrl,
    is_active: true,
    created_by: createdBy,
  });

  return this.organisationsRepository.save(organisation);
}
```

**Key Points:**
- Check name uniqueness before creating
- Auto-generate slug with uniqueness check
- Set `created_by` to current user ID
- Default `is_active` to true

---
#### Step 1.4: Add Controller Endpoint
**File:** `nsgdp-backend/src/modules/organisations/organisations.controller.ts`

Add these imports and method:

```typescript
import {
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateOrganisationDto } from './dto/create-organisation.dto';

// Add RolesGuard to controller (if not already)
@UseGuards(RolesGuard)
@Controller('organisations')
export class OrganisationsController {
  // ... existing methods ...

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Create a new organisation (Super Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Organisation created successfully',
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Organisation with this name already exists' 
  })
  async create(
    @Body() createDto: CreateOrganisationDto,
    @CurrentUser() user: { id: string },
  ): Promise<Organisation> {
    return this.organisationsService.create(createDto, user.id);
  }
}
```

**Key Points:**
- Use `@Roles(UserRole.SUPER_ADMIN)` decorator
- Extract user ID from JWT token via @CurrentUser decorator
- Return HTTP 201 (Created) on success
- Return HTTP 409 (Conflict) if name exists

---
### Phase 2: Frontend API & Hooks (30 minutes)

#### Step 2.1: Update API Types & Client
**File:** `NSGDP-Frontend/src/lib/api/organisations.ts`

Add at the end:

```typescript
export interface CreateOrganisationPayload {
  name: string;
  description?: string;
  type: OrganisationType;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  logoUrl?: string;
}

/**
 * Create a new organisation (Super Admin only)
 */
export async function createOrganisation(
  payload: CreateOrganisationPayload
): Promise<Organisation> {
  const response = await apiClient.post<ApiResponse<Organisation>>(
    '/organisations',
    payload
  );
  return response.data.data;
}
```

---

#### Step 2.2: Create Zod Schema
**File:** `NSGDP-Frontend/src/lib/schemas/organisation.ts` (create new)

```typescript
import { z } from "zod";

export const organisationFormSchema = z.object({
  name: z
    .string()
    .min(3, "Organisation name must be at least 3 characters")
    .max(100, "Organisation name must not exceed 100 characters"),
  
  type: z.enum([
    "government",
    "ngo",
    "private",
    "international",
    "academic",
    "community",
  ], {
    errorMap: () => ({ message: "Please select an organisation type" }),
  }),
  
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional(),
  
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  
  phone: z
    .string()
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      "Please enter a valid phone number"
    )
    .optional()
    .or(z.literal("")),
  
  address: z
    .string()
    .max(200, "Address must not exceed 200 characters")
    .optional(),
  
  logoUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

export type OrganisationFormData = z.infer<typeof organisationFormSchema>;
```

---
#### Step 2.3: Create Mutation Hook
**File:** `NSGDP-Frontend/src/lib/hooks/useOrganisations.ts`

Add at the end:

```typescript
import { useMutation } from '@tanstack/react-query';
import { createOrganisation, type CreateOrganisationPayload } from '../api/organisations';

/**
 * Create a new organisation (Super Admin only)
 */
export function useCreateOrganisation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrganisationPayload) => createOrganisation(data),
    onSuccess: () => {
      // Invalidate organisations list to refetch
      queryClient.invalidateQueries({
        queryKey: ['organisations'],
      });
    },
  });
}
```

**Key Points:**
- Use React Query's useMutation
- Invalidate cache on success to trigger refetch
- Handle errors via mutation.error

---
### Phase 3: Frontend UI Components (1-2 hours)

#### Step 3.1: Create Organisation Modal
**File:** `NSGDP-Frontend/src/components/admin/create-organisation-modal.tsx` (create new)

```typescript
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormError } from "@/components/forms/form-error";
import { useCreateOrganisation } from "@/lib/hooks/useOrganisations";
import { organisationFormSchema, type OrganisationFormData } from "@/lib/schemas/organisation";
import { toast } from "sonner";

interface CreateOrganisationModalProps {
  open: boolean;
  onClose: () => void;
}

const ORG_TYPES = [
  { value: "government", label: "Government Agency" },
  { value: "ngo", label: "Non-Governmental Organisation" },
  { value: "private", label: "Private Sector" },
  { value: "international", label: "International Organisation" },
  { value: "academic", label: "Academic Institution" },
  { value: "community", label: "Community Organisation" },
] as const;

export function CreateOrganisationModal({ open, onClose }: CreateOrganisationModalProps) {
  const [loading, setLoading] = useState(false);
  const createMutation = useCreateOrganisation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<OrganisationFormData>({
    resolver: zodResolver(organisationFormSchema),
    defaultValues: {
      type: "government",
    },
  });

  const onSubmit = async (data: OrganisationFormData) => {
    setLoading(true);

    try {
      await createMutation.mutateAsync({
        name: data.name,
        type: data.type,
        description: data.description || undefined,
        website: data.website || undefined,
        email: data.email || undefined,
        phone: data.phone || undefined,
        address: data.address || undefined,
        logoUrl: data.logoUrl || undefined,
      });

      toast.success(`Organisation "${data.name}" created successfully`);
      reset();
      onClose();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to create organisation";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="size-5" />
            Create New Organisation
          </DialogTitle>
          <DialogDescription>
            Add a new partner organisation to the platform. All fields except name and type are optional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name - Required */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">
              Organisation Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              placeholder="e.g. Niger State Primary Health Care Agency"
              {...register("name")}
            />
            <FormError message={errors.name?.message} />
          </div>

          {/* Type - Required */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-1.5">
              Organisation Type <span className="text-destructive">*</span>
            </label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select organisation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORG_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FormError message={errors.type?.message} />
          </div>

          {/* Description - Optional */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1.5">
              Description
            </label>
            <Textarea
              id="description"
              rows={3}
              maxLength={500}
              placeholder="Brief description of the organisation..."
              {...register("description")}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Optional · Max 500 characters
            </p>
            <FormError message={errors.description?.message} />
          </div>

          {/* Contact Information Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="contact@example.org"
                {...register("email")}
              />
              <FormError message={errors.email?.message} />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
                Phone
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+234 803 123 4567"
                {...register("phone")}
              />
              <FormError message={errors.phone?.message} />
            </div>
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium mb-1.5">
              Website
            </label>
            <Input
              id="website"
              type="url"
              placeholder="https://example.org"
              {...register("website")}
            />
            <FormError message={errors.website?.message} />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-1.5">
              Physical Address
            </label>
            <Input
              id="address"
              placeholder="123 Main Street, City, State"
              {...register("address")}
            />
            <FormError message={errors.address?.message} />
          </div>

          {/* Logo URL */}
          <div>
            <label htmlFor="logoUrl" className="block text-sm font-medium mb-1.5">
              Logo URL
            </label>
            <Input
              id="logoUrl"
              type="url"
              placeholder="https://example.com/logo.png"
              {...register("logoUrl")}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Direct link to logo image (future: file upload)
            </p>
            <FormError message={errors.logoUrl?.message} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Organisation"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

**Key Points:**
- Follow existing modal patterns (InviteModal)
- Use react-hook-form with zod validation
- Show loading state during submission
- Reset form on success
- Handle errors with toast notifications

---
#### Step 3.2: Update Admin Organisations Page
**File:** `NSGDP-Frontend/src/app/admin/organisations/page.tsx`

Replace the button click handler:

```typescript
// At top of file
import { CreateOrganisationModal } from "@/components/admin/create-organisation-modal";

// Inside component
const [createModalOpen, setCreateModalOpen] = useState(false);

// Replace the button:
<Button onClick={() => setCreateModalOpen(true)}>
  <Plus className="size-4" />
  Add New Org
</Button>

// Add modal at the bottom, before closing div:
<CreateOrganisationModal 
  open={createModalOpen} 
  onClose={() => setCreateModalOpen(false)} 
/>
```

**Complete updated section:**

```typescript
export default function AdminOrganisationsPage() {
  const { data, isLoading } = useOrganisations(1, 100);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const orgs = useMemo(() => {
    return data?.data || [];
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Organisation Management</h1>
          <p className="text-muted-foreground mt-1">
            {orgs.length} organisations · manage partner organisations
          </p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="size-4" />
          Add New Org
        </Button>
      </div>

      {/* ... existing table code ... */}

      <CreateOrganisationModal 
        open={createModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
      />
    </div>
  );
}
```

---
## ✅ Testing Checklist

### Backend Testing

- [ ] **Endpoint exists:** `POST /organisations` returns 201 on success
- [ ] **Authentication:** Endpoint requires JWT token
- [ ] **Authorization:** Only super_admin role can access
- [ ] **Validation:** Returns 400 for invalid data
  - [ ] Name too short (< 3 chars)
  - [ ] Name too long (> 100 chars)
  - [ ] Invalid email format
  - [ ] Invalid URL format
  - [ ] Invalid phone format
- [ ] **Uniqueness:** Returns 409 if organisation name exists
- [ ] **Slug generation:** Auto-generates URL-friendly slug
- [ ] **Slug uniqueness:** Appends number if slug exists
- [ ] **Database:** Organisation saved with correct fields
- [ ] **Audit:** `created_by` field set to current user ID

### Frontend Testing

- [ ] **Modal opens:** Click "Add New Org" button opens modal
- [ ] **Form validation:** Shows errors for invalid inputs
  - [ ] Name required
  - [ ] Type required
  - [ ] Email format validation
  - [ ] URL format validation
  - [ ] Phone format validation
- [ ] **Submit works:** Form submits successfully
- [ ] **Loading state:** Button shows loading spinner
- [ ] **Success feedback:** Toast notification appears
- [ ] **Table updates:** New organisation appears in table
- [ ] **Modal closes:** Modal closes after success
- [ ] **Form resets:** Form fields cleared after success
- [ ] **Error handling:** Shows error toast for failures
- [ ] **Network errors:** Handles API errors gracefully

### Edge Cases

- [ ] **Duplicate name:** Proper error message displayed
- [ ] **Long names:** Truncated in table view
- [ ] **Special characters:** Handled in slug generation
- [ ] **Empty optional fields:** Saved as null/undefined
- [ ] **Cancel button:** Closes modal without saving
- [ ] **Click outside:** Modal closes (if not loading)

---
## 🚀 Implementation Order

### Day 1: Backend (Priority)

1. ✅ Create `CreateOrganisationDto` with validation
2. ✅ Create slug generation utility
3. ✅ Add `create()` method to service
4. ✅ Add POST endpoint to controller
5. ✅ Test with Postman/Thunder Client
6. ✅ Verify Swagger documentation

**Estimated Time:** 1-2 hours

### Day 2: Frontend API Layer

1. ✅ Add `CreateOrganisationPayload` type
2. ✅ Add `createOrganisation()` API function
3. ✅ Create `organisationFormSchema` (Zod)
4. ✅ Add `useCreateOrganisation()` hook
5. ✅ Test API calls in browser console

**Estimated Time:** 30 minutes

### Day 3: Frontend UI

1. ✅ Create `CreateOrganisationModal` component
2. ✅ Update admin organisations page
3. ✅ Test form validation
4. ✅ Test full create flow
5. ✅ Test error scenarios

**Estimated Time:** 1-2 hours

---

## 📝 API Contract

### Request

```http
POST /organisations
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Niger State Primary Health Care Agency",
  "type": "government",
  "description": "The primary healthcare coordinating agency",
  "website": "https://nsphcda.org",
  "email": "info@nsphcda.org",
  "phone": "+234 803 123 4567",
  "address": "Plot 123, Minna, Niger State",
  "logoUrl": "https://storage.example.com/logos/nsphcda.png"
}
```

### Success Response (201 Created)

```json
{
  "success": true,
  "statusCode": 201,
  "timestamp": "2026-01-15T10:30:00Z",
  "path": "/organisations",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Niger State Primary Health Care Agency",
    "slug": "niger-state-primary-health-care-agency",
    "description": "The primary healthcare coordinating agency",
    "type": "government",
    "website": "https://nsphcda.org",
    "email": "info@nsphcda.org",
    "phone": "+234 803 123 4567",
    "address": "Plot 123, Minna, Niger State",
    "logoUrl": "https://storage.example.com/logos/nsphcda.png",
    "isActive": true,
    "createdAt": "2026-01-15T10:30:00Z",
    "updatedAt": "2026-01-15T10:30:00Z",
    "createdBy": "admin-user-id"
  }
}
```

### Error Responses

**409 Conflict - Duplicate Name**
```json
{
  "success": false,
  "statusCode": 409,
  "message": "Organisation with name \"Niger State Primary Health Care Agency\" already exists",
  "timestamp": "2026-01-15T10:30:00Z",
  "path": "/organisations"
}
```

**400 Bad Request - Validation Error**
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    "Name must be at least 3 characters",
    "Please provide a valid email address"
  ],
  "timestamp": "2026-01-15T10:30:00Z",
  "path": "/organisations"
}
```

**403 Forbidden - Not Super Admin**
```json
{
  "success": false,
  "statusCode": 403,
  "message": "Insufficient permissions. Super admin role required.",
  "timestamp": "2026-01-15T10:30:00Z",
  "path": "/organisations"
}
```

---
## 🔮 Future Enhancements

### Phase 2: Logo Upload
- Replace logoUrl text input with file upload
- Integrate with MinIO storage
- Generate thumbnails
- Validate image format and size

### Phase 3: Edit Organisation
- Add edit modal
- Update existing organisations
- Preserve slug or regenerate option

### Phase 4: Delete/Archive Organisation
- Soft delete (set is_active = false)
- Prevent deletion if has datasets
- Archive confirmation dialog

### Phase 5: Organisation Management
- Assign/reassign users to organisations
- View organisation members
- Organisation-level permissions
- Organisation statistics dashboard

---

## 📚 References

### Existing Patterns to Follow

- **DTO Pattern:** `create-dataset.dto.ts`
- **Service Pattern:** `organisations.service.ts` (findAll method)
- **Controller Pattern:** `organisations.controller.ts` (existing GET endpoints)
- **Modal Pattern:** `invite-modal.tsx`
- **Form Pattern:** `program-form.tsx`
- **Hook Pattern:** `useInvites.ts` (useCreateInvite)
- **Schema Pattern:** `program.ts` (programFormSchema)

### Key Dependencies

- **Backend:** NestJS, TypeORM, class-validator, class-transformer
- **Frontend:** Next.js, React Hook Form, Zod, TanStack Query, Shadcn UI

---

## ✨ Success Criteria

**Backend Complete When:**
- ✅ POST /organisations endpoint works
- ✅ Validates all input fields
- ✅ Checks name uniqueness
- ✅ Generates unique slugs
- ✅ Only accessible by super admin
- ✅ Returns proper HTTP status codes
- ✅ Swagger documentation updated

**Frontend Complete When:**
- ✅ Modal opens and closes properly
- ✅ Form validates all fields
- ✅ Successfully creates organisations
- ✅ Shows loading states
- ✅ Displays success/error messages
- ✅ Table refreshes automatically
- ✅ Form resets after success

**Feature Complete When:**
- ✅ All tests pass
- ✅ No console errors
- ✅ Responsive on mobile
- ✅ Accessible (keyboard navigation)
- ✅ Documented in this file

---

## 🎯 Quick Start

To implement this feature, follow these steps in order:

1. **Backend first** - Start with Step 1.1 (DTO)
2. **Test backend** - Use Postman to verify endpoint works
3. **Frontend API** - Add API client and hook
4. **Frontend UI** - Build the modal component
5. **Integration test** - Test full flow end-to-end
6. **Edge cases** - Test error scenarios
7. **Polish** - Fix any UX issues

**Total Estimated Time:** 3-5 hours

---

**Status:** 📋 Ready for Implementation  
**Created:** January 2026  
**Author:** Kiro AI Agent  
**Last Updated:** January 2026
