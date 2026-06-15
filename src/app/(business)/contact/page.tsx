"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormError } from "@/components/forms/form-error";
import { contactSchema } from "@/lib/schemas/auth";
import { toast } from "sonner";

export const dynamic = "force-dynamic";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Message sent successfully! We'll get back to you soon.");
    reset();
    setLoading(false);
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
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                        Full Name
                      </label>
                      <Input id="name" {...register("name")} />
                      <FormError message={errors.name?.message} />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                        Email Address
                      </label>
                      <Input id="email" type="email" {...register("email")} />
                      <FormError message={errors.email?.message} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-1.5">
                      Subject
                    </label>
                    <Input id="subject" {...register("subject")} />
                    <FormError message={errors.subject?.message} />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-1.5">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      rows={6}
                      placeholder="Tell us how we can help..."
                      {...register("message")}
                    />
                    <FormError message={errors.message?.message} />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="size-5 text-muted-foreground mt-0.5" aria-hidden />
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
                  <Phone className="size-5 text-muted-foreground mt-0.5" aria-hidden />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">+234 (0) 803 XXX XXXX</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-muted-foreground mt-0.5" aria-hidden />
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
