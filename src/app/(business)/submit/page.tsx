"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, HelpCircle, CheckCircle2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormError } from "@/components/forms/form-error";
import { FileUploadArea, type UploadedFile } from "@/components/forms/file-upload-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitDatasetSchema, type SubmitDatasetFormData } from "@/lib/schemas/submit";
import { UPLOAD_FIELD_TOOLTIPS } from "@/lib/constants/upload-tooltips";
import { mockPrograms } from "@/lib/mock";
import { toast } from "sonner";

const reviewSteps = [
  { step: 1, title: "Initial Review", desc: "Submission logged and assigned to data team within 24 hours." },
  { step: 2, title: "Quality Assessment", desc: "Metadata, format, and completeness checked against portal standards." },
  { step: 3, title: "Approval & Integration", desc: "Approved datasets published to the repository with full attribution." },
];

function FieldLabel({
  htmlFor,
  label,
  required,
  tip,
  hint,
}: {
  htmlFor?: string;
  label: string;
  required?: boolean;
  tip?: string;
  hint?: string;
}) {
  return (
    <div className="mb-1.5">
      <label htmlFor={htmlFor} className="flex items-center gap-1.5 text-sm font-medium">
        {label}
        {required && <span className="text-destructive">*</span>}
        {tip && (
          <TooltipProvider delay={200}>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="size-3.5 text-muted-foreground hover:text-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-60 text-xs">
                {tip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </label>
      {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
    </div>
  );
}

export default function SubmitDataPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<SubmitDatasetFormData>({
    resolver: zodResolver(submitDatasetSchema),
    defaultValues: {
      datasetName: "",
      organisation: "",
      responsibleDept: "",
      contactPerson: "",
      contactEmail: "",
      geographicCoverage: "",
      reportingPeriod: "",
      description: "",
      tags: "",
    },
  });

  const watched = watch();
  const METADATA_FIELDS: (keyof SubmitDatasetFormData)[] = [
    "datasetName", "organisation", "responsibleDept", "contactPerson", "contactEmail",
    "geographicCoverage", "reportingPeriod", "category", "dataFormat", "updateFrequency",
    "dataLicense", "description",
  ];
  const filledCount = METADATA_FIELDS.filter((f) => {
    const v = watched[f];
    return typeof v === "string" ? v.trim().length > 0 : !!v;
  }).length;
  const completenessScore = Math.round((filledCount / METADATA_FIELDS.length) * 100);
  const canSubmit = completenessScore === 100 && files.length > 0;

  const onSubmit = async () => {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const ref = `#SUB-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    toast.success(
      `Submission received. Reference: ${ref}. You will be notified within 3–5 working days.`
    );
    setSubmitted(true);
    setSubmitting(false);
  };

  const dis = submitted;

  return (
    <main className="flex-1">
      <div className="border-b bg-muted/40">
        <Container className="py-8">
          <h1 className="text-3xl font-bold">Submit Dataset</h1>
          <p className="mt-2 text-muted-foreground">
            Contribute health datasets to the NSPHCDA Data Portal
          </p>
        </Container>
      </div>

      <Container className="py-12">
        <div className="grid gap-8 lg:grid-cols-5">

          {/* ── Form ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Dataset Information</CardTitle>
                <CardDescription>
                  All fields marked <span className="text-destructive font-semibold">*</span> are required.
                  Complete metadata ensures faster review and better discoverability.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

                  {/* Section header */}
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1">
                    Identification
                  </p>

                  <div>
                    <FieldLabel
                      htmlFor="datasetName"
                      label="Dataset Name"
                      required
                      tip={UPLOAD_FIELD_TOOLTIPS.datasetName}
                      hint="E.g. 'Niger State Malaria Burden by LGA, 2024'"
                    />
                    <Input id="datasetName" {...register("datasetName")} disabled={dis} />
                    <FormError message={errors.datasetName?.message} />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <FieldLabel
                        htmlFor="organisation"
                        label="Organisation"
                        required
                        tip={UPLOAD_FIELD_TOOLTIPS.organisation}
                        hint="Your agency's official name"
                      />
                      <Input id="organisation" {...register("organisation")} disabled={dis} />
                      <FormError message={errors.organisation?.message} />
                    </div>
                    <div>
                      <FieldLabel
                        htmlFor="responsibleDept"
                        label="Responsible Department"
                        required
                        tip={UPLOAD_FIELD_TOOLTIPS.responsibleDept}
                        hint="E.g. DPRS, Surveillance Unit"
                      />
                      <Input id="responsibleDept" {...register("responsibleDept")} disabled={dis} />
                      <FormError message={errors.responsibleDept?.message} />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <FieldLabel
                        htmlFor="contactPerson"
                        label="Contact Person"
                        required
                        tip={UPLOAD_FIELD_TOOLTIPS.contactPerson}
                        hint="Name of the data focal person"
                      />
                      <Input id="contactPerson" {...register("contactPerson")} disabled={dis} />
                      <FormError message={errors.contactPerson?.message} />
                    </div>
                    <div>
                      <FieldLabel
                        htmlFor="contactEmail"
                        label="Contact Email"
                        required
                        tip="Email address for dataset enquiries"
                      />
                      <Input
                        id="contactEmail"
                        type="email"
                        {...register("contactEmail")}
                        disabled={dis}
                      />
                      <FormError message={errors.contactEmail?.message} />
                    </div>
                  </div>

                  {/* Section header */}
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1 pt-2">
                    Coverage & Period
                  </p>

                  <div>
                    <FieldLabel
                      htmlFor="geographicCoverage"
                      label="Geographic Coverage"
                      required
                      tip={UPLOAD_FIELD_TOOLTIPS.geographicCoverage}
                      hint="E.g. 'All 25 LGAs, Niger State' or specific LGA names"
                    />
                    <Input id="geographicCoverage" {...register("geographicCoverage")} disabled={dis} />
                    <FormError message={errors.geographicCoverage?.message} />
                  </div>

                  <div>
                    <FieldLabel
                      htmlFor="reportingPeriod"
                      label="Reporting Period"
                      required
                      tip={UPLOAD_FIELD_TOOLTIPS.reportingPeriod}
                      hint="E.g. 'January – December 2024' or 'Q4 2024'"
                    />
                    <Input id="reportingPeriod" {...register("reportingPeriod")} disabled={dis} />
                    <FormError message={errors.reportingPeriod?.message} />
                  </div>

                  {/* Section header */}
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1 pt-2">
                    Technical Details
                  </p>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <FieldLabel
                        label="Category"
                        required
                        tip={UPLOAD_FIELD_TOOLTIPS.category}
                      />
                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value ?? ""}
                            onValueChange={(v) => v && field.onChange(v)}
                            disabled={dis}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Disease Data">Disease Data</SelectItem>
                              <SelectItem value="Health Facilities">Health Facilities</SelectItem>
                              <SelectItem value="Population">Population</SelectItem>
                              <SelectItem value="Surveillance">Surveillance</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <FormError message={errors.category?.message} />
                    </div>

                    <div>
                      <FieldLabel
                        label="Data Format"
                        required
                        tip={UPLOAD_FIELD_TOOLTIPS.dataFormat}
                      />
                      <Controller
                        name="dataFormat"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value ?? ""}
                            onValueChange={(v) => v && field.onChange(v)}
                            disabled={dis}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CSV">CSV</SelectItem>
                              <SelectItem value="Excel">Excel</SelectItem>
                              <SelectItem value="JSON">JSON</SelectItem>
                              <SelectItem value="GeoJSON">GeoJSON</SelectItem>
                              <SelectItem value="Shapefile">Shapefile</SelectItem>
                              <SelectItem value="DHIS2 Export">DHIS2 Export</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <FormError message={errors.dataFormat?.message} />
                    </div>
                  </div>

                  <div>
                    <FieldLabel
                      label="Update Frequency"
                      required
                      tip={UPLOAD_FIELD_TOOLTIPS.updateFrequency}
                    />
                    <Controller
                      name="updateFrequency"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value ?? ""}
                          onValueChange={(v) => v && field.onChange(v)}
                          disabled={dis}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Daily">Daily</SelectItem>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                            <SelectItem value="Annually">Annually</SelectItem>
                            <SelectItem value="One-time">One-time</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormError message={errors.updateFrequency?.message} />
                  </div>

                  {/* Section header */}
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1 pt-2">
                    Governance
                  </p>

                  <div>
                    <FieldLabel
                      label="Data License"
                      required
                      tip={UPLOAD_FIELD_TOOLTIPS.dataLicense}
                      hint="Determines how others may use this dataset"
                    />
                    <Controller
                      name="dataLicense"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value ?? ""}
                          onValueChange={(v) => v && field.onChange(v)}
                          disabled={dis}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select license" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CC BY 4.0">CC BY 4.0 (Open, attribution required)</SelectItem>
                            <SelectItem value="CC BY-NC 4.0">CC BY-NC 4.0 (Non-commercial only)</SelectItem>
                            <SelectItem value="Open Government License">Open Government License</SelectItem>
                            <SelectItem value="Restricted Use">Restricted Use (approval needed)</SelectItem>
                            <SelectItem value="Other">Other — describe in notes</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormError message={errors.dataLicense?.message} />
                  </div>

                  {/* Section header */}
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1 pt-2">
                    Description & Discovery
                  </p>

                  <div>
                    <FieldLabel
                      htmlFor="description"
                      label="Description"
                      required
                      tip={UPLOAD_FIELD_TOOLTIPS.description}
                      hint="Include: what, who collected it, how, time period, and intended use"
                    />
                    <Textarea
                      id="description"
                      rows={4}
                      {...register("description")}
                      disabled={dis}
                      placeholder="E.g. This dataset contains malaria case counts aggregated by LGA from the DHIS2 HMIS system, covering January to December 2024. It includes confirmed and suspected cases from all 25 LGAs of Niger State..."
                    />
                    <FormError message={errors.description?.message} />
                  </div>

                  <div>
                    <FieldLabel
                      htmlFor="tags"
                      label="Keywords / Tags"
                      tip={UPLOAD_FIELD_TOOLTIPS.tags}
                      hint="Comma-separated — E.g. malaria, LGA, quarterly, DHIS2, 2024"
                    />
                    <Input
                      id="tags"
                      {...register("tags")}
                      disabled={dis}
                      placeholder="malaria, LGA, quarterly, 2024"
                    />
                  </div>

                  {/* Optional program link */}
                  <div>
                    <FieldLabel
                      label="Link to Programme"
                      tip="Associate this dataset with an existing programme to make it discoverable from the Programmes page."
                      hint="Optional"
                    />
                    <select
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                      disabled={dis}
                      defaultValue=""
                    >
                      <option value="">— None —</option>
                      {mockPrograms
                        .filter((p) => p.status !== "completed")
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <FieldLabel
                      label="Dataset File"
                      tip={UPLOAD_FIELD_TOOLTIPS.files}
                      hint="CSV, Excel, JSON, GeoJSON, Shapefile — max 50 MB"
                    />
                    <FileUploadArea
                      files={files}
                      onFilesChange={setFiles}
                      accept=".csv,.xlsx,.xls,.json,.geojson,.zip"
                      maxSizeMB={50}
                    />
                  </div>

                  {/* Metadata completeness score */}
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Metadata Completeness</span>
                      <span className={completenessScore === 100 ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                        {completenessScore}%
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${completenessScore === 100 ? "bg-emerald-500" : "bg-amber-500"}`}
                        style={{ width: `${completenessScore}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {filledCount} of {METADATA_FIELDS.length} required fields completed.
                      {completenessScore < 100 && " Complete all fields before submitting."}
                      {completenessScore === 100 && files.length === 0 && " Attach a dataset file to submit."}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={submitting || submitted || !canSubmit}
                  >
                    {submitted
                      ? "Submission Pending Review"
                      : submitting
                        ? "Submitting…"
                        : "Submit Dataset"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* ── Sidebar ──────────────────────────────────────────────── */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Submission Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {[
                  "Dataset must relate to Niger State health indicators or geospatial boundaries",
                  "All 14 metadata fields must be completed before review begins",
                  "Include clear methodology: source system, collection date, and update frequency",
                  "Accepted formats: CSV, Excel, JSON, GeoJSON, Shapefile, DHIS2 Export",
                  "Maximum file size: 50 MB per submission",
                  "No personally identifiable patient information (PII/PHI)",
                  "Data must be licensed — select a license that matches your data governance policy",
                ].map((req) => (
                  <p key={req} className="flex gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                    {req}
                  </p>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3-Step Review Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviewSteps.map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {item.step}
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="size-5" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Contact the NSPHCDA data team for submission guidance or technical support.
                </p>
                <a
                  href="mailto:data@nsphcda.ng"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <Mail className="size-4" />
                  data@nsphcda.ng
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </main>
  );
}
