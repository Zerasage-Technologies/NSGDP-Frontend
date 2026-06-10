import { Container } from "@/components/layout/container";
import { GroupTile } from "@/components/data/group-tile";
import { getGroups } from "@/lib/mock";

export default async function GroupsPage() {
  const groups = await getGroups();

  return (
    <main className="flex-1">
      <div className="border-b bg-muted/40">
        <Container size="wide" className="py-8">
          <h1 className="text-3xl font-bold">Topics</h1>
          <p className="mt-2 text-muted-foreground">
            Explore datasets organized by thematic areas
          </p>
        </Container>
      </div>

      <Container size="wide" className="py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {groups.map((group) => (
            <GroupTile key={group.id} group={group} />
          ))}
        </div>
      </Container>
    </main>
  );
}
