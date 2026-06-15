export const mockPlatformKPIs = {
  totalUsers: 248,
  totalDatasets: 24,
  downloadsThisMonth: 1847,
  pendingReview: 3,
  totalDownloads: 7002,
};

export const mockUploadsOverTime = [
  { month: "Jan", uploads: 4 },
  { month: "Feb", uploads: 6 },
  { month: "Mar", uploads: 3 },
  { month: "Apr", uploads: 8 },
  { month: "May", uploads: 5 },
  { month: "Jun", uploads: 7 },
];

export const mockDownloadsByDataset = [
  { name: "Health Facility Registry", downloads: 1240 },
  { name: "Malaria Surveillance", downloads: 980 },
  { name: "Population Estimates", downloads: 756 },
  { name: "Routine Immunisation", downloads: 620 },
  { name: "NHMIS Aggregate", downloads: 540 },
  { name: "LGA Boundaries", downloads: 480 },
  { name: "Meningitis Cases", downloads: 390 },
  { name: "HIV Unit Data", downloads: 310 },
  { name: "TB Surveillance", downloads: 280 },
  { name: "Maternal Health", downloads: 245 },
];

export const mockNewUsersOverTime = [
  { month: "Jan", users: 12 },
  { month: "Feb", users: 18 },
  { month: "Mar", users: 15 },
  { month: "Apr", users: 22 },
  { month: "May", users: 19 },
  { month: "Jun", users: 28 },
];

export const mockAnalyticsKPIs = {
  totalCases: 48291,
  healthFacilities: 2191,
  lgasCovered: 25,
  outlierFacilities: 14,
};

export const mockDiseaseMetrics = [
  "Severe Malaria Cases",
  "Meningitis Cases",
  "Cholera Cases",
  "Routine Immunisation",
  "ANC Attendance",
  "U5 Mortality",
];

export const mockLGABurden = [
  { rank: 1, lga: "Chanchaga", totalCases: 4820, facilities: 187, population: 688000, incidence: 7.01 },
  { rank: 2, lga: "Bida", totalCases: 3910, facilities: 142, population: 512000, incidence: 7.64 },
  { rank: 3, lga: "Suleja", totalCases: 2840, facilities: 98, population: 421000, incidence: 6.75 },
  { rank: 4, lga: "Kontagora", totalCases: 2210, facilities: 76, population: 389000, incidence: 5.68 },
  { rank: 5, lga: "Minna", totalCases: 1980, facilities: 65, population: 310000, incidence: 6.39 },
];

export function getMockTrendData(metric: string) {
  const years = Array.from({ length: 13 }, (_, i) => 2013 + i);
  return years.map((year) => ({
    year: String(year),
    cases: Math.floor(2000 + Math.random() * 3000 + (metric.length % 5) * 200),
  }));
}
