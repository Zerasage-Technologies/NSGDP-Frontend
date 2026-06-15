import { Container } from "@/components/layout/container";
import { GroupTileSkeleton } from "@/components/feedback/skeletons";

export default function GroupsLoading() {
  return (
    <main className="flex-1">
      <div className="border-b bg-muted/40">
        <Container size="wide" className="py-8">
          <div className="h-9 w-32 bg-muted animate-pulse rounded" />
          <div className="mt-2 h-5 w-80 max-w-full bg-muted animate-pulse rounded" />
        </Container>
      </div>
      <Container size="wide" className="py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <GroupTileSkeleton key={i} />
          ))}
        </div>
      </Container>
    </main>
  );
}
