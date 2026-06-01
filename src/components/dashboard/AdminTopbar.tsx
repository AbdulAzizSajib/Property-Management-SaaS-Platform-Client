"use client";

// src/components/dashboard/AdminTopbar.tsx

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
import { httpClient } from "@/src/lib/axios/browserHttpClient";
import { cn } from "@/src/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  ChevronDown,
  Key,
  LogOut,
  Menu,
  Search,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { AdminSidebar } from "./AdminSidebar";

interface AdminTopbarProps {
  /** Currently signed-in user. */
  user?: {
    name: string;
    role?: string;
    photoUrl?: string;
  };
  /** Show the coral notification indicator on the bell. */
  hasNotifications?: boolean;
  /** Click handler for the notifications button. */
  onNotificationsClick?: () => void;
  /** Click handler for the search bar / command palette. */
  onSearchClick?: () => void;
}

const defaultUser = {
  name: "Aziz Sajib",
  role: "Super Admin",
};

export function AdminTopbar({
  user = defaultUser,
  hasNotifications = false,
  onNotificationsClick,
  onSearchClick,
}: AdminTopbarProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loggingOut, setLoggingOut] = useState(false);

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await httpClient.post("/auth/logout", {});
      queryClient.clear();
      toast.success("Logged out");
      router.replace("/login");
      router.refresh();
    } catch (error) {
      setLoggingOut(false);
      toast.error(
        error instanceof Error ? error.message : "Failed to log out",
      );
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
          <AdminSidebar />
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
          Search organizations, users, plans…
        </span>
        <kbd className="hidden shrink-0 items-center gap-0.5 rounded border border-rule-soft bg-paper px-1.5 py-0.5 font-mono text-[10.5px] font-medium text-ink-soft sm:inline-flex">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Notifications */}
        <button
          type="button"
          onClick={onNotificationsClick}
          aria-label={
            hasNotifications ? "Notifications (unread)" : "Notifications"
          }
          className="relative inline-flex size-9 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-cream hover:text-jade-900"
        >
          <Bell size={17} />
          {hasNotifications && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-coral-500 opacity-70" />
              <span className="relative h-2 w-2 rounded-full bg-coral-600 ring-2 ring-paper" />
            </span>
          )}
        </button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-1 transition-colors hover:bg-cream data-[state=open]:bg-cream">
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
                {user.role ?? "Super Admin"}
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
                  {user.role ?? "Super Admin"}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-rule-soft" />
              <DropdownMenuItem className="text-[13px] text-ink focus:bg-cream focus:text-jade-900">
                <User size={13} className="mr-2 text-ink-soft/70" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-[13px] text-ink focus:bg-cream focus:text-jade-900">
                <Key size={13} className="mr-2 text-ink-soft/70" />
                Change Password
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-rule-soft" />
              <DropdownMenuItem
                variant="destructive"
                disabled={loggingOut}
                onClick={handleLogout}
                className={cn(
                  "text-[13px] text-coral-700",
                  "focus:bg-coral-50 focus:text-coral-700",
                )}
              >
                <LogOut size={13} className="mr-2" />
                {loggingOut ? "Logging out…" : "Log out"}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
