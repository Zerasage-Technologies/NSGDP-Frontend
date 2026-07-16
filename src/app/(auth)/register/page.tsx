"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, CheckCircle2, Download } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PasswordStrengthMeter } from "@/components/forms/password-strength-meter";
import { FormError } from "@/components/forms/form-error";
import { registerSchema, type RegisterFormData } from "@/lib/schemas/auth";
import { register as registerUser } from "@/lib/api";
import { storeTokens } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const ACCESS_LEVELS = [
  {
    value: "public",
    title: "Public User",
    tagline: "For researchers, planners, health officials & the public",
    capabilities: [
      "Browse and search all published datasets",
      "Download open-access data files",
      "Track your personal download history",
      "Request access to restricted datasets",
    ],
    activation: "Activated immediately",
    activationIcon: CheckCircle2,
    activationClass: "text-emerald-600",
    icon: Download,
  },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite");

  // All hooks must be at the top, before any conditional returns
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { terms: false as unknown as true, accessLevel: "public" },
  });

  const password = watch("password", "");

  // Redirect to invite page if token is present
  useEffect(() => {
    if (inviteToken) {
      router.replace(`/register/invite?token=${inviteToken}`);
    }
  }, [inviteToken, router]);

  // Don't render form if redirecting
  if (inviteToken) {
    return (
      <Container className="py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground">Redirecting to invite page...</p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    
    try {
      const response = await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phone,
        accessLevel: data.accessLevel,
        reason: data.reason,
      });

      // Check if user needs approval (tokens will be null)
      if (!response.tokens) {
        // Account pending approval
        toast.success(
          data.accessLevel === "public"
            ? "Registration successful! You can now login."
            : "Registration successful! Your account is pending admin approval. You'll receive an email once activated."
        );
        router.push("/login");
        return;
      }

      // Auto-login for public users
      storeTokens(
        response.tokens.accessToken,
        response.tokens.refreshToken,
        response.tokens.expiresIn
      );

      toast.success("Registration successful! Welcome to the portal.");
      router.push("/dashboard");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Register to access datasets and contribute data to Niger State Open Data Portal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1.5">
                Full Name <span className="text-destructive">*</span>
              </label>
              <Input id="fullName" placeholder="Enter your full name" {...register("fullName")} />
              <FormError message={errors.fullName?.message} />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                Email Address <span className="text-destructive">*</span>
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
              <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
                Phone Number (Optional)
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+234 XXX XXX XXXX"
                {...register("phone")}
              />
              <FormError message={errors.phone?.message} />
              <p className="text-xs text-muted-foreground mt-1">
                Nigerian phone number for account recovery
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
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
              <PasswordStrengthMeter password={password} />
              <FormError message={errors.password?.message} />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
                Confirm Password <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <FormError message={errors.confirmPassword?.message} />
            </div>

            <div>
              <p className="block text-sm font-medium mb-3">
                Access Level <span className="text-destructive">*</span>
              </p>
              <Controller
                name="accessLevel"
                control={control}
                render={({ field }) => (
                  <div className="space-y-3">
                    {ACCESS_LEVELS.map((level) => {
                      const isSelected = field.value === level.value;
                      const ActivationIcon = level.activationIcon;
                      const RoleIcon = level.icon;
                      return (
                        <button
                          key={level.value}
                          type="button"
                          onClick={() => field.onChange(level.value)}
                          className={cn(
                            "w-full text-left rounded-xl border-2 p-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                            isSelected
                              ? "border-primary bg-primary/5 shadow-sm"
                              : "border-input bg-background hover:border-primary/50 hover:bg-muted/40"
                          )}
                          aria-pressed={isSelected}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className={cn(
                              "flex size-9 items-center justify-center rounded-lg",
                              isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            )}>
                              <RoleIcon className="size-4" />
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                            )}
                          </div>
                          <p className="font-semibold text-sm leading-tight">{level.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 mb-3 leading-snug">{level.tagline}</p>
                          <ul className="space-y-1 mb-3">
                            {level.capabilities.map((cap) => (
                              <li key={cap} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                                <span className="mt-0.5 shrink-0 size-3 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                                  <span className="size-1.5 rounded-full bg-muted-foreground/60" />
                                </span>
                                {cap}
                              </li>
                            ))}
                          </ul>
                          <div className={cn("flex items-center gap-1.5 text-xs font-medium", level.activationClass)}>
                            <ActivationIcon className="size-3.5" />
                            {level.activation}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              />
              <FormError message={errors.accessLevel?.message} />
              <div className="mt-3 p-3 bg-muted/50 rounded-lg border border-muted">
                <p className="text-xs text-muted-foreground">
                  <strong className="font-medium text-foreground">Need to contribute data?</strong><br />
                  Data Contributors and Organisation Admins must be invited by their organisation. 
                  Contact your organisation administrator or reach out to{" "}
                  <a href="mailto:admin@nigerstate-geohealth.ng" className="text-primary hover:underline">
                    admin@nigerstate-geohealth.ng
                  </a>
                  {" "}for assistance.
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium mb-1.5">
                Reason for Registering <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="reason"
                rows={3}
                maxLength={500}
                placeholder="Tell us how you plan to use the portal..."
                {...register("reason")}
              />
              <FormError message={errors.reason?.message} />
            </div>

            <div className="flex items-start gap-2">
              <Controller
                name="terms"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="terms"
                    checked={field.value === true}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                )}
              />
              <label htmlFor="terms" className="text-sm leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Use
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            <FormError message={errors.terms?.message} />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Log In
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
