"use client";

import Link from "next/link";
import { Search, Upload, LogOut, Settings as SettingsIcon, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useMockSession } from "@/lib/auth/mock-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { currentUser, isAuthenticated } = useMockSession();

  const canUpload = ["contributor", "org_admin", "super_admin"].includes(currentUser.role);
  const isAdmin = currentUser.role === "super_admin";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
            NS
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold leading-tight">Niger State</div>
            <div className="text-xs text-muted-foreground">Open Data Portal</div>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="relative hidden flex-1 max-w-md md:flex">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search datasets..."
            className="w-full pl-9"
            aria-label="Search datasets"
          />
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          {/* Upload CTA (Contributor+) */}
          {canUpload && (
            <Link href="/datasets/new">
              <Button className="bg-teal text-teal-foreground hover:bg-teal/90">
                <Upload className="size-4" />
                <span className="hidden sm:inline">Upload</span>
              </Button>
            </Link>
          )}

          {/* Admin Badge (Super Admin only) */}
          {isAdmin && (
            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ShieldCheck className="size-4" />
                <span className="hidden sm:inline">Admin</span>
                <span className="ml-1 rounded-full bg-info px-1.5 py-0.5 text-xs font-semibold text-info-foreground">
                  3
                </span>
              </Button>
            </Link>
          )}

          {/* Auth Actions */}
          {!isAuthenticated ? (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted"
                aria-label="User menu"
              >
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                  {currentUser.fullName.charAt(0)}
                </div>
                <span className="hidden sm:inline text-sm font-medium">
                  {currentUser.fullName.split(" ")[0]}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{currentUser.fullName}</p>
                    <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/dashboard" className="flex items-center gap-2 w-full">
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings" className="flex items-center gap-2 w-full">
                    <SettingsIcon className="size-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="size-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  );
}
