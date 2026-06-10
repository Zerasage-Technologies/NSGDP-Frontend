"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function VerifyEmailPage() {
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    // Simulate resend
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Verification email resent! Check your inbox.");

    // Start 60-second cooldown
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
  };

  return (
    <main className="flex-1 bg-muted/40">
      <Container className="py-12">
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
                We&apos;ve sent a verification link to your email address. Please check your
                inbox and click the link to verify your account.
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
                disabled={resendCooldown > 0}
                className="w-full"
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend Verification Email"}
              </Button>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  After verifying your email, you can log in to your account
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
      </Container>
    </main>
  );
}
