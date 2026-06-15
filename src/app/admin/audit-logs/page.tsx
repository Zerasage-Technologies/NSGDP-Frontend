"use client";

import { useEffect, useState } from "react";
import { Download, Search } from "lucide-react";
import { getAuditLog } from "@/lib/mock";
import type { AuditLogEntry, AuditAction } from "@/types/admin";
import { Pagination } from "@/components/data/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableRowSkeleton } from "@/components/feedback/skeletons";
import { toast } from "sonner";

export default function AdminAuditLogsPage() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [action, setAction] = useState<string>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    getAuditLog({
      action: action !== "all" ? (action as AuditAction) : undefined,
      query,
      page,
      pageSize,
    }).then((result) => {
      setEntries(result.data);
      setTotal(result.meta.total);
      setTotalPages(result.meta.totalPages);
      setLoading(false);
    });
  }, [action, query, page, pageSize]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Audit Log</h1>
          <p className="text-muted-foreground mt-1">Immutable record of platform actions</p>
        </div>
        <Button variant="outline" onClick={() => toast.success("CSV export started (mock)")}>
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search user or resource…"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <Select value={action} onValueChange={(v) => { if (v) { setAction(v); setPage(1); } }}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Action" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            <SelectItem value="login">Login</SelectItem>
            <SelectItem value="upload">Upload</SelectItem>
            <SelectItem value="download">Download</SelectItem>
            <SelectItem value="approve">Approve</SelectItem>
            <SelectItem value="reject">Reject</SelectItem>
            <SelectItem value="role_change">Role Change</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50 text-left">
              <th className="px-4 py-3 font-medium">Timestamp</th>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Resource</th>
              <th className="px-4 py-3 font-medium">IP</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? [...Array(5)].map((_, i) => <TableRowSkeleton key={i} cols={5} />)
              : entries.map((e) => (
                  <tr key={e.id} className="border-b font-mono text-xs">
                    <td className="px-4 py-3">{new Date(e.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3">{e.userName}</td>
                    <td className="px-4 py-3 capitalize">{e.action.replace("_", " ")}</td>
                    <td className="px-4 py-3">{e.resource}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.ipAddress}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={Math.max(1, totalPages)}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
      />
    </div>
  );
}
