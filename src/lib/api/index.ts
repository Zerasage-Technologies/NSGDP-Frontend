// API Module Exports
// Central export point for all API functions

// Core client
export { apiFetch, ApiError } from "./client";

// Auth API functions
export {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  getCurrentUser,
} from "./auth";

// Organisations API functions
export {
  getOrganisations,
  getOrganisationBySlug,
  type Organisation,
  type OrganisationType,
  type OrganisationWithDatasets,
  type GetOrganisationsParams,
} from "./organisations";

// Categories API functions
export {
  getCategories,
  getCategoryBySlug,
  type Category,
  type CategoryWithDatasets,
  type GetCategoriesParams,
} from "./categories";
