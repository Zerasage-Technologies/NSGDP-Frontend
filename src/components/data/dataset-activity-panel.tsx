"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export function DatasetActivityPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Views & Downloads</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
          <BarChart3 className="size-12 mb-3 opacity-50" />
          <p className="text-sm">Activity tracking coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
}
