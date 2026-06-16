"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, LayoutDashboard, Settings, ShieldCheck, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useMockSession } from "@/lib/auth/mock-session";
import { GeoHealthLogo } from "@/components/layout/geohealth-logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/analytics", label: "Analytics" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/learning", label: "Tools & Learning" },
];

export function Navbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { currentUser, isAuthenticated, logout } = useMockSession();
  const isAdmin = currentUser.role === "super_admin";

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <header className="navbar sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4">
        <GeoHealthLogo />

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button variant="ghost" size="sm" className="text-sm">
                {link.label}
              </Button>
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              Data Portal
              <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => router.push("/dataportal")}>
                View Data
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/submit")}>
                Submit Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              GIS Mapping
              <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => router.push("/gis-mapping")}>
                Disease Burden Map
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/gis-map")}>
                Facility Map
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-amber-500" />
            DHIS2 Sync: Manual
          </span>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="size-4 dark:hidden" />
            <Moon className="size-4 hidden dark:block" />
          </Button>

          {isAdmin && (
            <Link href="/admin" className="hidden sm:block">
              <Button variant="outline" size="sm">
                <ShieldCheck className="size-4" />
              </Button>
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary hover:bg-primary/90 font-semibold">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted"
                aria-label="User menu"
              >
                <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  {currentUser.fullName.charAt(0)}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>{currentUser.fullName}</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    <LayoutDashboard className="size-4" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                    <Settings className="size-4" /> Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="size-4" /> Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
