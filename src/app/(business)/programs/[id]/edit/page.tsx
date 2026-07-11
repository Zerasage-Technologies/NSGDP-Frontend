"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgramForm, programToFormDefaults } from "@/components/programs/program-form";
import { getProgramById, updateProgram, deleteProgram } from "@/lib/mock/programs";
import { useProgramPermissions } from "@/lib/hooks/useProgramPermissions";
import { useMockSession } from "@/lib/auth/mock-session";
import type { ProgramFormData } from "@/lib/schemas/program";
import { toast } from "sonner";

export default function EditProgramPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { canEdit, canDelete } = useProgramPermissions();
  const { currentUser } = useMockSession();
  const program = getProgramById(id);

  if (!program) {
    return (
      <Container className="py-16 text-center text-muted-foreground">
        Programme not found.{" "}
        <Link href="/programs" className="text-primary hover:underline">
          Back to Programmes
        </Link>
      </Container>
    );
  }

  const allowed = canEdit(program.organisationId);

  if (!allowed) {
    return (
      <Container className="py-16 text-center space-y-4">
        <p className="text-muted-foreground">
          You do not have permission to edit this programme.
        </p>
        <Link href={`/programs/${program.id}`}>
          <Button variant="outline">View Programme</Button>
        </Link>
      </Container>
    );
  }

  const handleSubmit = async (data: ProgramFormData) => {
    updateProgram(program.id, data);
    toast.success("Programme updated");
    router.push(`/programs/${program.id}`);
  };

  const handleDelete = () => {
    if (!canDelete) return;
    if (!window.confirm(`Delete "${program.name}"? This cannot be undone.`)) return;
    deleteProgram(program.id);
    toast.success("Programme deleted");
    router.push("/programs");
  };

  return (
    <main className="flex-1">
      <Container className="py-8 max-w-2xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/programs/${program.id}`}>
              <Button variant="ghost" size="icon" aria-label="Back">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Edit Programme</h1>
              <p className="text-sm text-muted-foreground mt-1">{program.name}</p>
            </div>
          </div>
          {canDelete && (
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Programme Details</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgramForm
              defaultValues={programToFormDefaults(program)}
              onSubmit={handleSubmit}
              submitLabel="Save Changes"
              organisationIds={
                currentUser.role === "admin" ? currentUser.organisationIds : undefined
              }
            />
          </CardContent>
        </Card>
      </Container>
    </main>
  );
}
