"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getGroups } from "@/lib/mock";
import type { Group } from "@/types";
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

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    getGroups().then((data) => {
      setGroups(data);
      setLoading(false);
    });
  }, []);

  const addGroup = () => {
    if (!name.trim()) return;
    setGroups((prev) => [
      ...prev,
      {
        id: `grp-new-${Date.now()}`,
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        description,
        datasetCount: 0,
      },
    ]);
    toast.success(`Group "${name}" created`);
    setModalOpen(false);
    setName("");
    setDescription("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Group Management</h1>
          <p className="text-muted-foreground mt-1">{groups.length} topic groups</p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="size-4" />
          Add New Group
        </Button>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Datasets</th>
              <th className="px-4 py-3 font-medium">Cover</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(5)].map((_, i) => <TableRowSkeleton key={i} cols={4} />)
              : groups.map((g) => (
                  <tr key={g.id} className="border-b">
                    <td className="px-4 py-3 font-medium">{g.name}</td>
                    <td className="px-4 py-3">{g.datasetCount}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {g.coverImageUrl ? "Yes" : "Placeholder"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => toast.info("Edit (mock)")}>Edit</Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setGroups((prev) => prev.filter((x) => x.id !== g.id));
                            toast.success(`"${g.name}" deleted`);
                          }}
                        >
                          Delete
                        </Button>
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
            <DialogTitle>Add Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} />
            <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={addGroup}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
