"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Settings, CheckCircle, X, HelpCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { NIGER_STATE_LGAS } from "@/lib/constants";
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

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedLGAs, setSelectedLGAs] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; size: number; progress: number }>
  >([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      // Simulate upload
      const newFile = { name: file.name, size: file.size, progress: 0 };
      setUploadedFiles((prev) => [...prev, newFile]);

      // Fake progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.name === file.name ? { ...f, progress: Math.min(progress, 100) } : f
          )
        );
        if (progress >= 100) clearInterval(interval);
      }, 200);
    });
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (isDraft: boolean) => {
    setUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.success(
      isDraft ? "Dataset saved as draft" : "Dataset submitted for review!"
    );
    router.push("/dashboard/my-datasets");
  };

  const canProceedToStep2 = title.trim().length > 0 && description.trim().length > 0;
  const canProceedToStep3 = uploadedFiles.length > 0;

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
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center size-12 rounded-full border-2 transition-colors ${
                      currentStep >= step.id
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground/30 text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="size-6" />
                    ) : (
                      <step.icon className="size-6" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-24 h-0.5 mx-4 transition-colors ${
                      currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="max-w-3xl mx-auto p-8">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Basic Information</h2>
                <p className="text-muted-foreground">
                  Provide essential details about your dataset
                </p>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1.5">
                  Dataset Title <span className="text-destructive">*</span>
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Niger State Health Facilities 2024"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1.5">
                  Description <span className="text-destructive">*</span>
                  <button
                    type="button"
                    className="ml-1 text-muted-foreground hover:text-foreground"
                    title="Provide a clear description of what this dataset contains"
                  >
                    <HelpCircle className="size-3 inline" />
                  </button>
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe what this dataset contains, its purpose, and how it can be used..."
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {description.length} / 500 characters
                </p>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium mb-1.5">
                  Tags (Keywords)
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    placeholder="Add tags (press Enter)"
                  />
                  <Button type="button" onClick={addTag} variant="outline">
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
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  LGA Coverage (Select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-4 rounded-lg border">
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
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceedToStep2}
                >
                  Next: Upload Files
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Upload Files */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Upload Files</h2>
                <p className="text-muted-foreground">
                  Add dataset files (CSV, XLSX, JSON, GeoJSON, etc.)
                </p>
              </div>

              {/* Drag-Drop Area */}
              <div
                className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <Upload className="size-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-1">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supported formats: CSV, XLSX, JSON, GeoJSON, Shapefile, PDF, and more
                </p>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium">Uploaded Files ({uploadedFiles.length})</h3>
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center gap-3 p-4 rounded-lg border"
                    >
                      <FileText className="size-5 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {file.progress}%
                          </span>
                        </div>
                      </div>
                      {file.progress === 100 && (
                        <button
                          type="button"
                          onClick={() => removeFile(file.name)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <X className="size-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between gap-3 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep(3)}
                  disabled={!canProceedToStep3}
                >
                  Next: Settings
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Settings */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Dataset Settings</h2>
                <p className="text-muted-foreground">
                  Configure visibility and access controls
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">
                  Visibility <span className="text-destructive">*</span>
                </label>
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
              </div>

              <div className="flex justify-between gap-3 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                <div className="flex gap-2">
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

// Helper Component
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
