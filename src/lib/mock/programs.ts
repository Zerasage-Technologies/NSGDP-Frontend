import type { Program } from "@/types";

export const mockPrograms: Program[] = [
  // ── CAMPAIGNS (vaccination / SIA) ────────────────────────────────────────
  {
    id: "prog-1",
    slug: "measles-rubella-integrated-2026",
    name: "Measles-Rubella Integrated Campaign",
    type: "campaign",
    status: "ongoing",
    description:
      "State-wide supplementary immunisation activity targeting children 9–59 months for Measles-Rubella (MR) antigen as part of the national measles elimination strategy.",
    startDate: "2026-03-01",
    primaryMetric: "MR Coverage",
    completionPercent: 78,
    reachCount: 412000,
    targetCount: 528000,
    activeDays: 45,
    lgasCovered: 22,
  },
  {
    id: "prog-2",
    slug: "ipv-catchup-2025",
    name: "IPV Catch-up Campaign",
    type: "campaign",
    status: "completed",
    description:
      "Inactivated Polio Vaccine catch-up campaign targeting unvaccinated and under-vaccinated children across all 25 LGAs following the 2025 surveillance alert.",
    startDate: "2025-11-01",
    endDate: "2025-12-15",
    primaryMetric: "IPV3 Coverage",
    completionPercent: 100,
    reachCount: 298000,
    targetCount: 317000,
    activeDays: 44,
    lgasCovered: 25,
    reports: [
      {
        id: "rpt-ipv-1",
        title: "IPV Catch-up Campaign Final Report",
        uploadedAt: "2026-01-10T09:00:00Z",
        uploadedBy: "State EPI Coordinator",
        fileSizeBytes: 2400000,
        fileFormat: "PDF",
        url: "/reports/ipv-catchup-2025-final.pdf",
      },
      {
        id: "rpt-ipv-2",
        title: "LGA Coverage Data Workbook",
        uploadedAt: "2026-01-12T11:30:00Z",
        uploadedBy: "M&E Officer",
        fileSizeBytes: 890000,
        fileFormat: "XLSX",
        url: "/reports/ipv-lga-data-2025.xlsx",
      },
    ],
    linkedDatasetIds: ["ds-ipv-coverage-2025"],
  },
  {
    id: "prog-3",
    slug: "opv-sia-2026",
    name: "OPV Supplementary Immunisation Activity",
    type: "campaign",
    status: "planned",
    description:
      "Planned oral polio vaccine supplementary immunisation activity targeting children under 5 years across all LGAs in August 2026.",
    startDate: "2026-08-01",
    primaryMetric: "OPV Coverage",
    completionPercent: 0,
    reachCount: 0,
    targetCount: 540000,
    activeDays: 0,
    lgasCovered: 0,
  },

  // ── SURVEILLANCE ──────────────────────────────────────────────────────────
  {
    id: "prog-4",
    slug: "diphtheria-sia-response-2026",
    name: "Diphtheria SIA Response",
    type: "surveillance",
    status: "ongoing",
    description:
      "Coordinated surveillance and reactive vaccination response to the Diphtheria outbreak detected in Q4 2025. Includes active case finding, contact tracing, and SIA in hotspot LGAs.",
    startDate: "2026-01-15",
    primaryMetric: "SIA Coverage & Zero-Dose Recovery",
    completionPercent: 62,
    reachCount: 187000,
    targetCount: 301000,
    activeDays: 28,
    lgasCovered: 18,
  },
  {
    id: "prog-5",
    slug: "malaria-surveillance-2025",
    name: "Malaria Surveillance Strengthening Programme",
    type: "surveillance",
    status: "completed",
    description:
      "Quarterly active case surveillance in 10 high-burden LGAs. Trained 320 community health workers on RDT use, data capture, and weekly reporting to the state dashboard.",
    startDate: "2025-04-01",
    endDate: "2025-12-31",
    primaryMetric: "Weekly Reporting Rate",
    completionPercent: 100,
    reachCount: 320,
    targetCount: 320,
    activeDays: 270,
    lgasCovered: 10,
    reports: [
      {
        id: "rpt-mal-1",
        title: "Malaria Surveillance Programme — Annual Report 2025",
        uploadedAt: "2026-02-01T08:00:00Z",
        uploadedBy: "Disease Surveillance Coordinator",
        fileSizeBytes: 3100000,
        fileFormat: "PDF",
        url: "/reports/malaria-surveillance-2025.pdf",
      },
    ],
  },

  // ── SCREENING ──────────────────────────────────────────────────────────────
  {
    id: "prog-6",
    slug: "anc-screening-rural-2026",
    name: "Rural ANC Screening Outreach",
    type: "screening",
    status: "ongoing",
    description:
      "Mobile antenatal care screening units deployed to 8 underserved rural LGAs. Focus on early detection of hypertension, anaemia, and HIV among pregnant women.",
    startDate: "2026-02-01",
    primaryMetric: "ANC First Visit Coverage",
    completionPercent: 55,
    reachCount: 14200,
    targetCount: 26000,
    activeDays: 60,
    lgasCovered: 8,
  },

  // ── TRAINING ──────────────────────────────────────────────────────────────
  {
    id: "prog-7",
    slug: "chw-data-training-2025",
    name: "Community Health Worker Data Literacy Programme",
    type: "training",
    status: "completed",
    description:
      "Structured 3-day training programme on digital data collection, DHIS2 mobile reporting, and geospatial basics for 480 CHWs across all 25 LGAs.",
    startDate: "2025-07-01",
    endDate: "2025-09-30",
    primaryMetric: "CHWs Trained",
    completionPercent: 100,
    reachCount: 480,
    targetCount: 480,
    activeDays: 92,
    lgasCovered: 25,
    reports: [
      {
        id: "rpt-chw-1",
        title: "CHW Data Literacy — Training Completion Report",
        uploadedAt: "2025-10-15T10:00:00Z",
        uploadedBy: "Training Coordinator",
        fileSizeBytes: 1800000,
        fileFormat: "PDF",
        url: "/reports/chw-data-training-2025.pdf",
      },
      {
        id: "rpt-chw-2",
        title: "Post-Training Assessment Results",
        uploadedAt: "2025-10-20T14:00:00Z",
        uploadedBy: "M&E Officer",
        fileSizeBytes: 560000,
        fileFormat: "XLSX",
        url: "/reports/chw-assessment-2025.xlsx",
      },
    ],
  },

  // ── RESEARCH ──────────────────────────────────────────────────────────────
  {
    id: "prog-8",
    slug: "lga-health-equity-study-2026",
    name: "LGA Health Equity Baseline Study",
    type: "research",
    status: "planned",
    description:
      "Cross-sectional household survey to establish baseline equity indicators — access, utilisation, and outcomes — disaggregated by LGA, sex, and wealth quintile.",
    startDate: "2026-09-01",
    primaryMetric: "Households Surveyed",
    completionPercent: 0,
    reachCount: 0,
    targetCount: 5000,
    activeDays: 0,
    lgasCovered: 25,
  },
];

/** Campaigns are a subset of programs */
export const mockCampaigns = mockPrograms.filter((p) => p.type === "campaign");
