"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMockSession } from "@/lib/auth/mock-session";
import type { AccessLevel } from "@/types";
import { loginSchema, type LoginFormData } from "@/lib/schemas/auth";
import { toast } from "sonner";

const MAX_ATTEMPTS = 5;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setRole } = useMockSession();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  const [accessLevel, setAccessLevel] = useState<AccessLevel>("public");

  const returnTo = searchParams?.get("returnTo") || "/dashboard";
  const submitLabel =
    accessLevel === "public"
      ? "Continue as Public User"
      : accessLevel === "partner"
        ? "Request Partner Access"
        : "Log in as Administrator";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    if (locked) return;

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock: wrong password if email doesn't contain @
    if (!data.email.includes("@")) {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= MAX_ATTEMPTS) {
        setLocked(true);
        toast.error("Account locked after 5 failed attempts. Try again later.");
      } else {
        toast.error(`Invalid credentials. Attempt ${next} of ${MAX_ATTEMPTS}.`);
      }
      setLoading(false);
      return;
    }

    if (data.email.includes("admin")) {
      setRole("super_admin");
      router.push("/login/verify");
    } else if (data.email.includes("contributor")) {
      setRole("contributor");
      router.push("/login/verify");
    } else if (data.email.includes("org")) {
      setRole("org_admin");
      router.push("/login/verify");
    } else {
      setRole("registered");
      toast.success("Login successful!");
      router.push(returnTo);
    }
    setLoading(false);
  };

  return (
    <Container className="py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Log in to access your account and datasets</CardDescription>
        </CardHeader>
        <CardContent>
          {searchParams?.get("returnTo")?.includes("/dataportal/") && (
            <div className="mb-6 rounded-lg bg-blue-50 dark:bg-blue-950 p-4 text-sm">
              <p className="text-blue-900 dark:text-blue-100">Log in to download this dataset</p>
            </div>
          )}

          {locked ? (
            <div className="text-center py-8 space-y-4">
              <Lock className="size-12 mx-auto text-destructive" />
              <p className="font-medium">Account temporarily locked</p>
              <p className="text-sm text-muted-foreground">
                Too many failed login attempts. Please try again in 15 minutes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              <fieldset className="space-y-2">
                <legend className="text-sm font-medium mb-2">Access Level</legend>
                {(
                  [
                    ["public", "Public Access", "General public — browse and download open datasets"],
                    ["partner", "Partner Access", "NGOs, donors, and development partners"],
                    ["administrator", "Administrator", "State Ministry of Health admin users"],
                  ] as const
                ).map(([value, label, hint]) => (
                  <label
                    key={value}
                    className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                      accessLevel === value ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="accessLevel"
                      value={value}
                      checked={accessLevel === value}
                      onChange={() => setAccessLevel(value)}
                      className="mt-1"
                    />
                    <span>
                      <span className="text-sm font-medium block">{label}</span>
                      <span className="text-xs text-muted-foreground">{hint}</span>
                    </span>
                  </label>
                ))}
              </fieldset>

              {accessLevel !== "public" && (
                <p className="text-xs text-muted-foreground rounded-lg bg-muted p-3">
                  Need access? Contact NSPHCDA at{" "}
                  <a href="mailto:healthdata@nsphcda.ng.gov.ng" className="text-primary hover:underline">
                    healthdata@nsphcda.ng.gov.ng
                  </a>
                </p>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email Address</label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
                )}
              </div>

              {attempts > 0 && attempts < MAX_ATTEMPTS && (
                <p className="text-xs text-warning">Attempt {attempts} of {MAX_ATTEMPTS}</p>
              )}

              <div className="flex items-center gap-2">
                <Checkbox id="remember" {...register("remember")} />
                <label htmlFor="remember" className="text-sm">Remember me for 30 days</label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait…" : submitLabel}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">Register</Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <Container className="py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Loading...</CardDescription>
          </CardHeader>
        </Card>
      </Container>
    }>
      <LoginContent />
    </Suspense>
  );
}
