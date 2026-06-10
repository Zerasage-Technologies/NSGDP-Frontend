"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { useMockSession } from "@/lib/auth/mock-session";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { currentUser } = useMockSession();

  // Auth guard - redirect to login if not authenticated
  useEffect(() => {
    if (currentUser.role === "public") {
      router.push("/login?returnTo=/dashboard");
    }
  }, [currentUser.role, router]);

  // Don't render dashboard if not authenticated
  if (currentUser.role === "public") {
    return null;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
