"use client";

import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/src/components/ui/sheet";
import { Bell, ChevronDown, LogOut, Menu, Search, Settings, User } from "lucide-react";
import { OwnerSidebar } from "./OwnerSidebar";

export function OwnerTopbar() {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6">
            {/* Mobile sidebar trigger */}
            <Sheet>
                <SheetTrigger
                    aria-label="Open menu"
                    className="inline-flex size-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 lg:hidden"
                >
                    <Menu size={18} />
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                    <OwnerSidebar />
                </SheetContent>
            </Sheet>

            {/* Search */}
            <div className="relative hidden flex-1 max-w-md md:block">
                <Search
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                    type="search"
                    placeholder="Search buildings, tenants, invoices..."
                    className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
            </div>

            <div className="ml-auto flex items-center gap-2">
                <button
                    type="button"
                    aria-label="Notifications"
                    className="relative inline-flex size-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100"
                >
                    <Bell size={18} />
                    <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-white" />
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-slate-100">
                        <Avatar className="size-8">
                            <AvatarFallback className="bg-indigo-600 text-xs font-semibold text-white">
                                AS
                            </AvatarFallback>
                        </Avatar>
                        <div className="hidden flex-col items-start leading-tight sm:flex">
                            <span className="text-sm font-medium text-slate-800">
                                Aziz Sajib
                            </span>
                            <span className="text-[11px] text-slate-500">Owner</span>
                        </div>
                        <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <User size={14} className="mr-2" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings size={14} className="mr-2" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                            <LogOut size={14} className="mr-2" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
