// NSPHCDA Data Portal — domain types (PRD v2.0)

export type UserRole =
  | "public"
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

export type HealthCategory =
  | "disease"
  | "facilities"
  | "population"
  | "surveillance";

export type AccessLevel = "public" | "partner" | "administrator";

export type ProgramStatus = "ongoing" | "completed" | "planned";

/** @deprecated use ProgramStatus */
export type CampaignStatus = ProgramStatus;

export type ProgramType =
  | "campaign"
  | "surveillance"
  | "screening"
  | "training"
  | "infrastructure"
  | "research"
  | "other";

export type FacilityType = "PHC" | "Secondary" | "General Hospital";

export type AnalyticsMetric =
  | "severe_malaria"
  | "meningitis"
  | "cholera"
  | "diphtheria"
  | "anc_attendance"
  | "delivery_sba"
  | "routine_immunisation"
  | "u5_mortality"
  | "death_cases";

export interface KeyAttribute {
  fieldName: string;
  exampleValue: string;
  description: string;
}

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
  healthCategory?: HealthCategory;
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
  healthCategory: HealthCategory;
  visibility: Visibility;
  status: DatasetStatus;
  formats: FileFormat[];
  lgaCoverage: string[];
  downloadCount: number;
  updatedAt: string;
  resources?: DatasetResource[];
  // PRD v2.0 extended metadata
  custodian?: string;
  dateCollected?: string;
  updateFrequency?: string;
  methodology?: string;
  citation?: string;
  dataType?: "spatial" | "attribute";
  source?: string;
  portalSource?: string;
  keyAttributes?: KeyAttribute[];
  /** Optional link to a Program this dataset belongs to */
  programId?: string;
}

export interface Facility {
  id: string;
  name: string;
  lga: string;
  ward: string;
  facilityType: FacilityType;
  facilityCode: string;
  coordinates: { lat: number; lng: number };
}

export interface ProgramReport {
  id: string;
  title: string;
  uploadedAt: string;
  uploadedBy: string;
  fileSizeBytes: number;
  fileFormat: "PDF" | "DOCX" | "XLSX";
  url: string;
}

export interface Program {
  id: string;
  slug: string;
  name: string;
  type: ProgramType;
  status: ProgramStatus;
  description: string;
  startDate: string;
  endDate?: string;
  primaryMetric: string;
  completionPercent: number;
  reachCount: number;
  targetCount: number;
  activeDays: number;
  lgasCovered: number;
  /** Reports are only visible when completionPercent === 100 */
  reports?: ProgramReport[];
  linkedDatasetIds?: string[];
}

/** @deprecated use Program */
export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  startDate: string;
  endDate?: string;
  primaryMetric: string;
  coveragePercent: number;
  vaccinatedCount: number;
  targetCount: number;
  activeDays: number;
  lgasCovered: number;
}

export interface LGABurden {
  rank: number;
  lga: string;
  totalCases: number;
  facilities: number;
  population: number;
  incidencePer1000: number;
}

export interface OutlierFacility {
  facility: string;
  lga: string;
  totalCases: number;
  zScore: number;
  interpretation: string;
}

export interface DiseaseTimeSeriesPoint {
  year: number;
  month?: number;
  value: number;
}

export interface LGACaseData {
  lga: string;
  cases: number;
  population: number;
  facilities: number;
}
