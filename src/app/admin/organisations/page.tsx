"use client";

import { useEffect, useState } from "react";
import { Plus, FileCheck } from "lucide-react";
import { getOrganisations } from "@/lib/mock";
import type { Organisation } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableRowSkeleton } from "@/components/feedback/skeletons";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { statusPill } from "@/lib/constants/status-surfaces";

const AGREEMENT_STYLES = {
  active: statusPill.emerald,
  pending: statusPill.amber,
  expired: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300",
  none: "bg-muted text-muted-foreground",
};

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
      dataSharingAgreement: { status: "pending", contactName: "Pending assignment" },
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
          <p className="text-muted-foreground mt-1">
            {orgs.length} organisations · track data-sharing agreements for partner access
          </p>
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
              <th className="px-4 py-3 font-medium">Data-Sharing Agreement</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(5)].map((_, i) => <TableRowSkeleton key={i} cols={6} />)
              : orgs.map((o) => {
                  const agreement = o.dataSharingAgreement;
                  const status = agreement?.status ?? "none";
                  return (
                    <tr key={o.id} className="border-b hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{o.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{o.acronym ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{o.sector}</td>
                      <td className="px-4 py-3">{o.datasetCount}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className={cn("border-0 capitalize text-xs", AGREEMENT_STYLES[status])}>
                          <FileCheck className="size-3 mr-1" />
                          {status}
                        </Badge>
                        {agreement?.expiryDate && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Expires {new Date(agreement.expiryDate).toLocaleDateString()}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline" onClick={() => toast.success(`Agreement details for ${o.name} (mock)`)}>
                          View Agreement
                        </Button>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Organisation</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Organisation name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Acronym" value={acronym} onChange={(e) => setAcronym(e.target.value)} />
            <Input placeholder="Sector" value={sector} onChange={(e) => setSector(e.target.value)} />
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
