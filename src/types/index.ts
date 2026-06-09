// Shared domain types for the Niger State Open Data Portal.
// See docs/Frontend_PRD_v1.0.md §2 (Roles) and the Wireframe PRD.

export type UserRole =
  | "public" // not authenticated
  | "registered"
  | "contributor"
  | "org_admin"
  | "super_admin";

export type Visibility = "public" | "restricted" | "private";

export type DatasetStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "needs_revision"
  | "published"
  | "rejected"
  | "archived";

export type FileFormat =
  | "CSV"
  | "XLSX"
  | "PDF"
  | "JSON"
  | "GeoJSON"
  | "Shapefile"
  | "KML"
  | "Other";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  organisationIds: string[];
}

export interface Organisation {
  id: string;
  slug: string;
  name: string;
  acronym?: string;
  sector: string;
  logoUrl?: string;
  brandColor?: string;
  description?: string;
  datasetCount: number;
}

export interface Group {
  id: string;
  slug: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  datasetCount: number;
}

export interface DatasetResource {
  id: string;
  name: string;
  format: FileFormat;
  sizeBytes: number;
  updatedAt: string;
}

export interface Dataset {
  id: string;
  slug: string;
  title: string;
  description?: string;
  organisation: Pick<Organisation, "id" | "slug" | "name" | "logoUrl">;
  groups: Pick<Group, "id" | "slug" | "name">[];
  visibility: Visibility;
  status: DatasetStatus;
  formats: FileFormat[];
  lgaCoverage: string[];
  downloadCount: number;
  updatedAt: string;
  resources?: DatasetResource[];
}
