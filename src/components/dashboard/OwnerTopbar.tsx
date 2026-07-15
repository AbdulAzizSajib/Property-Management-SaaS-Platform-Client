"use client";

// src/components/layout/OwnerTopbar.tsx

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import { useCurrentUser } from "@/src/hooks/useAuthActions";
import { logout } from "@/src/services/authActions.services";
import { cn } from "@/src/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Key, LogOut, Menu, Search, User } from "lucide-react";
import { NotificationsBell } from "./NotificationsBell";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useRouter } from "@/src/i18n/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { ChangePasswordDialog } from "./auth/ChangePasswordDialog";
import { OwnerSidebar } from "./OwnerSidebar";

interface OwnerTopbarProps {
  /** Click handler for the search bar / command palette. */
  onSearchClick?: () => void;
}

/** "OWNER" → "Owner", "SUPER_ADMIN" → "Super Admin". */
function formatRole(role: string): string {
  return role
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function OwnerTopbar({ onSearchClick }: OwnerTopbarProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: me } = useCurrentUser();
  const [loggingOut, setLoggingOut] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const user = {
    name: me?.name ?? "",
    role: me ? formatRole(me.role) : "Owner",
    photoUrl: me?.image ?? undefined,
  };

  const initials =
    user.name
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "·";

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
      queryClient.clear();
      toast.success("Logged out");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      setLoggingOut(false);
      toast.error(error instanceof Error ? error.message : "Failed to log out");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-rule-soft bg-paper/85 px-4 backdrop-blur-md sm:px-6">
      {/* Mobile sidebar trigger */}
      <Sheet>
        <SheetTrigger
          aria-label="Open menu"
          className="inline-flex size-9 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-cream hover:text-jade-900 lg:hidden"
        >
          <Menu size={18} />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <OwnerSidebar />
        </SheetContent>
      </Sheet>

      {/* Search — stub for now, but reads as a real command launcher */}
      <button
        type="button"
        onClick={onSearchClick}
        className="group relative hidden h-9 max-w-md flex-1 items-center gap-2.5 rounded-md border border-rule-soft bg-cream/60 pl-3 pr-2 text-left text-[13px] text-ink-soft transition-colors hover:border-jade-700/30 hover:bg-paper focus:border-jade-700 focus:bg-paper focus:outline-none focus:ring-2 focus:ring-jade-700/20 md:flex"
      >
        <Search
          size={14}
          className="shrink-0 text-ink-soft/70 group-hover:text-jade-700"
        />
        <span className="flex-1 truncate text-ink-soft/75 group-hover:text-ink">
          Search buildings, tenants, invoices…
        </span>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <LanguageSwitcher />
        <NotificationsBell />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-1 transition-colors hover:bg-cream data-[state=open]:bg-cream">
            {/* Avatar — jade tint, matches the rest of the system */}
            <span className="relative inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-jade-50 ring-1 ring-jade-100 text-[11.5px] font-bold text-jade-800">
              {user.photoUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  className="size-full object-cover"
                />
              ) : (
                initials
              )}
            </span>
            <div className="hidden flex-col items-start leading-tight pr-1 sm:flex">
              <span className="text-[13px] font-semibold text-ink">
                {user.name}
              </span>
              <span className="text-[10.5px] text-ink-soft">
                {user.role ?? "Owner"}
              </span>
            </div>
            <ChevronDown
              size={13}
              className="hidden text-ink-soft/70 sm:block"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 border-rule-soft bg-paper"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="px-2 py-1.5">
                <p className="truncate text-[13px] font-semibold text-jade-950">
                  {user.name}
                </p>
                <p className="text-[11px] font-normal text-ink-soft">
                  {user.role ?? "Owner"}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-rule-soft" />
              <DropdownMenuItem className="text-[13px] text-ink focus:bg-cream focus:text-jade-900">
                <User size={13} className="mr-2 text-ink-soft/70" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setChangePasswordOpen(true)}
                className="text-[13px] text-ink focus:bg-cream focus:text-jade-900"
              >
                <Key size={13} className="mr-2 text-ink-soft/70" />
                Change Password
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-rule-soft" />
              <DropdownMenuItem
                variant="destructive"
                disabled={loggingOut}
                onClick={handleLogout}
                className={cn(
                  "text-[13px] text-coral-600",
                  "focus:bg-coral-50 focus:text-coral-600",
                )}
              >
                <LogOut size={13} className="mr-2" />
                {loggingOut ? "Logging out…" : "Log out"}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ChangePasswordDialog
        open={changePasswordOpen}
        onOpenChange={setChangePasswordOpen}
      />
    </header>
  );
}
