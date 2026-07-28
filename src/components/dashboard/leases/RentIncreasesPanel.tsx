"use client";

// src/components/dashboard/leases/RentIncreasesPanel.tsx
//
// Lists rent increases for a lease + lets owner/manager record a new one.

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
    useCreateRentIncrease,
    useRentIncreases,
} from "@/src/hooks/useRentIncreases";
import { ArrowUpRight, Loader2, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

const fmtMoney = (n: number) =>
    new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 0,
    }).format(n);

export function RentIncreasesPanel({
    leaseId,
    currentRent,
}: {
    leaseId: string;
    /** Current monthly rent on the lease (Prisma Decimal string). */
    currentRent: string;
}) {
    const { data, isLoading } = useRentIncreases(leaseId);
    const createMut = useCreateRentIncrease(leaseId);
    const [open, setOpen] = useState(false);
    const [newRent, setNewRent] = useState("");
    const [effectiveFrom, setEffectiveFrom] = useState("");
    const [reason, setReason] = useState("");

    const submit = () => {
        if (!newRent || !effectiveFrom) return;
        createMut.mutate(
            {
                newRent: Number(newRent),
                effectiveFrom: new Date(effectiveFrom).toISOString(),
                ...(reason.trim() && { reason: reason.trim() }),
            },
            {
                onSuccess: () => {
                    setOpen(false);
                    setNewRent("");
                    setEffectiveFrom("");
                    setReason("");
                },
            },
        );
    };

    return (
        <div className="rounded-[14px] border border-rule-soft bg-paper">
            <div className="flex items-center justify-between border-b border-rule-soft px-4 py-3">
                <div>
                    <h3 className="text-[14.5px] font-bold text-jade-950">
                        Rent increases
                    </h3>
                </div>
                <Button
                    size="sm"
                    onClick={() => setOpen((v) => !v)}
                    className="bg-jade-900 text-paper hover:bg-jade-950"
                >
                    <Plus size={12} />
                    {open ? "Cancel" : "Record"}
                </Button>
            </div>

            {open && (
                <div className="space-y-2.5 border-b border-rule-soft bg-cream/40 px-4 py-3">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block space-y-1">
                            <span className="text-[12px] font-semibold text-ink">
                                New rent (BDT)
                            </span>
                            <Input
                                type="number"
                                min={0}
                                value={newRent}
                                onChange={(e) => setNewRent(e.target.value)}
                                placeholder={`> ${parseFloat(currentRent)}`}
                            />
                        </label>
                        <label className="block space-y-1">
                            <span className="text-[12px] font-semibold text-ink">
                                Effective from
                            </span>
                            <Input
                                type="date"
                                value={effectiveFrom}
                                onChange={(e) =>
                                    setEffectiveFrom(e.target.value)
                                }
                            />
                        </label>
                    </div>
                    <label className="block space-y-1">
                        <span className="text-[12px] font-semibold text-ink">
                            Reason (optional)
                        </span>
                        <Textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={2}
                            placeholder="Annual rent revision per agreement clause…"
                        />
                    </label>
                    <Button
                        size="sm"
                        disabled={
                            createMut.isPending || !newRent || !effectiveFrom
                        }
                        onClick={submit}
                        className="bg-jade-900 text-paper hover:bg-jade-950"
                    >
                        {createMut.isPending ? (
                            <>
                                <Loader2 size={12} className="animate-spin" />
                                Recording…
                            </>
                        ) : (
                            "Record increase"
                        )}
                    </Button>
                </div>
            )}

            {isLoading ? (
                <p className="px-4 py-4 text-[12px] text-ink-soft">Loading…</p>
            ) : !data || data.length === 0 ? (
                <p className="px-4 py-6 text-center text-[12.5px] text-ink-soft">
                    No rent increases recorded yet.
                </p>
            ) : (
                <ul className="divide-y divide-rule-soft">
                    {data.map((r) => (
                        <li key={r.id} className="flex gap-3 px-4 py-2.5">
                            <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-jade-50 text-jade-700">
                                <TrendingUp size={13} />
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-[13px] font-semibold text-ink">
                                    {fmtMoney(parseFloat(r.previousRent))}
                                    <ArrowUpRight
                                        size={11}
                                        className="mx-1 inline text-jade-700"
                                    />
                                    {fmtMoney(parseFloat(r.newRent))}
                                </p>
                                <p className="text-[11px] text-ink-soft">
                                    Effective {formatDate(r.effectiveFrom)} ·{" "}
                                    {r.createdBy?.name ?? "—"}
                                </p>
                                {r.reason && (
                                    <p className="mt-0.5 text-[11.5px] text-ink-soft">
                                        {r.reason}
                                    </p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
