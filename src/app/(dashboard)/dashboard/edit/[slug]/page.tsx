"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, Settings, CheckCircle, X, HelpCircle, Loader2 } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { getDatasets } from "@/lib/mock";
import { NIGER_STATE_LGAS } from "@/lib/constants";
import type { Dataset, Visibility } from "@/types";

const steps = [
  { id: 1, name: "Basic Info", icon: FileText },
  { id: 2, name: "Manage Files", icon: Upload },
  { id: 3, name: "Settings", icon: Settings },
];

export default function EditDatasetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedLGAs, setSelectedLGAs] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [existingFiles, setExistingFiles] = useState<Array<{ name: string; size: number }>>([]);

  useEffect(() => {
    const loadDataset = async () => {
      setLoading(true);
      const result = await getDatasets({});
      const found = result.data.find((d) => d.slug === resolvedParams.slug);
      
      if (found) {
        setDataset(found);
        setTitle(found.title);
        setDescription(found.description || "");
        setTags(found.groups.map((g) => g.name));
        setSelectedLGAs(found.lgaCoverage);
        setVisibility(found.visibility);
        setExistingFiles(
          found.resources?.map((r) => ({ name: r.name, size: r.sizeBytes })) || []
        );
      } else {
        toast.error("Dataset not found");
        router.push("/dashboard/my-datasets");
      }
      
      setLoading(false);
    };

    loadDataset();
  }, [resolvedParams.slug, router]);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const removeFile = (fileName: string) => {
    setExistingFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  const handleSave = async (isDraft: boolean) => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success(isDraft ? "Changes saved as draft" : "Dataset updated successfully!");
    router.push("/dashboard/my-datasets");
  };

  if (loading) {
    return (
      <main className="flex-1 bg-muted/40">
        <Container className="py-12 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="size-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dataset...</p>
          </div>
        </Container>
      </main>
    );
  }

  if (!dataset) {
    return null;
  }

  return (
    <main className="flex-1 bg-muted/40">
      <div className="border-b bg-background">
        <Container size="wide" className="py-8">
          <h1 className="text-3xl font-bold">Edit Dataset</h1>
          <p className="mt-2 text-muted-foreground">{dataset.title}</p>
        </Container>
      </div>

      <Container size="wide" className="py-8">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex items-center justify-center size-12 rounded-full border-2 transition-colors ${
                      currentStep >= step.id
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground/30 text-muted-foreground hover:border-muted-foreground/50"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="size-6" />
                    ) : (
                      <step.icon className="size-6" />
                    )}
                  </button>
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
                  Update essential details about your dataset
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
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1.5">
                  Description <span className="text-destructive">*</span>
                  <button
                    type="button"
                    className="ml-1 text-muted-foreground hover:text-foreground"
                    title="Provide a clear description"
                  >
                    <HelpCircle className="size-3 inline" />
                  </button>
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
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
                    placeholder="Add tags"
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
                <label className="block text-sm font-medium mb-2">LGA Coverage</label>
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
                <Button onClick={() => setCurrentStep(2)}>Next: Manage Files</Button>
              </div>
            </div>
          )}

          {/* Step 2: Manage Files */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Manage Files</h2>
                <p className="text-muted-foreground">
                  Add, remove, or replace dataset files
                </p>
              </div>

              {/* Existing Files */}
              {existingFiles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium">Current Files ({existingFiles.length})</h3>
                  {existingFiles.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center gap-3 p-4 rounded-lg border"
                    >
                      <FileText className="size-5 text-muted-foreground shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(file.name)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <X className="size-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload New Files */}
              <div
                className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <Upload className="size-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium mb-1">Add more files</p>
                <p className="text-sm text-muted-foreground">
                  Click to browse or drag and drop
                </p>
                <input id="file-input" type="file" multiple className="hidden" />
              </div>

              <div className="flex justify-between gap-3 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setCurrentStep(3)}>Next: Settings</Button>
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
                  {(["public", "restricted", "private"] as Visibility[]).map((vis) => (
                    <button
                      key={vis}
                      type="button"
                      onClick={() => setVisibility(vis)}
                      className={`p-4 rounded-lg border-2 text-left transition-colors ${
                        visibility === vis
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-muted-foreground/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                            visibility === vis ? "border-primary" : "border-muted-foreground/30"
                          }`}
                        >
                          {visibility === vis && (
                            <div className="size-2.5 rounded-full bg-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium mb-1 capitalize">{vis}</p>
                          <p className="text-sm text-muted-foreground">
                            {vis === "public" && "Anyone can view and download"}
                            {vis === "restricted" && "Users must request access"}
                            {vis === "private" && "Only you and your organization"}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleSave(true)}
                    disabled={saving}
                  >
                    Save as Draft
                  </Button>
                  <Button onClick={() => handleSave(false)} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
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
