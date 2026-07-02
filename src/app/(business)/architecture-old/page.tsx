// Archived architecture diagram — PRD v2.0 prototype reference (June 2026)
// Superseded by /architecture (post-debrief PRD v3.0 view)
// Original: portal-architecture.canvas.tsx (cursor/canvas → plain React)

const C = {
  tierBg:     ["#f9fafb", "#f3f4f6", "#e9ecef", "#1a4731"] as const,
  tierBorder: ["#e5e7eb", "#d1d5db", "#9ca3af", "#1a4731"] as const,
  tierLabel:  ["#6b7280", "#111827", "#111827", "#ffffff"]  as const,
  tierGate:   ["#9ca3af", "#1a4731", "#1a4731", "#bbf7d0"] as const,
  textPrimary:   "#111827",
  textSecondary: "#4b5563",
  textTertiary:  "#9ca3af",
  textMuted:     "#d1d5db",
  fillSurface:   "#f3f4f6",
  fillSubtle:    "#f9fafb",
  border:        "#e5e7eb",
  arrow:         "#9ca3af",
};

const roles = [
  {
    id: "public",
    label: "Public Visitor",
    gate: "Open Access",
    sub: "No account required",
    features: [
      { page: "Homepage",            desc: "Map hero · stats · 6 feature cards" },
      { page: "Data Portal",         desc: "25 datasets · health categories · search" },
      { page: "Dataset Detail",      desc: "Metadata modal · download gate" },
      { page: "Analytics Dashboard", desc: "KPIs · trends · LGA burden table" },
      { page: "Disease Burden Map",  desc: "Leaflet · proportional bubbles" },
      { page: "Health Facility Map", desc: "2,191 facilities · popup · filter" },
      { page: "Programs",             desc: "Campaigns · surveillance · training · reports" },
      { page: "Tools & Learning",    desc: "QGIS · videos · e-books · path" },
      { page: "About",               desc: "Partners · testimonials · LGA map" },
    ],
  },
  {
    id: "registered",
    label: "Registered User",
    gate: "+ Login",
    sub: "Email + password · email verify",
    features: [
      { page: "Dashboard",                 desc: "Role-adaptive widgets · activity" },
      { page: "My Downloads",              desc: "History table · re-download" },
      { page: "Profile & Settings",        desc: "Account · security · preferences" },
      { page: "Request Restricted Access", desc: "Reason modal → pending → approved" },
      { page: "Notifications",             desc: "Approval alerts · activity updates" },
    ],
  },
  {
    id: "contributor",
    label: "Data Contributor",
    gate: "+ Elevated Role",
    sub: "Admin-approved",
    features: [
      { page: "Submit Data",     desc: "2-col form · requirements panel" },
      { page: "Upload Wizard",   desc: "3-step · drag-drop · format detect" },
      { page: "My Datasets",     desc: "Status tracking · 7 workflow states" },
      { page: "Edit Dataset",    desc: "Pre-filled wizard · version chain" },
      { page: "Draft Auto-save", desc: "60s interval · toast confirmation" },
    ],
  },
  {
    id: "admin",
    label: "NSPHCDA Admin",
    gate: "+ Admin · MFA",
    sub: "Full system access",
    features: [
      { page: "Review Queue",    desc: "Approve · Revise · Reject · AgeBadge" },
      { page: "QA Checklist",    desc: "Split-panel · reject ≥20 chars" },
      { page: "User Management", desc: "Role change · suspend · ban" },
      { page: "Audit Log",       desc: "Immutable · searchable · CSV export" },
      { page: "System Analytics",desc: "Platform KPIs · date range" },
      { page: "Program Management", desc: "Create · set timeline · update coverage · close" },
    ],
  },
];

const sysLayers = [
  {
    label: "Frontend",
    tech: "Next.js 15  ·  React 19  ·  TypeScript  ·  Tailwind CSS v4",
    items: [
      "Public pages (SSR/SSG)",
      "Auth flows (6 pages)",
      "Dashboard — CSR, role-adaptive",
      "Admin panel — 9 screens",
      "Leaflet.js — GIS maps",
      "Recharts — analytics charts",
      "TanStack Query — server state",
      "react-hook-form + Zod — forms",
      "Dev Role Switcher",
    ],
  },
  {
    label: "API",
    tech: "Fastify  ·  Node.js 22  ·  JWT RS256  ·  OpenAPI 3.0",
    items: [
      "/auth/* — register · login · MFA · reset",
      "/datasets/* — CRUD · search · download",
      "/gis/* — LGA polygons · facilities · disease GeoJSON",
      "/analytics/* — burden · Z-score · trends · export",
      "/uploads — multipart → MinIO → queue job",
      "/admin/* — review · users · audit · programs",
    ],
  },
  {
    label: "Workers",
    tech: "BullMQ  ·  Redis-backed  ·  6 queues  ·  parallel",
    items: [
      "GeoWorker — GPKG (better-sqlite3) · SHP · KML → PostGIS",
      "ETLWorker — CSV · Excel · DHIS2 export · PDF extract",
      "AnalyticsWorker — Z-score · LGA burden · Redis cache warm",
      "ValidationWorker — MIME · magic bytes · ClamAV scan",
      "NotifyWorker — Handlebars email · in-app bell",
      "ExportWorker — CSV · PDF (Puppeteer) · presigned URL",
    ],
  },
  {
    label: "Data",
    tech: "Spatial-first  ·  Polyglot persistence",
    items: [
      "PostgreSQL 16 + PostGIS 3.4 — 2,191 facilities · 25 LGA polygons · 274 wards · disease_burden time-series · tsvector FTS",
      "Redis 7 — BullMQ queues · analytics cache (1h TTL) · session store · rate limits",
      "MinIO (S3) — dataset files ≤50MB · export artifacts · presigned URLs (1h TTL) · state data sovereignty",
    ],
  },
];

const dataFormats = [
  { fmt: "GeoPackage .gpkg",   how: "better-sqlite3 reads SQLite, parses WKB header, bulk INSERT via ST_GeomFromWKB" },
  { fmt: "GeoJSON .geojson",   how: "JSON.parse → validate → ST_GeomFromGeoJSON stream" },
  { fmt: "Shapefile .zip",     how: "Unzip → shapefile npm → proj4 reproject → PostGIS" },
  { fmt: "KML / KMZ",          how: "@tmcw/togeojson conversion → GeoJSON path" },
  { fmt: "CSV with lat/lng",   how: "csv-parse → detect coord cols → ST_MakePoint" },
  { fmt: "Excel .xlsx/.xls",   how: "SheetJS workbook → rows → type inference → detect spatial" },
  { fmt: "DHIS2 export .json", how: "Parse dataValues[] → map orgUnit → disease_burden UPSERT" },
  { fmt: "PDF",                how: "pdf-parse → text extract → tsvector for full-text search" },
];

const dataAssets = [
  {
    title: "Niger Health Facilities.gpkg",
    stats: [
      { k: "Features",   v: "2,191" },
      { k: "Source",     v: "NHFR 2024 / GRID3" },
      { k: "CRS",        v: "EPSG:4326" },
      { k: "Key fields", v: "nhfr_facility_code · facility_level · ownership · lga · ward" },
    ],
  },
  {
    title: "Niger Local Govt Areas.gpkg",
    stats: [
      { k: "Features",   v: "25 LGA polygons" },
      { k: "Source",     v: "INEC" },
      { k: "CRS",        v: "EPSG:4326" },
      { k: "Key fields", v: "lganame · lgacode (27001) · amapcode" },
    ],
  },
  {
    title: "Additional Data Sources",
    stats: [
      { k: "Niger Wards.gpkg",               v: "274 ward boundaries" },
      { k: "Niger Pop Estimates LGA.csv",    v: "Population by LGA" },
      { k: "Niger Primary & Sec Roads.gpkg", v: "Road network" },
      { k: "MLoS V12.1 (.gpkg + .xlsx)",     v: "Master List of Services" },
      { k: "AFP Surveillance (.xlsx)",       v: "Disease reporting" },
      { k: "LGA HF Lists (25 × .xlsx)",      v: "Facility validation lists" },
    ],
  },
];

// SVG geometry constants
const BOX_W = 220;
const BOX_H = 38;
const ARROW_GAP = 52;
const START_X = 10;
const SVG_W = START_X * 2 + 4 * BOX_W + 3 * ARROW_GAP;

const dataFlowLabels = [
  "File upload → Worker queue",
  "Worker → PostGIS bulk load",
  "PostGIS → API aggregation",
  "API → Frontend TanStack Query",
];

const SectionLabel = ({ children }: { children: string }) => (
  <p style={{
    fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
    color: C.textTertiary, textTransform: "uppercase" as const,
    margin: "0 0 6px",
  }}>
    {children}
  </p>
);

const Divider = () => (
  <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "36px 0 28px" }} />
);

export default function ArchitecturePage() {
  return (
    <div style={{ padding: "40px 28px", color: C.textPrimary, maxWidth: 1200, margin: "0 auto" }}>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 8px" }}>
        NSPHCDA Data Portal
      </h1>
      <p style={{ fontSize: 14, color: C.textSecondary, margin: 0 }}>
        System Architecture — User Journey View &nbsp;·&nbsp; PRD v2.0 &nbsp;·&nbsp;
        FACT Foundation &nbsp;·&nbsp; June 2026
      </p>

      <div style={{ marginTop: 36 }} />
      <SectionLabel>User Journey</SectionLabel>

      {/* ── JOURNEY FLOW SVG ───────────────────────────────────────────── */}
      <svg
        viewBox={`0 0 ${SVG_W} ${BOX_H + 12}`}
        style={{ width: "100%", height: BOX_H + 12, display: "block", marginBottom: 14 }}
        aria-hidden="true"
      >
        <defs>
          <marker id="arr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={C.arrow} />
          </marker>
        </defs>
        {roles.map((role, i) => {
          const x = START_X + i * (BOX_W + ARROW_GAP);
          const midY = BOX_H / 2 + 6;
          return (
            <g key={role.id}>
              <rect
                x={x} y={6} width={BOX_W} height={BOX_H} rx={6}
                fill={C.tierBg[i]} stroke={C.tierBorder[i]} strokeWidth={1}
              />
              <text
                x={x + BOX_W / 2} y={midY - 7}
                textAnchor="middle" fill={C.tierLabel[i]}
                fontSize={13} fontWeight={600}
                fontFamily="system-ui,-apple-system,sans-serif"
              >
                {role.label}
              </text>
              <text
                x={x + BOX_W / 2} y={midY + 10}
                textAnchor="middle" fill={C.tierGate[i]}
                fontSize={10} fontFamily="system-ui,-apple-system,sans-serif"
              >
                {role.gate}
              </text>
              {i < 3 && (
                <line
                  x1={x + BOX_W + 4} y1={midY}
                  x2={x + BOX_W + ARROW_GAP - 6} y2={midY}
                  stroke={C.arrow} strokeWidth={1.5}
                  markerEnd="url(#arr)"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* ── FEATURE COLUMNS ────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {roles.map((role, i) => (
          <div
            key={role.id}
            style={{
              border: `1px solid ${C.tierBorder[i]}`,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div style={{
              background: C.tierBg[i],
              padding: "8px 13px",
              borderBottom: `1px solid ${C.tierBorder[i]}`,
            }}>
              <div style={{ fontSize: 11, color: C.tierGate[i], fontWeight: 500 }}>
                {role.sub}
              </div>
            </div>
            <div style={{ padding: "10px 13px" }}>
              {role.features.map(({ page, desc }, fi) => (
                <div
                  key={page}
                  style={{
                    paddingBottom: fi < role.features.length - 1 ? 9 : 0,
                    marginBottom: fi < role.features.length - 1 ? 9 : 0,
                    borderBottom: fi < role.features.length - 1
                      ? `1px solid ${C.border}` : "none",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.textPrimary, lineHeight: 1.3 }}>
                    {page}
                  </div>
                  <div style={{ fontSize: 11, color: C.textTertiary, marginTop: 2, lineHeight: 1.4 }}>
                    {desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── SYSTEM LAYERS ──────────────────────────────────────────────── */}
      <SectionLabel>System Architecture</SectionLabel>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>4-Tier Stack</h2>
      <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 16px" }}>
        Frontend · API Gateway · Background Workers · Data
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sysLayers.map((layer, li) => (
          <div
            key={layer.label}
            style={{
              display: "flex",
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div style={{
              background: C.fillSurface,
              padding: "12px 16px",
              width: 190,
              flexShrink: 0,
              borderRight: `1px solid ${C.border}`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>
                {layer.label}
              </div>
              <div style={{ fontSize: 11, color: C.textTertiary, marginTop: 5, lineHeight: 1.5 }}>
                {layer.tech}
              </div>
            </div>
            <div style={{
              padding: "10px 14px",
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              flex: 1,
              alignContent: "flex-start",
            }}>
              {layer.items.map((item, ii) => (
                <div
                  key={ii}
                  style={{
                    fontSize: 12,
                    color: li === 3 ? C.textPrimary : C.textSecondary,
                    background: C.fillSubtle,
                    border: `1px solid ${C.border}`,
                    borderRadius: 4,
                    padding: "4px 9px",
                    lineHeight: 1.4,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── DATA FLOW ARROW BAR ─────────────────────────────────────────── */}
      <div style={{ marginTop: 10, paddingLeft: 190 }}>
        <svg
          viewBox="0 0 600 28"
          style={{ width: 560, height: 28, display: "block" }}
          aria-hidden="true"
        >
          <defs>
            <marker id="da" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
              <polygon points="0 0, 6 2, 0 4" fill={C.arrow} />
            </marker>
          </defs>
          {dataFlowLabels.map((lbl, i) => (
            <g key={i}>
              <line
                x1={i * 150 + 4} y1={10}
                x2={i * 150 + 120} y2={10}
                stroke={C.arrow} strokeWidth={1}
                markerEnd="url(#da)"
              />
              <text
                x={i * 150 + 62} y={24}
                textAnchor="middle"
                fill={C.textTertiary}
                fontSize={9}
                fontFamily="system-ui,-apple-system,sans-serif"
              >
                {lbl}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <Divider />

      {/* ── GEOSPATIAL FORMAT SUPPORT ───────────────────────────────────── */}
      <SectionLabel>Data Ingestion Pipeline</SectionLabel>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 4px" }}>
        Geospatial & Data Format Support
      </h2>
      <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 16px" }}>
        8 formats handled natively in the worker pipeline — no GDAL binary dependency
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
        {dataFormats.map(({ fmt, how }) => (
          <div
            key={fmt}
            style={{
              display: "flex",
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            <div style={{
              background: C.fillSurface,
              padding: "9px 13px",
              width: 170,
              flexShrink: 0,
              borderRight: `1px solid ${C.border}`,
              display: "flex",
              alignItems: "center",
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.textPrimary }}>{fmt}</div>
            </div>
            <div style={{
              padding: "9px 13px",
              fontSize: 12,
              color: C.textSecondary,
              lineHeight: 1.4,
              display: "flex",
              alignItems: "center",
            }}>
              {how}
            </div>
          </div>
        ))}
      </div>

      <Divider />

      {/* ── CONFIRMED DATA ASSETS ───────────────────────────────────────── */}
      <SectionLabel>Confirmed at Deployment</SectionLabel>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 16px" }}>Real Data Assets</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {dataAssets.map(({ title, stats }) => (
          <div
            key={title}
            style={{
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <div style={{
              background: C.fillSurface,
              padding: "9px 13px",
              borderBottom: `1px solid ${C.border}`,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.textPrimary }}>{title}</div>
            </div>
            <div style={{ padding: "10px 13px" }}>
              {stats.map(({ k, v }) => (
                <div key={k} style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 6,
                  fontSize: 12,
                  lineHeight: 1.4,
                }}>
                  <div style={{ color: C.textTertiary, flexShrink: 0, minWidth: 90 }}>{k}</div>
                  <div style={{ color: C.textPrimary, fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── FOOTER NOTE ─────────────────────────────────────────────────── */}
      <div style={{
        marginTop: 32,
        paddingTop: 16,
        borderTop: `1px solid ${C.border}`,
      }}>
        <p style={{ fontSize: 11, color: C.textMuted, margin: 0 }}>
          Source: Backend_Architecture_v1.0.md · Master_Build_Plan_v1.0.md · PRD v2.0 ·
          Niger Health Facilities.gpkg inspection &nbsp;|&nbsp; FACT Foundation · June 2026
        </p>
      </div>

    </div>
  );
}
