**Niger State GeoHealth Data Portal**

Product Requirements Document  —  Version 2.0

Geospatial & Health Data System Strengthening Project  |  Niger State, Nigeria

| Document Owner | Project Sponsor | Primary Beneficiary |
| :---- | :---- | :---- |
| Zerasage Technologies Limited | FACT Foundation | NSPHCDA |
| **Funded by: Umbrella Fund** | **Status: DRAFT v2.0** | **Date: June 2026** |

# **1\. Executive Summary**

This document is the comprehensive Product Requirements Document (PRD) for the Niger State GeoHealth Data Portal — a state-owned, centralised geospatial and health data platform commissioned by FACT Foundation on behalf of the Niger State Primary Healthcare Development Agency (NSPHCDA), funded by the Umbrella Fund.

The PRD v2.0 supersedes PRD v1.0. It incorporates:

* Full feature mapping of the Anambra GeoHub (geohealth.anambrastate.gov.ng), the reference implementation, built by the same programme ecosystem

* Stakeholder workshop insights from the multi-group strategic alignment and use-case mapping exercises conducted in Niger State

* Gap analysis of the Niger State Open Data prototype (nsgdp.vercel.app) against PRD v1.0

* A consolidated feature roadmap across milestones M1–M4

The platform must serve as the operational intelligence layer for health planning, disease surveillance, performance accountability, and evidence-based decision-making across Niger State's 25 LGAs.

# **2\. Problem Statement**

Stakeholder workshops conducted during the inception phase produced five recurring systemic findings:

### **2.1  Weak & Fragmented Health Data Systems**

Health data in Niger State is spread across multiple departments, partner systems (DHIS2, NHMIS, programme-specific spreadsheets), and LGA-level reporting structures. Participants described poor data collection, delayed reporting, inconsistent repositories across LGAs, and weak data harmonisation as central challenges directly linked to poor decision-making and delayed outbreak response.

### **2.2  Delayed Disease Surveillance & Outbreak Response**

Participants specifically cited cholera, malaria, and diphtheria outbreaks where delayed or inaccurate data prevented timely public health response. The repository must reduce the time-to-insight from days to minutes for surveillance officers.

### **2.3  Weak M\&E and Supervision**

LGA-level monitoring is inconsistent. Supervision subcommittees exist but lack operational data tools. Ward data officers are engaged but not supported with real-time digital accountability systems.

### **2.4  Data Ownership & Governance Deficits**

Most of Niger State's health and geospatial data is currently managed by external partners rather than the state. Participants strongly asserted that data generated within the state must remain institutionally owned by NSPHCDA with state-level governance.

### **2.5  Limited Technical Capacity**

The workforce lacks GIS literacy and digital data management skills. Any platform must incorporate capacity building resources, not just tools.

# **3\. Goals**

## **3.1  Business Goals**

| ID | Goal | Rationale (Stakeholder Source) |
| :---- | :---- | :---- |
| BG-1 | Establish state-owned geospatial & health data repository | Core inception finding — no functional state-owned platform exists |
| BG-2 | Improve accessibility and discoverability | Stakeholders report hours spent locating datasets |
| BG-3 | Strengthen institutional ownership & governance | Data must stay within the state system (workshop unanimous) |
| BG-4 | Enable evidence-based planning & outbreak response | Cholera / malaria / diphtheria surveillance use-case priority |
| BG-5 | Build DHIS2 interoperability infrastructure | Explicit stakeholder requirement — DHIS2 data cleaning already active |
| BG-6 | Strengthen LGA-level M\&E and supervision | Ward data officers, state control room reactivation cited |
| BG-7 | Institutionalise geospatial capacity | Participants want GIS training as a deliverable, not just a tool |

## **3.2  Non-Goals (MVP Scope)**

The following are explicitly out of scope for the v2.0 MVP and will be considered for Phase 2:

* Predictive analytics or machine learning models

* Mobile native applications (iOS / Android)

* National-scale multi-state deployment

* Public API monetisation or open data API tier

* Automated real-time DHIS2 sync (infrastructure is built but sync is manual in MVP)

# **4\. User Personas**

| Persona | Role / Context | Primary Needs | Key Portal Use Cases |
| :---- | :---- | :---- | :---- |
| **Health Planner** | NSPHCDA / SMOH strategic staff | Validated datasets, geographic insights, historical trends | Analytics dashboard, LGA burden table, dataset downloads |
| **Disease Surveillance Officer** | Epidemic response teams in Minna and LGA levels | Real-time disease data, facility mapping, outbreak alerts | GIS Mapping (disease burden bubbles), outlier detection, AI Assistant |
| **M\&E Officer** | Programme monitoring teams | Facility performance tracking, download for analysis | Analytics dashboard, LGA burden summary, dataset export |
| **LGA Data Officer / Ward Officer** | Ward-level data entry & reporting | Easy data submission, feedback on quality | Submit Data form, approval status tracking |
| **Data Contributor** | Programme teams (NHMIS, GRID3, partners) | Structured upload, metadata guidance | Submit Data workflow with 3-step review |
| **Repository Administrator** | NSPHCDA IT / Data Governance team | Approval queue, user management, audit trails | Admin console: Review Queue, User Mgmt, Audit Logs |
| **Development Partner / NGO** | NGOs, donors, implementing partners | Validated datasets, transparency, accountability | Data Portal browse, analytics, GIS map export |
| **Researcher / Public User** | Academic or public interest user | Open datasets, trend exploration | Data Portal (public tier), Tools & Learning resources |

# **5\. Reference Site: Anambra GeoHub — Complete Feature Documentation**

*The Anambra GeoHub (geohealth.anambrastate.gov.ng) is the production reference implementation for this programme. Every feature documented below was confirmed by direct interaction with the live site and constitutes the feature specification baseline for the Niger State platform.*

## **5.1  Global Navigation & Brand Elements**

| Element | Description | Niger State Adaptation |
| :---- | :---- | :---- |
| Logo / Brand | Circular emblem \+ 'Anambra GeoHub / HEALTH DATA PORTAL' wordmark in amber/gold on white navbar | Replace with Niger State Government emblem \+ 'Niger State GeoHealth Portal / HEALTH DATA PORTAL'. Use green palette (NSPHCDA brand). |
| Top Navigation Bar | Sticky navbar: Home | About | Data Portal ▾ | Analytics | GIS Mapping ▾ | Campaigns | Tools & Learning | Log In | Sign Up (amber CTA) | Same structure. 'Sign Up' CTA in deep green. Add 'DHIS2 Sync' status indicator. |
| Data Portal Dropdown | Sub-items: View Data, Submit Data | Same |
| GIS Mapping Dropdown | Sub-items: GIS Mapping (disease burden), GIS Map (facility map) | Same — distinguish as 'Disease Burden Map' and 'Facility Map' |
| AI Assistant Widget | Floating orange bubble (bottom-right). Opens chat panel. Greeting \+ 5 quick question shortcuts. Input field \+ Send button. | Green colour. Prompt: 'Ask about Niger State health data…' Quick questions adapted to Niger State disease priorities (meningitis, cholera, malaria, diphtheria). |
| Footer | Funded By: Umbrella | Powered By: Octave. Quick Links column. Contact Info: address, email, phone, website. Social: Facebook, Twitter, LinkedIn. Copyright line. | Funded By: Umbrella Fund | Powered By: Zerasage Technologies. Contact: NSPHCDA Minna address. Same social links. |

## **5.2  Home Page (/)**

### **Hero Section**

* Full-screen interactive satellite/OpenStreetMap base map of Nigeria with Niger State highlighted

* Bold headline overlay: 'Welcome To Niger State GeoHealth Portal'

* Sub-headline: 'Harness the power of health and geospatial data to drive smarter decisions across Niger State'

* CTA button: 'Browse Repository →' (links to /dataportal)

* Map controls: Zoom \+/- (top-left). Mini-map overview panel (top-right). Population badge (e.g. 'Niger State Population: 5.9M')

### **Feature Cards (6 cards in 3-column grid)**

| Card | Content | Niger State Data |
| :---- | :---- | :---- |
| Comprehensive Data Repository | Icon: database. 'Access 25+ health datasets from DHIS2, GRID3, PHC facilities, and disease-specific units including HIV, TB, Malaria, Meningitis, and NTDs.' | Update disease list to match Niger State priorities |
| Interactive Geospatial Maps | Icon: map. 'Visualize health data across all 25 Local Government Areas with interactive mapping tools.' | 25 LGAs (not 21\) |
| Real-time Analytics | Icon: bar chart. 'Monitor disease trends, facility performance, and population health indicators with dynamic dashboards.' | Same |
| Multi-level Access | Icon: users. 'Role-based access for government officials, NGOs, development partners, and public users.' | Same |
| Secure & Compliant | Icon: shield. 'Enterprise-grade security ensuring data privacy and compliance with NDPA and health information standards.' | Same — emphasise NDPA compliance |
| QGIS Integration | Icon: lightning. 'Seamlessly integrate with QGIS and PostGIS for advanced geospatial analysis and modelling.' | Same — link to Tools & Learning |

### **Health Facilities Section**

* Section header: 'Health Facilities in Niger State / Comprehensive healthcare infrastructure serving communities'

* 3 photo cards: Primary Health Care Centers | Healthcare Professionals | Rural Health Facilities

* Each card: full-bleed photo, title, descriptive text paragraph

### **Real-World Applications Section**

* 3 application use-case cards with emoji icons: Disease Surveillance | Health Facility Planning | Population Health Analytics

* Each card: icon, title, 2-sentence description

### **CTA Section**

* Header: 'Ready to Explore Health Data?'

* Sub-text referencing thousands of health professionals and policymakers

* Button: 'Browse Repository →'

## **5.3  About Page (/about)**

### **Hero Section**

* Full-width aerial photo of Minna / Niger State as hero background (amber overlay)

* Platform description: 2-paragraph explanation of the centralised geospatial health data system

### **Mission & Vision Cards**

* Mission: 'To create a comprehensive, accessible, and secure health data ecosystem that empowers evidence-based decision making, improves health outcomes, and strengthens system integration.'

* Vision: 'To be the leading state-level health data platform in Nigeria, setting the standard for transparent, accessible, and actionable health information systems.'

### **What We Do (3 cards)**

* Data Integration: Harmonise health data from DHIS2, GRID3, PHC facilities, and disease-specific programmes into a unified, standardised repository

* Geospatial Analytics: Provide interactive mapping and spatial analysis tools to visualise health patterns, identify hotspots, and support geographic decision making

* Secure Access: Implement role-based access controls ensuring appropriate data sharing while maintaining privacy and security of sensitive health information

### **Key Partners & Stakeholders (4 partner cards)**

| Partner | Partner | Partner | Partner |
| :---- | :---- | :---- | :---- |
| NSPHCDA(Project Lead & Data Governance) | Niger State Ministry of Health(Health Data Owner) | Umbrella Fund(Sponsor) | Dev-Afrique(Technical Partner) |

Niger State addition: Add FACT Foundation as Implementation Partner card.

### **Testimonials Carousel**

* 'What Our Users Say' section with carousel of 4 user quotes

* Navigation: prev/next arrow buttons \+ dot pagination

* Each slide: quotation marks, testimonial text, name, and role of user

* Roles should represent real NSPHCDA stakeholder types: Health Planner, LGA Data Officer, Disease Surveillance Officer, M\&E Officer

### **Our Impact in Numbers (4 KPI badges)**

* Template values (to be updated with real Niger State data): Healthcare Workers | LGAs Covered (25) | Data Points | Data Accuracy %

* Each badge: large amber number, label, descriptive sub-label

### **Niger State LGAs Interactive Map**

* Embedded interactive map showing all 25 LGAs with labels and colour coding

* Data coverage indicator per LGA (percentage of datasets available)

## **5.4  Data Portal — View Data (/dataportal)**

### **Page Header**

* Icon \+ 'Data Portal' heading, sub-title: 'Comprehensive health datasets for Niger State'

### **Category Filter Tabs (4 pills)**

* 🦠  Disease Data — HIV, TB, Malaria, Meningitis, NTDs, Cholera, Diphtheria

* 🏥  Health Facilities — DHIS2, PHC Registry, facility infrastructure data

* 👥  Population — Demographics, projections, census, community survey data

* 🔍  Surveillance — NHMIS, lab results, integrated disease surveillance, IDS response

### **Search Bar**

* Text input: 'Search datasets…' with magnifying glass icon

* Real-time filter — narrows card grid as user types

### **Dataset Count**

* 'X datasets found' counter updates dynamically with active filters

### **Dataset Card Grid (3 columns)**

* Each card: Dataset title (bold), Organisation/owner (small text), Description (2 sentences), Download button (green full-width)

* Info icon (ⓘ) top-right of each card — opens Detail Modal on click

### **Dataset Detail Modal**

* Basic Information panel: Owner | Format (e.g. DHIS2, CSV, GeoJSON) | File Size

* Technical Details panel: Type (Spatial \+ Attribute or Attribute only) | Source | Data Custodian | Update Frequency | Portal source | Category

* Description section: Full narrative description

* Citation section: Italic citation string

* Key Attributes section: Each attribute shown as Field Name | Example Value | Description

* Modal close: × button top-right

### **Target Dataset Catalogue for Niger State (minimum 25 datasets for launch)**

| Dataset | Owner / Source | Format | Category | Priority |
| :---- | :---- | :---- | :---- | :---- |
| Malaria Case Surveillance | Niger State Ministry of Health / DHIS2 | DHIS2 / CSV | Disease | **P1** |
| Meningitis Case Surveillance | NSPHCDA Surveillance Unit | CSV | Disease | **P1** |
| Cholera / Diphtheria Outbreak Data | NSPHCDA / NPHCDA | CSV | Disease | **P1** |
| Routine Immunisation Coverage | NPHCDA / NSPHCDA | DHIS2 | Disease | **P1** |
| Health Facility Registry (HFR) | NPHCDA | GeoJSON | Facilities | **P1** |
| NHMIS Aggregate Data | Federal Ministry of Health | CSV | Surveillance | **P1** |
| Population Estimates & Boundaries | GRID3 Nigeria | GeoJSON / CSV | Population | **P1** |
| HIV Unit Data | Niger State Ministry of Health | CSV | Disease | **P1** |
| TB Unit Data | Niger State Ministry of Health | CSV | Disease | **P1** |
| Maternal Health Data | NSPHCDA Reproductive Health | DHIS2 | Disease | **P1** |
| Child Health & Nutrition | NSPHCDA Child Health | CSV | Disease | **P1** |
| HR Registry (HRH) | Niger State MOH HR Department | XLSX | Facilities | P2 |
| Mortality Registry | National Population Commission | CSV | Surveillance | P2 |
| NTD Unit Data | NSPHCDA NTD Unit | CSV | Disease | P2 |
| Population Projections by LGA | National Population Commission | CSV | Population | P2 |
| Drug & Commodity Stock Data | NSPHCDA Logistics | XLSX | Facilities | P2 |
| Immunisation Campaign Coverage | NPHCDA / NSPHCDA | CSV | Disease | P2 |
| Laboratory Results Data | NSPHCDA Lab Services | CSV | Surveillance | P2 |
| Referral & Patient Flow Data | NSPHCDA | CSV | Facilities | P3 |
| Disease Surveillance Integrated | NSPHCDA Surveillance Unit | CSV | Surveillance | P3 |

## **5.5  Submit Data (/submit)**

### **Page Layout (two-column)**

* Left panel: 'Dataset Information' form

* Right panel: 'Submission Requirements' \+ 3-step review process \+ 'Need Help?' contact support

### **Form Fields (all required unless marked)**

* Dataset Name\* — text input, placeholder: 'e.g. Malaria Cases Q4 2024'

* Organisation\* — text input, placeholder: 'e.g. Niger State Ministry of Health'

* Category\* — dropdown: Disease Data | Health Facilities | Population | Surveillance

* Data Format\* — dropdown: CSV | Excel | JSON | GeoJSON | Shapefile | DHIS2 Export

* Update Frequency\* — dropdown: Daily | Weekly | Monthly | Quarterly | Annually | One-time

* Description\* — multi-line textarea

* Contact Email\* — email input

* Dataset File — drag-and-drop zone OR 'Choose File' button. Supported: CSV, Excel, JSON, GeoJSON. Max 50MB.

* Submit Dataset button (green full-width)

### **Submission Requirements Panel**

* Data must be anonymised and comply with health data privacy regulations (NDPA)

* Include metadata documentation describing data structure and variables

* Ensure data quality and completeness before submission

* Provide contact information for data stewardship and updates

* Data should be relevant to Niger State health system or population

### **3-Step Review Process (numbered)**

* 1\. Initial Review — submitted data reviewed by NSPHCDA data team

* 2\. Quality Assessment — data quality and relevance evaluation

* 3\. Approval & Integration — final approval and repository integration

## **5.6  Health Analytics Dashboard (/analytics)**

### **Dashboard Header**

* Title: 'Health Analytics Dashboard'

* Sub-title: 'Real-time insights into health indicators across Niger State'

* Disease selector dropdown (top-right): options matching Niger State disease priorities

* Export button with download icon (exports dashboard data as CSV/PDF)

### **KPI Card Row (4 cards)**

| KPI Card | KPI Card | KPI Card | KPI Card |
| :---- | :---- | :---- | :---- |
| Total Cases (All Time)Large numberRed pulse icon | Health FacilitiesCount of mapped facilitiesBlue pin icon | LGAs Covered25 (Niger State)Green bar chart icon | Outlier FacilitiesCount flaggedAmber warning icon |

### **Trends Over Time Chart**

* Left chart (60% width): Line chart, x-axis: years 2013–present, y-axis: case count

* Toggle buttons: 'Trends' (annual) and 'Seasonality' (monthly breakdown)

* Legend: 'State Total' line in amber/green

* Interactive: hover shows exact figure for any data point

### **Top 10 LGAs by Total Cases Chart**

* Right chart (40% width): Horizontal bar chart

* LGA names on y-axis, case counts on x-axis

* Bars coloured in green gradient from highest to lowest

### **LGA Burden Summary Table**

* Full-width table below charts

* Columns: Rank | LGA | Total Cases | Facilities | Population | Incidence (per 1,000)

* All 25 LGAs listed with sortable columns

* Colour coding: high incidence rows highlighted in light red

### **Outlier Facilities Section**

* Header: 'Outlier Facilities — Facilities with unusually high or low case counts compared to peers in the same LGA (z-score ≥ 2.0)'

* Sub-header: 'High Outliers (N)' in red

* Table columns: Facility | LGA | Total Cases | Z-Score | Interpretation

* Interpretation colour-coded: 'Very high – investigate' in orange/red text

* Supports accountability use-case from stakeholder workshops

## **5.7  GIS Mapping — Disease Burden Map (/gis-mapping)**

### **Map Viewport**

* Full-screen interactive OpenStreetMap base (Leaflet.js)

* Clustered proportional red bubble markers sized by case count

* Zoom controls: \+ / − (top-left)

* Population badge: 'Niger State Population: 5.9M' (top-right corner)

### **Open Filters Panel (slides in from left)**

* Panel title: 'Health Metrics Map'

* Primary health metric — dropdown (all disease/metric options available in analytics)

* Compare with another metric — checkbox to enable second metric overlay

* Value Type — dropdown: Cases | Rate | Coverage %

* Number of cases filter — Min / Max numeric inputs

* Period — Year dropdown (2013–present) \+ Month dropdown (Jan–Dec)

* LGA — 'All LGAs' dropdown with all 25 Niger State LGAs

* Ward — 'All Wards' dropdown filtered by selected LGA

* Close Filters button (× icon)

### **Yearly Trend Mini-Chart (bottom-left)**

* Panel: 'Yearly cases of \[selected metric\]'

* Mini line chart: 2013–present, click any year for monthly breakdown

* 'Hide' button to collapse panel

### **Burden Summary Panel (right side)**

* Two tabs: 'Current filters' and 'Hide'

* Stats: Total cases | Facilities | LGAs | Wards

* Top 5 LGAs with case counts

* Bottom 5 LGAs with case counts

## **5.8  GIS Map — Health Facility Map (/gis-map)**

### **Map Viewport**

* Full-screen map zoomed to LGA level by default

* Blue dot markers for each mapped health facility

* Facility name tooltip on hover

* Facility popup on click: Facility Name | LGA | Ward | Facility Code (unique ID)

### **Open Filters Side Panel**

* Panel title: 'Health Facility Map'

* Stats header row: '122 Facilities | 105 Mapped' (Niger State data will differ)

* Search input: 'Search facilities…'

* Local Government Area dropdown (default: All LGAs)

* Ward dropdown (default: All Wards — filtered by LGA)

* Facility Type dropdown (default: All Types: PHC, Secondary, General Hospital, etc.)

* Reset Filters button

## **5.9  Campaigns (/campaigns)**

### **Page Header**

* Amber/green hero banner with syringe icon

* Title: 'Campaigns'

* Sub-title: 'Track vaccination campaigns across Niger State. View real-time coverage data, progress updates, and geospatial insights.'

### **Campaign Cards**

* Each card: Campaign name | Status badge (Ongoing / Completed / Planned) | Start date | Primary metric (e.g. MR Coverage) | Coverage % | Vaccinated count | Target count | Active Days | LGAs covered

* Coverage progress bar (coloured by coverage level)

* Initial priority campaigns: Measles-Rubella Integrated Campaign, IPV, OPV, Diphtheria SIA

## **5.10  Tools & Learning (/learning)**

### **Hero Carousel (2 slides)**

* Slide 1: 'Empowering Niger State Through Geospatial Learning' — 'Explore Resources' CTA

* Slide 2: Second featured resource (GIS for health use case)

* Prev/next arrows \+ dot navigation

### **Search Bar**

* 'Search tutorials, topics, or keywords…'

### **5 Tab Pills**

* Video Tutorials — Featured Playlist card (QGIS & Geospatial Analysis, 24-video YouTube playlist). Individual tutorials grid below.

* E-Books & Guides — 4 resource cards: QGIS Training Manual | WHO Geospatial Toolkit for Public Health | GRID3 Nigeria Geospatial Data Documentation | PostGIS in Action (sample chapters). Each with 'Access Resource' external link button.

* Core Tools — QGIS (Desktop GIS) \+ PostgreSQL+PostGIS (Database). Each with 'Role in Project' and 'Example Use Case' detail panels.

* Sample Data & Tutorials — downloadable sample datasets for training exercises

* Learning Path — structured progression from GIS basics to health data analysis

## **5.11  Authentication**

### **Login Page (/login)**

* Title: 'Anambra Health GeoHub — Health Data Repository — Choose your access level'

* 3 radio button access levels with icons:

  * Administrator — State Ministry of Health admin users

  * Partner Access — NGOs, Donors, Dev-Afrique & members (requires admin approval)

  * Public Access — General public with limited dataset access (pre-selected)

* CTA button: 'Continue as Public User' (changes label based on selection)

* 'Forgot your password?' link

* 'Need access? Contact: \[Authority\]'

### **Sign Up Page (/register)**

* Username input

* Access level dropdown (Public user / view-only access; elevated roles require admin approval)

* Email input

* Password \+ Confirm Password inputs

* Sign up button

* 'Already have an account? Log in' link

* Note text: 'Public accounts activated immediately. Partner and Admin requests must be approved by an administrator.'

# **6\. Prototype Gap Analysis — nsgdp.vercel.app vs PRD v1.0**

*The Vercel prototype implements a generic open data portal, not a health-specific geospatial intelligence platform. The following table maps every PRD v1.0 feature against (a) whether it was specified and (b) whether it is built.*

| Feature | In PRD v1.0 | Prototype Status | v2.0 Priority |
| :---- | :---- | :---- | :---- |
| **Authentication — Login / Logout** | ✅ Yes | ✅ Built | P1 – Must Have |
| Authentication — Password Reset | ✅ Yes | ✅ Built (Forgot Password link) | P1 – Must Have |
| Authentication — 2FA / MFA | ✅ Yes | ❌ Missing | P2 – Should Have |
| Access Level Selector on Login (3-tier radio) | Partial (RBAC spec) | ❌ Missing | P1 – Must Have |
| Role-Based Access Control (5 roles) | ✅ Yes | ⚠️ Partial — register has access level but no enforcement | P1 – Must Have |
| Dataset Management — Upload / Edit / Archive | ✅ Yes | ❌ Missing (prototype is read-only) | P1 – Must Have |
| Dataset Management — Version Tracking | ✅ Yes | ❌ Missing | P2 – Should Have |
| Metadata Management (all 8 required fields) | ✅ Yes | ⚠️ Partial — dataset cards show title/org/desc but no update frequency, methodology, citation | P1 – Must Have |
| Dataset Detail Modal with Key Attributes | Partial | ❌ Missing — no modal, cards are non-interactive beyond click-to-page | P1 – Must Have |
| Search & Discovery — Full text \+ filters | ✅ Yes | ⚠️ Partial — topic and org filters exist; no geography filter | P1 – Must Have |
| Category Filter Pills (Disease / Facilities / Population / Surveillance) | Implied | ❌ Missing — prototype uses generic 'Topics' (Agriculture, Environment, etc.) | P1 – Must Have |
| Geospatial Viewer — Interactive Map | ✅ Yes | ⚠️ Partial — Map page exists but shows only a bounding box placeholder, not real data | P1 – Must Have |
| Disease Burden Bubble Map (/gis-mapping) | Partial (generic viewer) | ❌ Missing | P1 – Must Have |
| Health Facility Point Map (/gis-map) | ✅ Yes (FR-7) | ❌ Missing | P1 – Must Have |
| Facility popup (name, LGA, Ward, code) | Implied | ❌ Missing | P1 – Must Have |
| GIS Filter Panel (metric, period, LGA, ward) | Partial | ❌ Missing | P1 – Must Have |
| Approval Workflow (Review Queue) | ✅ Yes | ❌ Missing | P1 – Must Have |
| Submit Data Form (3-step review) | ✅ Yes | ❌ Missing | P1 – Must Have |
| Audit Logging (uploads, downloads, edits) | ✅ Yes | ❌ Missing | P1 – Must Have |
| Health Analytics Dashboard | ❌ Not in v1.0 | ❌ Missing | P1 – Must Have |
| Disease Selector Dropdown (analytics) | ❌ Not in v1.0 | ❌ Missing | P1 – Must Have |
| KPI Cards (Cases / Facilities / LGAs / Outliers) | ❌ Not in v1.0 | ❌ Missing | P1 – Must Have |
| Trends Over Time \+ Seasonality Chart | ❌ Not in v1.0 | ❌ Missing | P1 – Must Have |
| Top 10 LGAs Bar Chart | ❌ Not in v1.0 | ❌ Missing | P1 – Must Have |
| LGA Burden Summary Table with Incidence | ❌ Not in v1.0 | ❌ Missing | P1 – Must Have |
| Outlier Facilities Z-Score Table | ❌ Not in v1.0 | ❌ Missing | P2 – Should Have |
| Campaigns Tracking Module | ❌ Not in v1.0 | ❌ Missing | P2 – Should Have |
| Tools & Learning Section | ❌ Not in v1.0 | ❌ Missing | P2 – Should Have |
| QGIS Tutorials (Video \+ E-Books) | ❌ Not in v1.0 | ❌ Missing | P2 – Should Have |
| AI Assistant Chatbot (floating widget) | ❌ Not in v1.0 | ❌ Missing | P2 – Should Have |
| Notifications (approved / rejected / invited) | ✅ Yes (FR-10) | ❌ Missing | P2 – Should Have |
| About Page (Mission / Vision / Partners / Testimonials) | ❌ Not in v1.0 | ❌ Missing | P2 – Should Have |
| Impact Metrics Showcase (homepage KPIs) | ❌ Not in v1.0 | ❌ Missing | P3 – Could Have |
| Admin Console (User Mgmt / Audit Logs / Review Queue) | ✅ Yes (FR-2,8,9) | ❌ Missing | P1 – Must Have |
| Dataset Download Tracking | ✅ Yes | ⚠️ Partial — download count shown but not tracked to user | P1 – Must Have |
| Health-specific branding (not generic 'Open Data Portal') | Implied | ❌ Missing — prototype is a generic CKAN-like portal | P1 – Must Have |
| Niger-State-specific datasets (only Agriculture/generic in prototype) | ✅ Yes (50+ datasets target) | ❌ Missing — prototype contains no health datasets | P1 – Must Have |

# **7\. Functional Requirements — v2.0**

## **FR-01  Authentication & Access**

| ID | Requirement | Priority | Milestone |
| :---- | :---- | :---- | :---- |
| 1.1 | Users shall be able to register with username, email, access level, and password | Must Have | M1 |
| 1.2 | Login page shall present 3-tier access level selector: Administrator | Partner Access | Public Access | Must Have | M1 |
| 1.3 | Password reset via email link | Must Have | M1 |
| 1.4 | 2FA / MFA for Administrator and Partner roles | Should Have | M2 |
| 1.5 | Public accounts activated immediately; Partner and Admin accounts pending administrator approval | Must Have | M1 |
| 1.6 | 'Remember me for 30 days' session persistence option | Should Have | M1 |

## **FR-02  Role-Based Access Control**

* Public User — browse published datasets, view analytics, use GIS map, download approved open datasets

* Registered User — all Public \+ submit datasets, track submission status, download restricted datasets

* Contributor / Organisation Admin — all Registered \+ approve datasets for own organisation, manage org users

* NSPHCDA Admin — all above \+ approve all datasets, manage all users, view audit logs, access admin console

* Super Admin (Zerasage/FACT) — full system access including configuration, technical settings

## **FR-03  Data Portal — Dataset Management**

* FR-03.1: Upload datasets in CSV, Excel, JSON, GeoJSON, Shapefile, DHIS2 export formats. Max 50MB per file.

* FR-03.2: All uploads trigger 3-step approval workflow (Initial Review → Quality Assessment → Approval & Integration)

* FR-03.3: Metadata form required on upload: title, organisation, category, format, update frequency, description, contact email, file upload

* FR-03.4: Edit, archive, and delete dataset records (permissions by role)

* FR-03.5: Version tracking — system maintains dataset versions; contributors can upload updated file as new version

* FR-03.6: Download tracking — every download event logged (user ID, dataset ID, timestamp, IP)

## **FR-04  Search & Discovery**

* FR-04.1: Full-text search bar filters dataset grid in real-time by title, description, keywords

* FR-04.2: Category filter pills: Disease Data | Health Facilities | Population | Surveillance

* FR-04.3: Filter by organisation / data source (checkbox list)

* FR-04.4: Filter by geography (LGA dropdown)

* FR-04.5: Filter by date range (last updated)

* FR-04.6: Sort: Recent | Most Downloaded | Alphabetical

* FR-04.7: Dataset count label updates dynamically with active filters

## **FR-05  Metadata & Dataset Detail**

* Required metadata fields: Dataset title | Description | Source organisation | Data custodian | Date collected | Date updated | Geography (LGA scope) | Update frequency | Category | Format | File size | Methodology | Tags | Citation | Key attributes (field name, example, description)

* Info modal (ⓘ) on each dataset card opens detailed metadata view

* All metadata must be complete before dataset is published (95% completeness target)

## **FR-06  Health Analytics Dashboard**

* FR-06.1: Disease metric selector dropdown — options: Severe Malaria Cases | Meningitis Cases | Cholera Cases | Diphtheria Cases | ANC Attendance | Delivery with SBA | Routine Immunisation | U5 Mortality | Death Cases

* FR-06.2: 4 KPI cards — Total Cases (all time) | Health Facilities | LGAs Covered (25) | Outlier Facilities

* FR-06.3: Trends Over Time line chart — yearly (Trends toggle) and monthly (Seasonality toggle), x-axis 2013–present

* FR-06.4: Top 10 LGAs horizontal bar chart — disease burden by LGA

* FR-06.5: LGA Burden Summary full table — Rank | LGA | Total Cases | Facilities | Population | Incidence per 1,000 — all 25 LGAs, sortable

* FR-06.6: Outlier Facilities section — z-score ≥ 2.0 threshold, table: Facility | LGA | Total Cases | Z-Score | Interpretation (colour-coded)

* FR-06.7: Export button — download dashboard data as CSV or PDF

## **FR-07  GIS Mapping — Disease Burden Map**

* FR-07.1: Full-screen Leaflet.js map with OpenStreetMap base tiles

* FR-07.2: Proportional bubble markers sized and coloured by disease case count

* FR-07.3: Filter panel: primary health metric selector | value type | case count range | year+month period | LGA | ward

* FR-07.4: Yearly trend mini-chart in bottom-left panel, click-to-monthly breakdown

* FR-07.5: Burden Summary right panel: Total cases | Facilities | LGAs | Wards | Top 5 LGAs | Bottom 5 LGAs

* FR-07.6: Niger State population badge top-right

* FR-07.7: Compare two metrics simultaneously (checkbox toggle)

## **FR-08  GIS Map — Health Facility Map**

* FR-08.1: Full-screen map with blue dot markers per health facility (PHC, secondary, tertiary)

* FR-08.2: Facility count stats: 'X Facilities | Y Mapped'

* FR-08.3: Facility search input, LGA dropdown, Ward dropdown, Facility Type dropdown, Reset Filters

* FR-08.4: Facility popup on click: Name | LGA | Ward | Facility Code | Facility Type

* FR-08.5: Facility name shown as map label on hover

## **FR-09  Submit Data**

* FR-09.1: Two-column layout — Dataset Information form (left) \+ Submission Requirements \+ Review steps (right)

* FR-09.2: Form fields: Dataset Name | Organisation | Category | Data Format | Update Frequency | Description | Contact Email | File upload (drag-drop or browse)

* FR-09.3: File validation: accepted formats CSV/Excel/JSON/GeoJSON, max 50MB, virus scan

* FR-09.4: On submit — system generates submission ticket, triggers notification to admin, queues for review

* FR-09.5: Contributor receives email confirmation with submission reference and expected review timeline

## **FR-10  Approval Workflow**

* FR-10.1: Admin console → Review Queue shows all pending submissions

* FR-10.2: Actions per submission: Approve | Reject | Request Changes (with comment)

* FR-10.3: Approved datasets published immediately to Data Portal

* FR-10.4: Rejected datasets notify contributor with rejection reason

* FR-10.5: All workflow actions logged in Audit Log

## **FR-11  Campaigns Module**

* FR-11.1: Campaign listing page with hero banner

* FR-11.2: Campaign cards: Name | Status badge (Ongoing/Completed/Planned) | Start date | Coverage metric | Vaccinated count | Target | Active Days | LGA count

* FR-11.3: Coverage progress bar for each campaign

* FR-11.4: Admin can create, update, and close campaign records

## **FR-12  Tools & Learning**

* FR-12.1: Hero carousel (2 slides, prev/next \+ dots)

* FR-12.2: Tutorial search bar

* FR-12.3: 5 tab navigation: Video Tutorials | E-Books & Guides | Core Tools | Sample Data & Tutorials | Learning Path

* FR-12.4: Video Tutorials: Featured Playlist card \+ Individual tutorials grid (thumbnail, title, duration, tags, 'Watch' button)

* FR-12.5: E-Books & Guides: Resource cards with title, description, page count, tags, 'Access Resource' external link

* FR-12.6: Core Tools: QGIS \+ PostgreSQL/PostGIS with Role in Project \+ Example Use Case

* FR-12.7: Learning Path: structured curriculum from GIS basics to health data analysis

## **FR-13  AI Assistant**

* FR-13.1: Floating chat bubble (bottom-right, green) on all pages

* FR-13.2: On click — chat panel opens with greeting tailored to Niger State health data

* FR-13.3: 5 quick question shortcuts pre-loaded (Niger State disease priorities)

* FR-13.4: Text input \+ Send button

* FR-13.5: AI responds to natural-language health data queries using portal data

## **FR-14  Notifications**

* FR-14.1: Email notification: Dataset submitted — confirmation to contributor

* FR-14.2: Email notification: Dataset approved — confirmation to contributor

* FR-14.3: Email notification: Dataset rejected — reason to contributor

* FR-14.4: Email notification: User account approved — to new Partner/Admin user

* FR-14.5: In-app notification bell (future milestone)

## **FR-15  Audit Logging**

* FR-15.1: Log all events: login, logout, dataset upload, dataset download, dataset edit, dataset approval/rejection, user creation, role change

* FR-15.2: Audit log viewable by NSPHCDA Admin and Super Admin only

* FR-15.3: Log fields: User ID | Action | Dataset/Resource ID | Timestamp | IP Address

* FR-15.4: Exportable as CSV

## **FR-16  Admin Console**

* FR-16.1: User Management — list all users, create, disable, change roles, view login history

* FR-16.2: Dataset Review Queue — see all pending submissions with filter by date/org/category

* FR-16.3: Audit Logs — searchable, filterable, exportable

* FR-16.4: System Statistics — total users, datasets, downloads, active sessions

# **8\. Milestones & Delivery Plan**

**Contract value: ₦7,000,000 over 3 months. Four milestones per the FACT Foundation contract.**

| Milestone | Name | Budget | Duration | Key Deliverables |
| :---- | :---- | :---- | :---- | :---- |
| **M1** | Discovery & Architecture | ₦1,750,000 | Week 1–3 | Technical architecture doc • UI/UX wireframes (all pages) • Dataset inventory (25+ datasets identified) • Data governance framework • Stakeholder sign-off on PRD v2.0 |
| **M2** | Core Platform | ₦2,000,000 | Week 4–7 | Authentication (FR-01, FR-02) • Data Portal with health-specific datasets (FR-03–05) • Submit Data workflow (FR-09) • Approval workflow (FR-10) • Audit logging (FR-15) • Admin Console (FR-16) • Notifications (FR-14) |
| **M3** | Analytics & GIS | ₦2,000,000 | Week 8–10 | Health Analytics Dashboard (FR-06) • Disease Burden GIS Map (FR-07) • Health Facility GIS Map (FR-08) • Campaigns module (FR-11) • AI Assistant widget (FR-13) |
| **M4** | Capacity & Handover | ₦1,250,000 | Week 11–12 | Tools & Learning section (FR-12) • UAT with NSPHCDA team • Bug fixes • Training for state staff (GIS \+ platform) • Documentation • Sustainability roadmap • NSPHCDA handover |

# **9\. Prototype Rebuild Task List (nsgdp.vercel.app → Full Platform)**

*Ordered by milestone and priority. Every task below represents work that is either missing or requires replacement in the current Vercel prototype.*

## **M1 Tasks — Must complete before M2 development begins**

1. Rebrand: replace 'Niger State Open Data' with 'Niger State GeoHealth Portal' identity — logo, favicon, colour palette (deep green \#1A4731), typography

2. Redesign Home page: add full-screen satellite map hero, feature card grid, health facilities section, real-world applications section, CTA section

3. Update Footer: Funded By: Umbrella Fund | Powered By: Zerasage Technologies | NSPHCDA contact details

4. Create About page: hero (Minna aerial), Mission/Vision cards, What We Do cards, Key Partners (NSPHCDA/MOH/Umbrella/Dev-Afrique/FACT), Testimonials carousel, Impact metrics, Niger State LGAs interactive map

5. Replace prototype dataset catalogue with health-specific datasets only (remove Agriculture/Tourism/generic categories)

6. Re-architect category filter pills: Disease Data | Health Facilities | Population | Surveillance (replace generic topic filters)

7. Implement Dataset Detail Modal with full metadata fields including citation, key attributes, update frequency

8. Define and implement Niger State-specific roles: Public | Registered | Contributor | NSPHCDA Admin | Super Admin

9. Update Login page: implement 3-tier access level radio selector (Administrator / Partner Access / Public Access)

## **M2 Tasks — Core Platform**

10. Build dataset upload flow with metadata form (all 15 required fields)

11. Build 3-step Approval Workflow: Review Queue → Quality Assessment → Approval/Rejection

12. Build Admin Console: User Management \+ Review Queue \+ Audit Logs

13. Implement Audit Logging for all CRUD operations and download events

14. Implement email notifications: submission confirmation | approval | rejection | account activation

15. Implement file validation: format check, size limit, virus scan placeholder

16. Build Download Tracking (log download events to database)

17. Add dataset version tracking support

18. Enable geography filter (LGA dropdown) on search

19. Implement RBAC enforcement — verify permissions on all API endpoints

20. Enable 2FA for Admin and Partner roles

## **M3 Tasks — Analytics & GIS**

21. Build Health Analytics Dashboard page: KPI cards, disease selector, Trends chart, Seasonality toggle, Top 10 LGAs bar chart, LGA Burden Summary table (all 25 LGAs), Outlier Facilities z-score table

22. Build Disease Burden GIS Mapping page: Leaflet.js full-screen, proportional bubble markers, filter panel (metric/period/LGA/ward), yearly trend mini-chart, Burden Summary panel, population badge

23. Build Health Facility GIS Map page: facility point markers, popup (name/LGA/ward/code), filter panel (search/LGA/ward/type)

24. Integrate PostGIS backend for spatial queries

25. Load Niger State LGA and Ward boundary shapefiles into PostGIS

26. Load Nigeria Health Facility Registry data for Niger State facilities

27. Build Campaigns module: listing page, campaign cards with progress bars

28. Integrate AI Assistant widget: floating bubble, chat panel, 5 Niger State quick questions, LLM API backend

29. Wire Analytics export button (CSV/PDF)

30. Load initial datasets into database: malaria, meningitis, immunisation, HFR, NHMIS

## **M4 Tasks — Capacity & Handover**

31. Build Tools & Learning page: hero carousel, search bar, 5 tabs (Video / E-Books / Core Tools / Sample Data / Learning Path)

32. Populate learning resources: QGIS video playlist, WHO toolkit, GRID3 docs, PostGIS sample chapters

33. Conduct UAT with minimum 5 NSPHCDA users across all 5 personas

34. Fix all P1 and P2 bugs identified in UAT

35. Write platform admin manual for NSPHCDA data team

36. Write user guide for LGA data officers and ward data officers

37. Deliver 2-day GIS training workshop using the Tools & Learning resources

38. Write DHIS2 integration specification for future Phase 2

39. Final deployment to production server (NSPHCDA-controlled infrastructure)

40. Handover: domain transfer, SSL setup, database access credentials, source code repository access

# **10\. Success Metrics**

| Category | Metric | Target | Measurement |
| :---- | :---- | :---- | :---- |
| **Adoption** | Datasets onboarded at launch | Minimum 25 | Platform count |
| **Adoption** | Active government users within 30 days | Minimum 20 | Login analytics |
| **Adoption** | Stakeholder satisfaction score | ≥ 80% | UAT survey |
| **Usage** | Dataset searches per month | ≥ 100 | Search logs |
| **Usage** | Successful search completion rate | ≥ 75% | Download follow-through |
| **Usage** | Average session duration | \> 5 minutes | Session analytics |
| **Data Quality** | Datasets with complete metadata | ≥ 90% | Metadata audit |
| **Data Quality** | Upload success rate | ≥ 95% | Upload error logs |
| **Governance** | Datasets routed through approval workflow | 100% | Audit log |
| **Governance** | Audit log coverage | 100% | Audit log completeness |
| **Technical** | Platform uptime | ≥ 99% | Uptime monitor |
| **Technical** | Page load time | \< 3 seconds | Core Web Vitals |
| **Technical** | Search response time | \< 5 seconds | Server logs |

# **11\. Technical Architecture**

| Layer | Technology | Notes |
| :---- | :---- | :---- |
| **Frontend** | Next.js 14 (App Router) \+ React \+ Tailwind CSS | SSR for SEO; ISR for dataset catalogue |
| **Maps** | Leaflet.js \+ OpenStreetMap tiles | Same as Anambra reference site |
| **Charts** | Recharts or Chart.js | Analytics dashboard, LGA burden charts |
| **Backend** | Node.js \+ Express (REST API) | JWT auth, role middleware |
| **Database** | PostgreSQL 15 \+ PostGIS 3 | Spatial queries, LGA/ward boundaries |
| **Cache** | Redis | Session management, query caching |
| **File Storage** | S3-compatible object storage | Dataset files, up to 50MB per upload |
| **Infrastructure** | Docker \+ Nginx reverse proxy | Containerised deployment for portability |
| **AI Assistant** | LLM API (Claude or equivalent) with RAG over portal data | Natural language health data queries |
| **Email** | SMTP / SendGrid / Mailgun | Notification emails for submissions and approvals |
| **Security** | TLS 1.3 \+ RBAC \+ bcrypt passwords \+ NDPA compliance | HTTPS enforced; audit logging on all writes |

# **12\. Risks & Mitigation**

| Risk | Description | Likelihood | Mitigation |
| :---- | :---- | :---- | :---- |
| **Data Access** | Government agencies may be slow to share DHIS2 or NHMIS data | High | Engage NSPHCDA as primary data steward from day 1\. Identify 5 priority datasets for launch. Use GRID3 open data as fallback for geospatial layers. |
| **User Adoption** | Staff may resist adopting a new platform | Medium | Embed training in M4 deliverables. Involve ward data officers and LGA staff early as beta testers. Design for low-bandwidth environments. |
| **Scope Creep** | Stakeholders may request additional features post-contract | High | Formal change control process. PRD v2.0 sign-off required before M2 begins. Phase 2 roadmap document absorbs future requests. |
| **Data Quality** | Datasets submitted may be incomplete or inconsistent | High | Metadata enforcement on upload. 3-step approval with quality assessment gate. Data validation checklist for contributors. |
| **Technical Capacity** | NSPHCDA may not have in-house capacity to maintain platform | Medium | M4 includes 2-day admin training. Comprehensive documentation. Zerasage provides 3-month post-launch support window. |
| **Security** | Health data is sensitive; breach would undermine trust | Low | TLS 1.3, bcrypt, RBAC, NDPA compliance, audit logging. No PII stored in the public layer. Regular security review. |
| **Connectivity** | Some LGAs have poor internet connectivity | High | Optimise asset sizes. Enable offline-capable caching for static pages. Document system requirements for LGA users. |

# **13\. Definition of MVP Success**

The platform is considered a successful MVP when all of the following are met:

41. NSPHCDA users can discover, preview, and download trusted health and geospatial datasets from a single, state-owned platform.

42. Data contributors (LGA officers, programme units, partners) can submit datasets through a governed 3-step approval workflow with full tracking.

43. Disease surveillance officers can visualise disease burden across all 25 Niger State LGAs using the GIS Mapping module with temporal and geographic filters.

44. The Health Analytics Dashboard provides actionable KPIs — case counts, LGA burden rankings, facility outlier alerts — for at least 3 disease priority areas.

45. The platform operates with 99% uptime, \< 3-second page loads, and 100% audit coverage during the UAT period.

46. Platform ownership and administration is transferred to NSPHCDA with trained in-house administrators and complete documentation.

47. The architecture supports DHIS2 interoperability as a Phase 2 integration path with the foundation built and documented.

# **14\. Document Sign-Off**

| Role | Name | Signature / Date |
| :---- | :---- | :---- |
| Product Manager (Zerasage) | Faith | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ |
| Technical Lead (Zerasage) |  | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ |
| Programme Lead (FACT Foundation) |  | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ |
| NSPHCDA Representative |  | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ |
| Umbrella Fund Rep |  | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ |

**END OF DOCUMENT — Niger State GeoHealth Data Portal PRD v2.0**