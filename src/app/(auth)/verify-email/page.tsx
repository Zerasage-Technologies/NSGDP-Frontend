"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Loader2, AlertCircle } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { verifyEmail, resendVerification } from "@/lib/api";
import { storeTokens } from "@/lib/utils";
import { toast } from "sonner";

// Force dynamic rendering
export const dynamic = "force-dynamic";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [verifying, setVerifying] = useState(!!token);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        const response = await verifyEmail({ token });

        if (response.tokens) {
          storeTokens(
            response.tokens.accessToken,
            response.tokens.refreshToken,
            response.tokens.expiresIn
          );
        }

        toast.success("Email verified! Welcome to the portal.");

        // Force a full reload so auth context picks up the new tokens
        window.location.href = "/dashboard";
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        const errorMessage =
          err?.response?.data?.message || err?.message || "This verification link is invalid or has expired.";
        setVerifyError(errorMessage);
        setVerifying(false);
      }
    };

    verify();
  }, [token]);

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;

    setResending(true);
    try {
      await resendVerification({ email });
      toast.success("Verification email sent! Check your inbox.");

      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      toast.error("Failed to resend verification email. Please try again.");
    } finally {
      setResending(false);
    }
  };

  // Actively verifying a token from the emailed link
  if (verifying) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardContent className="pt-12 pb-12 text-center">
          <Loader2 className="size-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying your email...</p>
        </CardContent>
      </Card>
    );
  }

  // Token was present but verification failed (expired/invalid)
  if (verifyError) {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Verification Failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>{verifyError}</AlertDescription>
          </Alert>

          {email && (
            <Button onClick={handleResend} disabled={resending || resendCooldown > 0} className="w-full">
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Send a New Verification Link"}
            </Button>
          )}

          <Link href="/login">
            <Button variant="outline" className="w-full">
              Go to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Default: waiting for the user to check their inbox
  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <Mail className="size-8 text-blue-600 dark:text-blue-400" />
        </div>
        <CardTitle className="text-2xl">Check Your Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            We&apos;ve sent a verification link to{" "}
            {email ? <strong>{email}</strong> : "your email address"}. Click the link to
            verify your account and log in.
          </p>

          <div className="rounded-lg bg-muted p-4 text-sm">
            <p className="font-medium mb-2">Didn&apos;t receive the email?</p>
            <ul className="text-muted-foreground space-y-1 text-left">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure you entered the correct email address</li>
              <li>• Wait a few minutes for the email to arrive</li>
            </ul>
          </div>

          <Button
            onClick={handleResend}
            variant="outline"
            disabled={!email || resending || resendCooldown > 0}
            className="w-full"
          >
            {resendCooldown > 0
              ? `Resend in ${resendCooldown}s`
              : resending
              ? "Sending..."
              : "Resend Verification Email"}
          </Button>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-2">
              After verifying your email, you&apos;ll be logged in automatically
            </p>
            <Link href="/login">
              <Button variant="secondary" className="w-full">
                Go to Login
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="flex-1 bg-muted/40">
      <Container className="py-12">
        <Suspense
          fallback={
            <Card className="max-w-lg mx-auto">
              <CardContent className="pt-12 pb-12 text-center">
                <Loader2 className="size-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading...</p>
              </CardContent>
            </Card>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </Container>
    </main>
  );
}
