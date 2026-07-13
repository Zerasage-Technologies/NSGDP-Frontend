"use client";

export function RoleSwitcher() {
  // Role switcher is incompatible with real authentication
  // It was designed for mock session only
  // Keeping the component but disabling it
  return null;

  /* Original mock session code - disabled
  const { currentUser, setRole } = useMockSession();
  const [isOpen, setIsOpen] = useState(false);

  // Show in dev always; in production only when NEXT_PUBLIC_SHOW_ROLE_SWITCHER=true
  const show =
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_SHOW_ROLE_SWITCHER === "true";

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger
          className="size-12 rounded-full bg-secondary text-secondary-foreground shadow-lg ring-2 ring-primary/20 hover:bg-secondary/80 inline-flex items-center justify-center"
          aria-label="Switch role (dev only)"
        >
          <Settings className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          {(["Public", "Internal", "Admin"] as const).map((group) => (
            <DropdownMenuGroup key={group}>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                {group}
              </DropdownMenuLabel>
              {ROLES.filter((r) => r.group === group).map((role) => (
                <DropdownMenuItem
                  key={role.value}
                  onClick={() => setRole(role.value)}
                  className={
                    currentUser.role === role.value
                      ? "bg-primary text-primary-foreground"
                      : ""
                  }
                >
                  {role.label}
                  {currentUser.role === role.value && (
                    <span className="ml-auto text-xs">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
  */
}
