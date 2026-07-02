"use client";

// src/app/owner/dashboard/floors/page.tsx

import { FloorsPanel } from "@/src/components/dashboard/floors/FloorsPanel";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useBuildings } from "@/src/hooks/useBuildings";
import { fmtNum } from "@/src/lib/numerals";
import { Building2, Layers } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";

export default function FloorsPage() {
    return (
        <Suspense fallback={<FloorsPageShell />}>
            <FloorsPageInner />
        </Suspense>
    );
}

function FloorsPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const buildingIdParam = searchParams.get("buildingId") ?? "";

    const { data: buildings, isLoading, isError, error } = useBuildings();

    const selected = useMemo(
        () => buildings?.find((b) => b.id === buildingIdParam),
        [buildings, buildingIdParam],
    );

    // Auto-select the first building when none is in the URL and exactly one exists.
    useEffect(() => {
        if (!buildingIdParam && buildings && buildings.length === 1) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("buildingId", buildings[0].id);
            router.replace(`/owner/dashboard/floors?${params.toString()}`);
        }
    }, [buildingIdParam, buildings, router, searchParams]);

    function handleBuildingChange(id: string) {
        const params = new URLSearchParams(searchParams.toString());
        if (id) params.set("buildingId", id);
        else params.delete("buildingId");
        router.replace(`/owner/dashboard/floors?${params.toString()}`);
    }

    const hasBuildings = !!buildings && buildings.length > 0;

    return (
        <div className="min-h-screen bg-cream">
            <div className="mx-auto container space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8 ">
                {/* Header — picker lives inline, not in its own card */}
                <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="font-serif text-[13px] italic text-coral-600/85">
                            Building structure
                        </p>
                        <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
                            Floors
                        </h1>
                        <p className="font-bangla mt-1 text-[13px] text-ink-soft">
                            তলা ও কাঠামো পরিচালনা।
                        </p>
                    </div>

                    {/* Compact picker — only renders when there's something to pick */}
                    {hasBuildings && (
                        <div className="flex items-center gap-2.5">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                                Building
                            </span>
                            <div className="w-full min-w-[240px] sm:w-72">
                                <Select
                                    value={buildingIdParam}
                                    onValueChange={(v) => handleBuildingChange(v ?? "")}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger className="w-full border-rule-soft bg-paper text-ink focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20">
                                        <SelectValue
                                            placeholder={
                                                isLoading
                                                    ? "Loading…"
                                                    : "Select a building"
                                            }
                                        >
                                            {(value) =>
                                                buildings?.find(
                                                    (b) => b.id === value,
                                                )?.name ?? null
                                            }
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {buildings?.map((b) => (
                                            <SelectItem key={b.id} value={b.id}>
                                                <span className="inline-flex items-center gap-2">
                                                    <Building2
                                                        size={12}
                                                        className="text-ink-soft/70"
                                                    />
                                                    {b.name}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </header>

                {/* Content */}
                {isLoading ? (
                    <FloorsPageShell />
                ) : isError ? (
                    <div className="rounded-[14px] border border-coral-100 bg-coral-50/60 px-6 py-12 text-center">
                        <h2 className="text-[15px] font-bold text-coral-600">
                            Couldn&apos;t load buildings
                        </h2>
                        <p className="mt-1 text-[13px] text-coral-600/80">
                            {error instanceof Error
                                ? error.message
                                : "Please try again."}
                        </p>
                    </div>
                ) : !hasBuildings ? (
                    <EmptyBuildings />
                ) : !selected ? (
                    <NoSelection />
                ) : (
                    <>
                        {/* Selected building strip — shows context + quick link */}
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-rule-soft bg-paper px-4 py-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-jade-50 text-jade-800">
                                    <Building2 size={16} />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft">
                                        Showing floors in
                                    </p>
                                    <Link
                                        href={`/owner/dashboard/buildings/${selected.id}`}
                                        className="truncate text-[14px] font-bold text-jade-950 hover:text-coral-600 transition-colors"
                                    >
                                        {selected.name}
                                    </Link>
                                </div>
                            </div>
                            <span className="text-[12px] text-ink-soft tabular-nums">
                                <span className="font-semibold text-ink">
                                    {fmtNum(selected.totalFloors)}
                                </span>{" "}
                                planned
                            </span>
                        </div>

                        <FloorsPanel
                            buildingId={selected.id}
                            totalFloors={selected.totalFloors}
                        />
                    </>
                )}
            </div>
        </div>
    );
}

function EmptyBuildings() {
    return (
        <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-jade-50">
                <Building2 size={26} className="text-jade-800" />
            </div>
            <h2 className="mt-4 text-[17px] font-bold text-jade-950">
                No buildings yet
            </h2>
            <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-ink-soft">
                You need at least one building before you can add floors.
            </p>
            <p className="font-bangla mt-0.5 text-[12px] text-ink-soft/75">
                প্রথমে একটি বিল্ডিং যোগ করুন
            </p>
            <div className="mt-5">
                <Link
                    href="/owner/dashboard/buildings"
                    className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950"
                >
                    Go to buildings
                </Link>
            </div>
        </div>
    );
}

function NoSelection() {
    return (
        <div className="rounded-[14px] border border-dashed border-rule-soft bg-paper px-6 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-cream">
                <Layers size={26} className="text-ink-soft" />
            </div>
            <h2 className="mt-4 text-[17px] font-bold text-jade-950">
                Select a building
            </h2>
            <p className="mx-auto mt-1.5 max-w-sm text-[13.5px] text-ink-soft">
                Pick a building from the dropdown above to view and manage its
                floors.
            </p>
        </div>
    );
}

function FloorsPageShell() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <Skeleton
                    key={i}
                    className="h-14 w-full rounded-[10px] bg-paper"
                />
            ))}
        </div>
    );
}