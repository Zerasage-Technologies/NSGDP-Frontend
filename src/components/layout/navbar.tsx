"use client";

import Link from "next/link";
import { Search, Upload, LogOut, Settings as SettingsIcon, LayoutDashboard, ShieldCheck, Map } from "lucide-react";
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
    <header className="navbar sticky top-0 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="navbar-container mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        {/* Logo */}
        <Link href="/" className="navbar-logo flex items-center gap-2 flex-shrink-0">
          <div className="logo-icon flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm font-semibold">
            NS
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold leading-tight">Niger State</div>
            <div className="text-xs text-muted-foreground">Open Data</div>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="navbar-search relative hidden flex-1 max-w-md md:flex">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search datasets..."
            className="w-full pl-10 pr-3 h-9 text-sm bg-accent/50 border-primary/20 focus:border-primary/50 focus:bg-background"
            aria-label="Search datasets"
          />
        </div>

        {/* Navigation */}
        <nav className="navbar-nav flex items-center gap-2">
          {/* Map Explorer Link */}
          <Link href="/map">
            <Button variant="ghost" size="sm">
              <Map className="size-4" />
              <span className="hidden sm:inline ml-2">Map</span>
            </Button>
          </Link>

          {/* Upload CTA (Contributor+) */}
          {canUpload && (
            <Link href="/datasets/new">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
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
                <Button variant="ghost" size="sm" className="text-foreground hover:bg-accent">Log In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Register</Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="user-menu-trigger flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-muted transition-colors"
                aria-label="User menu"
              >
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-sm">
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
