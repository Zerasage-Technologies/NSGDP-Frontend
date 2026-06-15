import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/brand";

interface GeoHealthLogoProps {
  className?: string;
  compact?: boolean;
}

export function GeoHealthLogo({ className, compact }: GeoHealthLogoProps) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5 hover:opacity-90 transition-opacity", className)}
      aria-label={BRAND.portalName}
    >
      <Image
        src={BRAND.logoPath}
        alt={BRAND.logoAlt}
        width={40}
        height={40}
        className="size-10 rounded-full object-cover border-2 border-[#E8A020] shadow-sm"
        priority
      />
      {!compact && (
        <div className="hidden sm:block leading-tight">
          <div className="text-sm font-bold text-foreground">{BRAND.portalName}</div>
          <div className="text-[10px] font-semibold tracking-widest text-[#E8A020] uppercase">
            {BRAND.portalTagline}
          </div>
        </div>
      )}
    </Link>
  );
}
