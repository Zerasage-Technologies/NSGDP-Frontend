import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Database } from "lucide-react";
import { Container } from "@/components/layout/container";
import { DatasetCard } from "@/components/data/dataset-card";
import { getGroupBySlug, getDatasets } from "@/lib/mock";

interface GroupPageProps {
  params: Promise<{ slug: string }>;
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { slug } = await params;
  const group = await getGroupBySlug(slug);

  if (!group) {
    notFound();
  }

  // Get datasets in this group
  const { data: datasets } = await getDatasets({
    groups: [group.slug],
    pageSize: 50,
  });

  // Gradient colors (matching GroupTile)
  const GRADIENT_COLORS = [
    "from-blue-500 to-cyan-500",
    "from-green-500 to-teal-500",
    "from-purple-500 to-pink-500",
    "from-orange-500 to-red-500",
    "from-indigo-500 to-blue-500",
    "from-teal-500 to-green-500",
    "from-pink-500 to-rose-500",
    "from-amber-500 to-orange-500",
    "from-violet-500 to-purple-500",
    "from-emerald-500 to-green-500",
  ];
  const gradientIndex = parseInt(group.id.replace(/\D/g, "")) % GRADIENT_COLORS.length;
  const gradientClass = GRADIENT_COLORS[gradientIndex];

  return (
    <main className="flex-1">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/40">
        <Container size="wide" className="py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="size-4" />
            <Link href="/groups" className="hover:text-foreground">
              Topics
            </Link>
            <ChevronRight className="size-4" />
            <span className="text-foreground">{group.name}</span>
          </nav>
        </Container>
      </div>

      {/* Cover Banner */}
      <div className="relative h-48 overflow-hidden border-b">
        {group.coverImageUrl ? (
          <Image
            src={group.coverImageUrl}
            alt=""
            fill
            className="object-cover"
          />
        ) : (
          <div className={`h-full w-full bg-gradient-to-br ${gradientClass}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <Container size="wide" className="absolute inset-0 flex flex-col justify-end pb-8">
          <h1 className="text-4xl font-bold text-white">{group.name}</h1>
          {group.description && (
            <p className="mt-2 max-w-2xl text-white/90">{group.description}</p>
          )}
        </Container>
      </div>

      {/* Stats */}
      <div className="border-b bg-muted/40">
        <Container size="wide" className="py-6">
          <div className="flex items-center gap-2">
            <Database className="size-5 text-muted-foreground" />
            <span className="text-2xl font-bold">{group.datasetCount}</span>
            <span className="text-sm text-muted-foreground">
              Dataset{group.datasetCount !== 1 ? "s" : ""}
            </span>
          </div>
        </Container>
      </div>

      {/* Datasets */}
      <Container size="wide" className="py-12">
        {datasets.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No datasets available yet
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {datasets.map((dataset) => (
              <DatasetCard key={dataset.id} dataset={dataset} />
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
