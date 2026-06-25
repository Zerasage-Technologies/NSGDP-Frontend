"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, HelpCircle, CheckCircle2 } from "lucide-react";
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
import { mockPrograms } from "@/lib/mock";
import { toast } from "sonner";

const reviewSteps = [
  { step: 1, title: "Initial Review", desc: "Submission logged and assigned to data team within 24 hours." },
  { step: 2, title: "Quality Assessment", desc: "Metadata, format, and completeness checked against portal standards." },
  { step: 3, title: "Approval & Integration", desc: "Approved datasets published to the repository with full attribution." },
];

export default function SubmitDataPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SubmitDatasetFormData>({
    resolver: zodResolver(submitDatasetSchema),
  });

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

  return (
    <main className="flex-1">
      <div className="border-b bg-muted/40">
        <Container className="py-8">
          <h1 className="text-3xl font-bold">Submit Data</h1>
          <p className="mt-2 text-muted-foreground">
            Contribute health datasets to the NSPHCDA Data Portal
          </p>
        </Container>
      </div>

      <Container className="py-12">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Dataset Information</CardTitle>
                <CardDescription>
                  Complete all required fields. Submissions are reviewed before publication.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <div>
                    <label htmlFor="datasetName" className="mb-1.5 block text-sm font-medium">
                      Dataset Name <span className="text-destructive">*</span>
                    </label>
                    <Input id="datasetName" {...register("datasetName")} disabled={submitted} />
                    <FormError message={errors.datasetName?.message} />
                  </div>

                  <div>
                    <label htmlFor="organisation" className="mb-1.5 block text-sm font-medium">
                      Organisation <span className="text-destructive">*</span>
                    </label>
                    <Input id="organisation" {...register("organisation")} disabled={submitted} />
                    <FormError message={errors.organisation?.message} />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Category <span className="text-destructive">*</span>
                      </label>
                      <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(v) => v && field.onChange(v)}
                            disabled={submitted}
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
                      <label className="mb-1.5 block text-sm font-medium">
                        Data Format <span className="text-destructive">*</span>
                      </label>
                      <Controller
                        name="dataFormat"
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={(v) => v && field.onChange(v)}
                            disabled={submitted}
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
                    <label className="mb-1.5 block text-sm font-medium">
                      Update Frequency <span className="text-destructive">*</span>
                    </label>
                    <Controller
                      name="updateFrequency"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(v) => v && field.onChange(v)}
                          disabled={submitted}
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

                  <div>
                    <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
                      Description <span className="text-destructive">*</span>
                    </label>
                    <Textarea
                      id="description"
                      rows={4}
                      {...register("description")}
                      disabled={submitted}
                    />
                    <FormError message={errors.description?.message} />
                  </div>

                  {/* Optional program link */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">
                      Link to Program{" "}
                      <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <p className="mb-1.5 text-xs text-muted-foreground">
                      Associate this dataset with an existing program to make it discoverable from the Programs page.
                    </p>
                    <select
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                      disabled={submitted}
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
                    <label htmlFor="contactEmail" className="mb-1.5 block text-sm font-medium">
                      Contact Email <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="contactEmail"
                      type="email"
                      {...register("contactEmail")}
                      disabled={submitted}
                    />
                    <FormError message={errors.contactEmail?.message} />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Dataset File</label>
                    <p className="mb-2 text-xs text-muted-foreground">
                      CSV, Excel, JSON, or GeoJSON — max 50MB
                    </p>
                    <FileUploadArea
                      files={files}
                      onFilesChange={setFiles}
                      accept=".csv,.xlsx,.xls,.json,.geojson,.zip"
                      maxSizeMB={50}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={submitting || submitted}
                  >
                    {submitted
                      ? "Submission Pending"
                      : submitting
                        ? "Submitting…"
                        : "Submit Dataset"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Submission Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p className="flex gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                  Dataset must relate to Niger State health indicators or geospatial boundaries
                </p>
                <p className="flex gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                  Include clear metadata: source, collection date, and update frequency
                </p>
                <p className="flex gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                  Accepted formats: CSV, Excel, JSON, GeoJSON, Shapefile, DHIS2 Export
                </p>
                <p className="flex gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                  Maximum file size: 50MB per submission
                </p>
                <p className="flex gap-2">
                  <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                  No personally identifiable patient information (PII/PHI)
                </p>
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
