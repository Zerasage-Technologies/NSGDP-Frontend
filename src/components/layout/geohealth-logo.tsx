import Link from "next/link";
import { cn } from "@/lib/utils";

interface GeoHealthLogoProps {
  className?: string;
  compact?: boolean;
}

export function GeoHealthLogo({ className, compact }: GeoHealthLogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 hover:opacity-90 transition-opacity", className)}>
      <div
        className="flex size-10 items-center justify-center rounded-full border-2 border-[#E8A020] bg-primary text-primary-foreground shadow-sm"
        aria-hidden
      >
        <span className="text-xs font-bold tracking-tight">NS</span>
      </div>
      {!compact && (
        <div className="hidden sm:block leading-tight">
          <div className="text-sm font-bold text-foreground">Niger State GeoHealth Portal</div>
          <div className="text-[10px] font-semibold tracking-widest text-[#E8A020] uppercase">
            Health Data Portal
          </div>
        </div>
      )}
    </Link>
  );
}
