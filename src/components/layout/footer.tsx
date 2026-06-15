import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/50 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">About</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground">
                  About the Portal
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* For Data Users */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">For Data Users</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/datasets" className="hover:text-foreground">
                  Browse Datasets
                </Link>
              </li>
              <li>
                <Link href="/organisations" className="hover:text-foreground">
                  Organisations
                </Link>
              </li>
              <li>
                <Link href="/groups" className="hover:text-foreground">
                  Topics
                </Link>
              </li>
              <li>
                <Link href="/api/docs" className="hover:text-foreground">
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* For Contributors */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">For Contributors</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/register" className="hover:text-foreground">
                  Register Account
                </Link>
              </li>
              <li>
                <Link href="/dashboard/upload" className="hover:text-foreground">
                  Upload Dataset
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground">
                  My Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Niger State Government */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Niger State Government</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://nigerstate.gov.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  Official Website
                </a>
              </li>
              <li>
                <a
                  href="https://nigerstate.gov.ng/mdas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground"
                >
                  Ministries & Agencies
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-xs">
              NS
            </div>
            <span>© {new Date().getFullYear()} Niger State Government</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <a
              href="https://zerasage.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:underline"
            >
              Zerasage Technologies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
