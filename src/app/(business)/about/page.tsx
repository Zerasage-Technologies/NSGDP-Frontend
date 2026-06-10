import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <main className="flex-1">
      <div className="border-b bg-muted/40">
        <Container className="py-8">
          <h1 className="text-3xl font-bold">About the Portal</h1>
          <p className="mt-2 text-muted-foreground">
            Niger State&apos;s official open data repository
          </p>
        </Container>
      </div>

      <Container className="py-12">
        <div className="prose prose-slate max-w-none">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <section>
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Niger State Open Data Portal is the official platform for accessing
                  geospatial and health datasets from across Niger State&apos;s 25 Local Government
                  Areas. Our mission is to promote transparency, enable evidence-based
                  decision-making, and support research and innovation through open data.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Comprehensive datasets from government ministries, departments, and agencies</li>
                  <li>• Geospatial data covering all 25 LGAs of Niger State</li>
                  <li>• Health indicators and public health surveillance data</li>
                  <li>• Agricultural, education, infrastructure, and environmental datasets</li>
                  <li>• Machine-readable formats (CSV, JSON, GeoJSON, Shapefile, and more)</li>
                  <li>• API access for developers and researchers</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Open Data Principles</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We are committed to the principles of open data: datasets are accessible,
                  machine-readable, and available under open licenses that permit reuse.
                  Public datasets can be downloaded by anyone. Restricted datasets require
                  registration and approval for research or policy purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Get Involved</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Government staff from contributing MDAs can register as data contributors
                  to upload and manage datasets. Researchers, developers, and citizens are
                  encouraged to explore, download, and use the data for analysis, visualization,
                  and application development.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </Container>
    </main>
  );
}
