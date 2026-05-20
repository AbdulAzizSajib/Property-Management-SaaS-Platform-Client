"use client";

import { FloorsPanel } from "@/src/components/dashboard/floors/FloorsPanel";
import { Card } from "@/src/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useBuildings } from "@/src/hooks/useBuildings";
import { Building2, Layers } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";

export default function FloorsPage() {
    return (
        <Suspense fallback={<FloorsPageSkeleton />}>
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

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            {/* Heading */}
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Floors
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Manage floors across your buildings. Pick a building to view its floors.
                </p>
            </div>

            {/* Building picker */}
            <Card className="px-5 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                            <Building2 size={18} />
                        </span>
                        <div>
                            <p className="text-sm font-medium text-slate-800">Building</p>
                            <p className="text-xs text-slate-500">
                                Floors are scoped to a single building
                            </p>
                        </div>
                    </div>

                    <div className="w-full sm:w-72">
                        <Select
                            value={buildingIdParam}
                            onValueChange={(v) => handleBuildingChange(v ?? "")}
                            disabled={isLoading || !buildings || buildings.length === 0}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue
                                    placeholder={
                                        isLoading
                                            ? "Loading..."
                                            : !buildings || buildings.length === 0
                                              ? "No buildings yet"
                                              : "Select a building"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {buildings?.map((b) => (
                                    <SelectItem key={b.id} value={b.id}>
                                        {b.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </Card>

            {/* Content */}
            {isLoading ? (
                <FloorsPageSkeleton />
            ) : isError ? (
                <Card className="px-6 py-12 text-center">
                    <h2 className="text-base font-semibold text-slate-900">
                        Couldn&apos;t load buildings
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {error instanceof Error ? error.message : "Please try again."}
                    </p>
                </Card>
            ) : !buildings || buildings.length === 0 ? (
                <Card className="px-6 py-16 text-center">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-indigo-50">
                        <Building2 size={28} className="text-indigo-600" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-slate-900">
                        No buildings yet
                    </h2>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                        You need at least one building before you can add floors.
                    </p>
                    <div className="mt-5">
                        <Link
                            href="/owner/dashboard/buildings"
                            className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Go to buildings
                        </Link>
                    </div>
                </Card>
            ) : !selected ? (
                <Card className="px-6 py-16 text-center">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-indigo-50">
                        <Layers size={28} className="text-indigo-600" />
                    </div>
                    <h2 className="mt-4 text-lg font-semibold text-slate-900">
                        Select a building
                    </h2>
                    <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                        Pick a building from the dropdown above to view and manage its floors.
                    </p>
                </Card>
            ) : (
                <>
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-600">
                            Showing floors in{" "}
                            <Link
                                href={`/owner/dashboard/buildings/${selected.id}`}
                                className="font-medium text-indigo-600 hover:text-indigo-700"
                            >
                                {selected.name}
                            </Link>
                        </p>
                    </div>
                    <FloorsPanel
                        buildingId={selected.id}
                        totalFloors={selected.totalFloors}
                    />
                </>
            )}
        </div>
    );
}

function FloorsPageSkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
        </div>
    );
}
