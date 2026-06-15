import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { GeoHealthLogo } from "@/components/layout/geohealth-logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <GeoHealthLogo className="[&_div]:text-primary-foreground [&_span]:text-[#E8A020]" />
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Centralised geospatial and health data platform for Niger State — funded by Umbrella Fund,
              powered by Zerasage Technologies.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#E8A020]">Quick Links</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/85">
              <li><Link href="/dataportal" className="hover:text-white">Data Portal</Link></li>
              <li><Link href="/analytics" className="hover:text-white">Analytics</Link></li>
              <li><Link href="/gis-mapping" className="hover:text-white">Disease Burden Map</Link></li>
              <li><Link href="/gis-map" className="hover:text-white">Facility Map</Link></li>
              <li><Link href="/campaigns" className="hover:text-white">Campaigns</Link></li>
              <li><Link href="/learning" className="hover:text-white">Tools & Learning</Link></li>
              <li><Link href="/submit" className="hover:text-white">Submit Data</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#E8A020]">Contact</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/85">
              <li className="flex items-start gap-2">
                <MapPin className="size-4 shrink-0 mt-0.5" aria-hidden />
                <span>NSPHCDA, Niger State Government Secretariat, Minna, Niger State</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" aria-hidden />
                <a href="mailto:healthdata@nsphcda.ng.gov.ng" className="hover:text-white">
                  healthdata@nsphcda.ng.gov.ng
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" aria-hidden />
                <span>+234 (0) 803 XXX XXXX</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#E8A020]">Partners</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/85">
              <li><strong>Funded By:</strong> Umbrella Fund</li>
              <li><strong>Powered By:</strong> Zerasage Technologies</li>
              <li><strong>Lead Agency:</strong> NSPHCDA</li>
            </ul>
            <div className="flex gap-3 mt-4 text-sm">
              <a href="#" className="hover:text-[#E8A020]">Facebook</a>
              <a href="#" className="hover:text-[#E8A020]">Twitter</a>
              <a href="#" className="hover:text-[#E8A020]">LinkedIn</a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-primary-foreground/20 pt-8 text-sm text-primary-foreground/70">
          <span>© {new Date().getFullYear()} Niger State Primary Health Care Development Agency. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
