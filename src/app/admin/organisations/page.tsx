"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getOrganisations } from "@/lib/mock";
import type { Organisation } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableRowSkeleton } from "@/components/feedback/skeletons";
import { toast } from "sonner";

export default function AdminOrganisationsPage() {
  const [orgs, setOrgs] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [acronym, setAcronym] = useState("");
  const [sector, setSector] = useState("");

  useEffect(() => {
    getOrganisations().then((data) => {
      setOrgs(data);
      setLoading(false);
    });
  }, []);

  const addOrg = () => {
    if (!name.trim()) return;
    const newOrg: Organisation = {
      id: `org-new-${Date.now()}`,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      acronym,
      sector: sector || "Other",
      datasetCount: 0,
    };
    setOrgs((prev) => [...prev, newOrg]);
    toast.success(`Organisation "${name}" created`);
    setModalOpen(false);
    setName("");
    setAcronym("");
    setSector("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Organisation Management</h1>
          <p className="text-muted-foreground mt-1">{orgs.length} organisations</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="size-4" />
          Add New Org
        </Button>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Acronym</th>
              <th className="px-4 py-3 font-medium">Sector</th>
              <th className="px-4 py-3 font-medium">Datasets</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(5)].map((_, i) => <TableRowSkeleton key={i} cols={5} />)
              : orgs.map((o) => (
                  <tr key={o.id} className="border-b">
                    <td className="px-4 py-3 font-medium">{o.name}</td>
                    <td className="px-4 py-3">{o.acronym ?? "—"}</td>
                    <td className="px-4 py-3">{o.sector}</td>
                    <td className="px-4 py-3">{o.datasetCount}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => toast.info("Edit modal (mock)")}>Edit</Button>
                        <Button size="sm" variant="outline" onClick={() => toast.warning(`${o.name} disabled (mock)`)}>Disable</Button>
                      </div>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Organisation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Organisation name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Acronym (optional)" value={acronym} onChange={(e) => setAcronym(e.target.value)} />
            <Textarea placeholder="Sector" value={sector} onChange={(e) => setSector(e.target.value)} rows={2} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={addOrg}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
