"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Upload, LogOut, Settings as SettingsIcon, LayoutDashboard, ShieldCheck, Map, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useMockSession } from "@/lib/auth/mock-session";
import { NavbarSearch } from "@/components/layout/navbar-search";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function Navbar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { currentUser, isAuthenticated, logout } = useMockSession();

  const canUpload = ["contributor", "org_admin", "super_admin"].includes(currentUser.role);
  const isAdmin = currentUser.role === "super_admin";

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <header className="navbar sticky top-0 z-40 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="navbar-container mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="navbar-logo flex items-center gap-2 flex-shrink-0">
          <div className="logo-icon flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm font-semibold">
            NS
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold leading-tight">Niger State</div>
            <div className="text-xs text-muted-foreground">Open Data</div>
          </div>
        </Link>

        <NavbarSearch />

        <nav className="navbar-nav flex items-center gap-2" aria-label="Main navigation">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <Link href="/map">
            <Button variant="ghost" size="sm">
              <Map className="size-4" />
              <span className="hidden sm:inline ml-2">Map</span>
            </Button>
          </Link>

          {canUpload && (
            <Link href="/dashboard/upload">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Upload className="size-4" />
                <span className="hidden sm:inline">Upload</span>
              </Button>
            </Link>
          )}

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

          {!isAuthenticated ? (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Register
                </Button>
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
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/dashboard")}
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push("/dashboard/profile")}
                >
                  <SettingsIcon className="size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
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
