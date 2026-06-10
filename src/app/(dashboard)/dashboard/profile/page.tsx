"use client";

import { useState } from "react";
import { Eye, EyeOff, Save } from "lucide-react";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMockSession } from "@/lib/auth/mock-session";
import { toast } from "sonner";

export default function ProfilePage() {
  const { currentUser } = useMockSession();
  const [saving, setSaving] = useState(false);

  return (
    <main className="flex-1 bg-muted/40">
      <div className="border-b bg-background">
        <Container size="wide" className="py-8">
          <h1 className="text-3xl font-bold">Profile & Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account information and preferences
          </p>
        </Container>
      </div>

      <Container size="wide" className="py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your profile details visible to other users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm currentUser={currentUser} setSaving={setSaving} saving={saving} />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PasswordForm setSaving={setSaving} saving={saving} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium mb-1">2FA Status</p>
                      <p className="text-sm text-muted-foreground">
                        {currentUser.role === "super_admin" || currentUser.role === "org_admin"
                          ? "Enabled (Required for your role)"
                          : "Not enabled"}
                      </p>
                    </div>
                    {currentUser.role !== "super_admin" && currentUser.role !== "org_admin" && (
                      <Button variant="outline">Enable 2FA</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Choose how you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <NotificationToggle
                    label="Email Notifications"
                    description="Receive updates about your datasets and downloads"
                  />
                  <NotificationToggle
                    label="Dataset Comments"
                    description="Get notified when someone comments on your datasets"
                  />
                  <NotificationToggle
                    label="Access Requests"
                    description="Alert me when someone requests access to restricted datasets"
                  />
                  <NotificationToggle
                    label="Weekly Summary"
                    description="Receive a weekly summary of portal activity"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Display Preferences</CardTitle>
                  <CardDescription>
                    Customize how you view the portal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Default View
                    </label>
                    <select className="w-full rounded-lg border border-input bg-background px-3 py-2">
                      <option>Grid View</option>
                      <option>List View</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Items Per Page
                    </label>
                    <select className="w-full rounded-lg border border-input bg-background px-3 py-2">
                      <option>10</option>
                      <option selected>20</option>
                      <option>50</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </main>
  );
}

// Profile Form Component
function ProfileForm({
  currentUser,
  setSaving,
  saving,
}: {
  currentUser: { fullName: string; email: string; role: string };
  setSaving: (v: boolean) => void;
  saving: boolean;
}) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Profile updated successfully");
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1.5">
            Full Name
          </label>
          <Input
            id="fullName"
            name="fullName"
            defaultValue={currentUser.fullName}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={currentUser.email}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
            Phone Number
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+234 XXX XXX XXXX"
          />
        </div>
        <div>
          <label htmlFor="organization" className="block text-sm font-medium mb-1.5">
            Organization
          </label>
          <Input
            id="organization"
            name="organization"
            placeholder="Your organization"
          />
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium mb-1.5">
          Bio
        </label>
        <Textarea
          id="bio"
          name="bio"
          rows={3}
          placeholder="Tell us about yourself and your work..."
        />
      </div>

      <Button type="submit" disabled={saving}>
        <Save className="size-4 mr-2" />
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}

// Password Form Component
function PasswordForm({
  setSaving,
  saving,
}: {
  setSaving: (v: boolean) => void;
  saving: boolean;
}) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Password changed successfully");
    setSaving(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium mb-1.5">
          Current Password
        </label>
        <div className="relative">
          <Input
            id="currentPassword"
            name="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium mb-1.5">
          New Password
        </label>
        <div className="relative">
          <Input
            id="newPassword"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
          Confirm New Password
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? "Changing Password..." : "Change Password"}
      </Button>
    </form>
  );
}

// Notification Toggle Component
function NotificationToggle({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="font-medium mb-1">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary"
      >
        <span className="translate-x-6 inline-block size-4 transform rounded-full bg-white transition" />
      </button>
    </div>
  );
}
