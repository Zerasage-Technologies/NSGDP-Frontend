"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Settings, X } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Stepper } from "@/components/forms/stepper";
import { FileUploadArea, type UploadedFile } from "@/components/forms/file-upload-area";
import { FieldLabelTooltip } from "@/components/forms/field-label-tooltip";
import { FormError } from "@/components/forms/form-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { NIGER_STATE_LGAS } from "@/lib/constants/core";
import { UPLOAD_FIELD_TOOLTIPS } from "@/lib/constants/upload-tooltips";
import { useDraftAutoSave } from "@/lib/hooks/useDraftAutoSave";
import {
  uploadStep1Schema,
  uploadStep2Schema,
  uploadStep3Schema,
} from "@/lib/schemas/auth";
import type { Visibility } from "@/types";

const steps = [
  { id: 1, name: "Basic Info", icon: FileText },
  { id: 2, name: "Upload Files", icon: Upload },
  { id: 3, name: "Settings", icon: Settings },
];

export default function UploadDatasetPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [stepErrors, setStepErrors] = useState<Record<string, string>>({});

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedLGAs, setSelectedLGAs] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useDraftAutoSave(
    Boolean(title || description || uploadedFiles.length > 0),
    [title, description, uploadedFiles.length]
  );

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const validateStep1 = () => {
    const result = uploadStep1Schema.safeParse({ title, description, tags });
    const lgaResult = uploadStep2Schema.safeParse({ lgas: selectedLGAs });
    const errors: Record<string, string> = {};
    if (!result.success) {
      result.error.issues.forEach((i) => {
        errors[i.path[0] as string] = i.message;
      });
    }
    if (!lgaResult.success) {
      lgaResult.error.issues.forEach((i) => {
        errors[i.path[0] as string] = i.message;
      });
    }
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    if (uploadedFiles.length === 0) {
      setStepErrors({ files: "Upload at least one file" });
      return false;
    }
    setStepErrors({});
    return true;
  };

  const validateStep3 = () => {
    const result = uploadStep3Schema.safeParse({ visibility });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        errors[i.path[0] as string] = i.message;
      });
      setStepErrors(errors);
      return false;
    }
    setStepErrors({});
    return true;
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!validateStep1() || !validateStep2() || !validateStep3()) return;
    setUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success(isDraft ? "Dataset saved as draft" : "Dataset submitted for review!");
    router.push("/dashboard/my-datasets");
  };

  return (
    <main className="flex-1 bg-muted/40">
      <div className="border-b bg-background">
        <Container size="wide" className="py-8">
          <h1 className="text-3xl font-bold">Upload New Dataset</h1>
          <p className="mt-2 text-muted-foreground">
            Share your data with the Niger State community
          </p>
        </Container>
      </div>

      <Container size="wide" className="py-8">
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={(step) => step < currentStep && setCurrentStep(step)}
          className="mb-8"
        />

        <Card className="max-w-3xl mx-auto p-4 sm:p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
                <p className="text-muted-foreground">
                  Provide essential details about your dataset
                </p>
              </div>

              <div>
                <FieldLabelTooltip
                  htmlFor="title"
                  label="Dataset Title"
                  required
                  tooltip={UPLOAD_FIELD_TOOLTIPS.title}
                />
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Niger State Health Facilities 2024"
                />
                <FormError message={stepErrors.title} />
              </div>

              <div>
                <FieldLabelTooltip
                  htmlFor="description"
                  label="Description"
                  required
                  tooltip={UPLOAD_FIELD_TOOLTIPS.description}
                />
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe what this dataset contains..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {description.length} / 500 characters
                </p>
                <FormError message={stepErrors.description} />
              </div>

              <div>
                <FieldLabelTooltip
                  htmlFor="tags"
                  label="Tags (Keywords)"
                  tooltip={UPLOAD_FIELD_TOOLTIPS.tags}
                />
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Add tags (press Enter)"
                  />
                  <Button type="button" onClick={addTag} variant="outline" className="shrink-0">
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-primary/80"
                          aria-label={`Remove tag ${tag}`}
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <FieldLabelTooltip label="LGA Coverage" tooltip={UPLOAD_FIELD_TOOLTIPS.lgas} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-4 rounded-lg border">
                  {NIGER_STATE_LGAS.map((lga) => (
                    <label key={lga} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedLGAs.includes(lga)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLGAs([...selectedLGAs, lga]);
                          } else {
                            setSelectedLGAs(selectedLGAs.filter((l) => l !== lga));
                          }
                        }}
                        className="rounded"
                      />
                      {lga}
                    </label>
                  ))}
                </div>
                <FormError message={stepErrors.lgas} />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  onClick={() => validateStep1() && setCurrentStep(2)}
                >
                  Next: Upload Files
                </Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Upload Files</h2>
                <p className="text-muted-foreground">{UPLOAD_FIELD_TOOLTIPS.files}</p>
              </div>

              <FileUploadArea files={uploadedFiles} onFilesChange={setUploadedFiles} />
              <FormError message={stepErrors.files} />

              <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button onClick={() => validateStep2() && setCurrentStep(3)}>
                  Next: Settings
                </Button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Dataset Settings</h2>
                <p className="text-muted-foreground">
                  Configure visibility and access controls
                </p>
              </div>

              <div>
                <FieldLabelTooltip
                  label="Visibility"
                  required
                  tooltip={UPLOAD_FIELD_TOOLTIPS.visibility}
                />
                <div className="grid gap-3">
                  <VisibilityOption
                    value="public"
                    selected={visibility === "public"}
                    onSelect={() => setVisibility("public")}
                    title="Public"
                    description="Anyone can view and download this dataset"
                  />
                  <VisibilityOption
                    value="restricted"
                    selected={visibility === "restricted"}
                    onSelect={() => setVisibility("restricted")}
                    title="Restricted"
                    description="Users must request access to download"
                  />
                  <VisibilityOption
                    value="private"
                    selected={visibility === "private"}
                    onSelect={() => setVisibility("private")}
                    title="Private"
                    description="Only you and your organization can access"
                  />
                </div>
                <FormError message={stepErrors.visibility} />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleSubmit(true)}
                    disabled={uploading}
                  >
                    Save as Draft
                  </Button>
                  <Button onClick={() => handleSubmit(false)} disabled={uploading}>
                    {uploading ? "Submitting..." : "Submit for Review"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </Container>
    </main>
  );
}

function VisibilityOption({
  selected,
  onSelect,
  title,
  description,
}: {
  value: string;
  selected: boolean;
  onSelect: () => void;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`p-4 rounded-lg border-2 text-left transition-colors ${
        selected
          ? "border-primary bg-primary/5"
          : "border-muted hover:border-muted-foreground/30"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
            selected ? "border-primary" : "border-muted-foreground/30"
          }`}
          aria-hidden
        >
          {selected && <div className="size-2.5 rounded-full bg-primary" />}
        </div>
        <div>
          <p className="font-medium mb-1">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  );
}
