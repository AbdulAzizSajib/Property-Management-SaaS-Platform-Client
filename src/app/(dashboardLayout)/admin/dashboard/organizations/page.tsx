"use client";

// src/app/admin/dashboard/organizations/page.tsx
//
// SUPER_ADMIN — list every organization on the platform. The backend
// doesn't expose /organizations directly, so we derive the list from
// the subscriptions endpoint (each subscription embeds its org).

import { Skeleton } from "@/src/components/ui/skeleton";
import { useAllSubscriptions } from "@/src/hooks/useSubscription";
import { Building2, ExternalLink, Mail, Phone } from "lucide-react";
import Link from "next/link";

export default function AdminOrganizationsPage() {
    const { data, isLoading, isError, error } = useAllSubscriptions();

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto max-w-[1240px] space-y-5 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <header>
                    <p className="font-serif text-[13px] italic text-coral-600/85">
                        Platform tenants
                    </p>
                    <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
                        Organizations
                    </h1>
                    <p className="font-bangla mt-1 text-[13px] text-ink-soft">
                        নিবন্ধিত প্রতিষ্ঠানসমূহ
                    </p>
                </header>

                {isLoading ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton
                                key={i}
                                className="h-36 rounded-[14px] bg-paper"
                            />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
                        <h2 className="text-[15px] font-bold text-coral-600">
                            Couldn&apos;t load organizations
                        </h2>
                        <p className="mt-1 text-[13px] text-coral-600/80">
                            {error instanceof Error
                                ? error.message
                                : "Something went wrong."}
                        </p>
                    </div>
                ) : !data || data.length === 0 ? (
                    <div className="rounded-[14px] border border-dashed border-rule-soft bg-paper px-6 py-12 text-center">
                        <p className="text-[14px] font-semibold text-jade-950">
                            No organizations yet
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {data.map((sub) => {
                            const org = sub.organization;
                            return (
                                <div
                                    key={org.id}
                                    className="rounded-[14px] border border-rule-soft bg-paper p-4"
                                >
                                    <div className="flex items-start gap-2.5">
                                        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-jade-50 text-jade-700">
                                            <Building2 size={18} />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-[14.5px] font-bold text-jade-950">
                                                {org.name}
                                            </p>
                                            <p className="text-[11px] uppercase tracking-[0.1em] text-ink-soft">
                                                {sub.plan.replace("_", " ")} ·{" "}
                                                {sub.status}
                                            </p>
                                        </div>
                                    </div>
                                    <ul className="mt-3 space-y-1 text-[12px]">
                                        {org.email && (
                                            <li className="flex items-center gap-1.5 text-ink-soft">
                                                <Mail size={11} />
                                                <span className="truncate">
                                                    {org.email}
                                                </span>
                                            </li>
                                        )}
                                        {org.phone && (
                                            <li className="flex items-center gap-1.5 text-ink-soft">
                                                <Phone size={11} />
                                                {org.phone}
                                            </li>
                                        )}
                                    </ul>
                                    <Link
                                        href={`/admin/dashboard/subscriptions`}
                                        className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-jade-700 hover:text-coral-600"
                                    >
                                        Manage subscription
                                        <ExternalLink size={11} />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
