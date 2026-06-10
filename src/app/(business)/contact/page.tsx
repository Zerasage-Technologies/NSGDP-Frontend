"use client";

import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success("Message sent successfully! We&apos;ll get back to you soon.");
    setLoading(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <main className="flex-1">
      <div className="border-b bg-muted/40">
        <Container className="py-8">
          <h1 className="text-3xl font-bold">Contact Us</h1>
          <p className="mt-2 text-muted-foreground">
            Get in touch with the Niger State Open Data team
          </p>
        </Container>
      </div>

      <Container className="py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                        Full Name
                      </label>
                      <Input id="name" name="name" required />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                        Email Address
                      </label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1.5">
                      Subject
                    </label>
                    <Input id="subject" name="subject" required />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1.5">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      required
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="size-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a
                      href="mailto:opendata@niger.gov.ng"
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      opendata@niger.gov.ng
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="size-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">+234 (0) 803 XXX XXXX</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      Niger State Government Secretariat
                      <br />
                      Minna, Niger State
                      <br />
                      Nigeria
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Office Hours</h3>
                <p className="text-sm text-muted-foreground">
                  Monday - Friday
                  <br />
                  8:00 AM - 4:00 PM (WAT)
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </main>
  );
}
