"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FormError } from "@/components/forms/form-error";
import { loginSchema, type LoginFormData } from "@/lib/schemas/auth";
import { login as loginUser } from "@/lib/api";
import { storeTokens } from "@/lib/utils";
import { toast } from "sonner";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const returnTo = searchParams?.get("returnTo") || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });

      // Store tokens
      storeTokens(
        response.tokens!.accessToken,
        response.tokens!.refreshToken,
        response.tokens!.expiresIn
      );

      toast.success("Login successful! Welcome back.");
      router.push(returnTo);
    } catch (error: unknown) {
      // Handle specific error messages from backend
      const errorMessage = error instanceof Error ? error.message : "Invalid credentials. Please try again.";
      if (errorMessage.includes("pending approval")) {
        toast.error("Your account is pending admin approval. You'll receive an email once activated.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                {...register("email")}
              />
              <FormError message={errors.email?.message} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
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
              <FormError message={errors.password?.message} />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember" {...register("remember")} />
              <label htmlFor="remember" className="text-sm">
                Remember me for 30 days
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </Button>

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
