import { z } from "zod";

export const submitDatasetSchema = z.object({
  datasetName: z.string().min(3, "Dataset name must be at least 3 characters"),
  organisation: z.string().min(2, "Organisation is required"),
  category: z.enum(["Disease Data", "Health Facilities", "Population", "Surveillance"], {
    message: "Select a category",
  }),
  dataFormat: z.enum(
    ["CSV", "Excel", "JSON", "GeoJSON", "Shapefile", "DHIS2 Export"],
    { message: "Select a data format" }
  ),
  updateFrequency: z.enum(
    ["Daily", "Weekly", "Monthly", "Quarterly", "Annually", "One-time"],
    { message: "Select update frequency" }
  ),
  description: z.string().min(20, "Description must be at least 20 characters"),
  contactEmail: z.string().email("Enter a valid email address"),
});

export type SubmitDatasetFormData = z.infer<typeof submitDatasetSchema>;
