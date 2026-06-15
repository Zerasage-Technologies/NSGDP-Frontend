"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PasswordStrengthMeter } from "@/components/forms/password-strength-meter";
import { FormError } from "@/components/forms/form-error";
import { registerSchema, type RegisterFormData } from "@/lib/schemas/auth";
import { toast } from "sonner";

export const dynamic = "force-dynamic";

export default function RegisterPage() {
  const router = useRouter();
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

  const onSubmit = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success("Registration successful! Check your email to verify your account.");
    router.push("/verify-email");
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
              <label htmlFor="accessLevel" className="block text-sm font-medium mb-1.5">
                Access Level <span className="text-destructive">*</span>
              </label>
              <select
                id="accessLevel"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                {...register("accessLevel")}
              >
                <option value="public">Public user</option>
                <option value="partner">Partner — pending admin approval</option>
                <option value="administrator">Admin — pending admin approval</option>
              </select>
              <FormError message={errors.accessLevel?.message} />
              <p className="text-xs text-muted-foreground mt-1">
                Public accounts activated immediately. Partner and Admin requests must be approved by an administrator.
              </p>
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
