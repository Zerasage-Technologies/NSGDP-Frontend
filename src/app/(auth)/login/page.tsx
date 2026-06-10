"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMockSession } from "@/lib/auth/mock-session";
import { toast } from "sonner";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setRole } = useMockSession();
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const returnTo = searchParams?.get("returnTo") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication - check email to assign role
    if (email.includes("admin")) {
      setRole("super_admin");
      // Redirect to 2FA for admin
      router.push("/login/verify");
    } else if (email.includes("contributor")) {
      setRole("contributor");
      router.push("/login/verify");
    } else if (email.includes("org")) {
      setRole("org_admin");
      router.push("/login/verify");
    } else {
      // Regular users don't need 2FA
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
            <CardDescription>
              Log in to access your account and datasets
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Download Context Banner */}
            {searchParams?.get("returnTo")?.includes("/datasets/") && (
              <div className="mb-6 rounded-lg bg-blue-50 dark:bg-blue-950 p-4 text-sm">
                <p className="text-blue-900 dark:text-blue-100">
                  Log in to download this dataset
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <Checkbox id="remember" name="remember" />
                <label htmlFor="remember" className="text-sm">
                  Remember me for 30 days
                </label>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </Button>

              {/* Register Link */}
              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  Register
                </Link>
              </p>
            </form>
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
