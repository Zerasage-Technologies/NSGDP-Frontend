"use client";

import { useOrganisations } from "@/lib/hooks/useOrganisations";
import { useCategories } from "@/lib/hooks/useCategories";
import type { Organisation } from "@/lib/api/organisations";
import type { Category } from "@/lib/api/categories";
import {
  DashboardPage,
  DashboardPageHeader,
  DashboardPageContent,
} from "@/components/layout/dashboard-page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ApiTestPage() {
  const { data: organisations, isLoading: orgsLoading, error: orgsError } = useOrganisations(1, 10);
  const { data: categories, isLoading: catsLoading, error: catsError } = useCategories();

  return (
    <DashboardPage>
      <DashboardPageHeader
        title="API Integration Test"
        description="Testing Organisations and Categories API endpoints"
      />

      <DashboardPageContent className="space-y-6">
        {/* Organisations */}
        <Card>
          <CardHeader>
            <CardTitle>Organisations API</CardTitle>
          </CardHeader>
          <CardContent>
            {orgsLoading && <p className="text-muted-foreground">Loading organisations...</p>}
            {orgsError && (
              <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
                Error: {orgsError instanceof Error ? orgsError.message : 'Failed to load organisations'}
              </div>
            )}
            {organisations && (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Total: {organisations.total} | Page: {organisations.page}/{organisations.totalPages}
                </div>
                <div className="grid gap-3">
                  {organisations.data.map((org: Organisation) => (
                    <div
                      key={org.id}
                      className="flex items-start justify-between rounded-lg border p-4"
                    >
                      <div>
                        <h3 className="font-semibold">{org.name}</h3>
                        <p className="text-sm text-muted-foreground">{org.description}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="secondary">{org.type}</Badge>
                          {org.email && (
                            <span className="text-xs text-muted-foreground">{org.email}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Categories API</CardTitle>
          </CardHeader>
          <CardContent>
            {catsLoading && <p className="text-muted-foreground">Loading categories...</p>}
            {catsError && (
              <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
                Error: {catsError instanceof Error ? catsError.message : 'Failed to load categories'}
              </div>
            )}
            {categories && (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Total: {categories.total} | Page: {categories.page}/{categories.totalPages}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {categories.data.map((cat: Category) => (
                    <div
                      key={cat.id}
                      className="flex items-start justify-between rounded-lg border p-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {cat.icon && <span>{cat.icon}</span>}
                          <h3 className="font-semibold">{cat.name}</h3>
                        </div>
                        {cat.description && (
                          <p className="mt-1 text-sm text-muted-foreground">{cat.description}</p>
                        )}
                        <div className="mt-2">
                          <Badge variant="outline">{cat.datasetCount} datasets</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DashboardPageContent>
    </DashboardPage>
  );
}
