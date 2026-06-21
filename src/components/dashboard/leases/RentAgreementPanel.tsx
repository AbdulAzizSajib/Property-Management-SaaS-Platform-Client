"use client";

// src/components/dashboard/leases/RentAgreementPanel.tsx
//
// Shows the rent agreement attached to a lease. If none exists, owner
// can draft one. Once both owner + tenant sign, status becomes SIGNED.

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
    useCreateRentAgreement,
    useRentAgreement,
    useSignRentAgreement,
} from "@/src/hooks/useRentAgreement";
import { cn } from "@/src/lib/utils";
import { CheckCircle2, FileText, Loader2, PenLine } from "lucide-react";
import { useState } from "react";

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export function RentAgreementPanel({ leaseId }: { leaseId: string }) {
    const { data, isLoading, isError } = useRentAgreement(leaseId);
    const createMut = useCreateRentAgreement(leaseId);
    const signMut = useSignRentAgreement(leaseId);

    const [drafting, setDrafting] = useState(false);
    const [content, setContent] = useState("");
    const [validFrom, setValidFrom] = useState("");
    const [validUntil, setValidUntil] = useState("");
    const [signing, setSigning] = useState<"owner" | "tenant" | null>(null);
    const [signatureUrl, setSignatureUrl] = useState("");

    if (isLoading) {
        return (
            <div className="rounded-[14px] border border-rule-soft bg-paper p-4">
                <p className="text-[12px] text-ink-soft">Loading agreement…</p>
            </div>
        );
    }

    // No agreement yet — either show draft form or "Create" prompt
    if (isError || !data) {
        if (drafting) {
            return (
                <div className="rounded-[14px] border border-rule-soft bg-paper p-4">
                    <h3 className="text-[15px] font-bold text-jade-950">
                        Draft agreement
                    </h3>
                    <div className="mt-3 space-y-3">
                        <label className="block space-y-1">
                            <span className="text-[12px] font-semibold text-ink">
                                Content
                            </span>
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={6}
                                placeholder="This agreement is between the owner and tenant…"
                            />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <label className="block space-y-1">
                                <span className="text-[12px] font-semibold text-ink">
                                    Valid from
                                </span>
                                <Input
                                    type="date"
                                    value={validFrom}
                                    onChange={(e) =>
                                        setValidFrom(e.target.value)
                                    }
                                />
                            </label>
                            <label className="block space-y-1">
                                <span className="text-[12px] font-semibold text-ink">
                                    Valid until
                                </span>
                                <Input
                                    type="date"
                                    value={validUntil}
                                    onChange={(e) =>
                                        setValidUntil(e.target.value)
                                    }
                                />
                            </label>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setDrafting(false)}
                                disabled={createMut.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={
                                    createMut.isPending ||
                                    !content ||
                                    !validFrom ||
                                    !validUntil
                                }
                                onClick={() =>
                                    createMut.mutate(
                                        {
                                            content: content.trim(),
                                            validFrom: new Date(
                                                validFrom,
                                            ).toISOString(),
                                            validUntil: new Date(
                                                validUntil,
                                            ).toISOString(),
                                        },
                                        {
                                            onSuccess: () => setDrafting(false),
                                        },
                                    )
                                }
                                className="bg-jade-900 text-paper hover:bg-jade-950"
                            >
                                {createMut.isPending ? (
                                    <>
                                        <Loader2
                                            size={14}
                                            className="animate-spin"
                                        />
                                        Saving…
                                    </>
                                ) : (
                                    "Save draft"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="rounded-[14px] border border-dashed border-rule-soft bg-paper p-4 text-center">
                <FileText
                    size={22}
                    className="mx-auto text-ink-soft/60"
                />
                <p className="mt-1.5 text-[13px] font-semibold text-jade-950">
                    No agreement yet
                </p>
                <p className="font-bangla text-[11px] text-ink-soft/75">
                    এই লিজের কোনো এগ্রিমেন্ট নেই
                </p>
                <Button
                    size="sm"
                    onClick={() => setDrafting(true)}
                    className="mt-3 bg-jade-900 text-paper hover:bg-jade-950"
                >
                    <PenLine size={12} />
                    Draft agreement
                </Button>
            </div>
        );
    }

    const ownerSigned = !!data.ownerSignedAt;
    const tenantSigned = !!data.tenantSignedAt;

    return (
        <div className="rounded-[14px] border border-rule-soft bg-paper">
            <div className="flex items-center justify-between border-b border-rule-soft px-4 py-3">
                <div>
                    <h3 className="text-[14.5px] font-bold text-jade-950">
                        Rent agreement
                    </h3>
                    <p className="text-[11px] text-ink-soft">
                        {formatDate(data.validFrom)} →{" "}
                        {formatDate(data.validUntil)}
                    </p>
                </div>
                <span
                    className={cn(
                        "rounded-md border px-1.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.1em]",
                        data.status === "SIGNED"
                            ? "border-jade-100 bg-jade-50 text-jade-700"
                            : data.status === "PARTIALLY_SIGNED"
                                ? "border-coral-100 bg-coral-50/60 text-coral-600"
                                : "border-rule-soft bg-cream text-ink-soft",
                    )}
                >
                    {data.status.replace("_", " ")}
                </span>
            </div>

            <pre className="whitespace-pre-wrap px-4 py-3 text-[12.5px] text-ink">
                {data.content}
            </pre>

            <div className="grid grid-cols-1 gap-2 border-t border-rule-soft p-3 sm:grid-cols-2">
                <SignatureRow
                    role="Owner"
                    bn="মালিক"
                    signed={ownerSigned}
                    signedAt={data.ownerSignedAt}
                    onSign={() => {
                        setSigning("owner");
                        setSignatureUrl("");
                    }}
                />
                <SignatureRow
                    role="Tenant"
                    bn="ভাড়াটিয়া"
                    signed={tenantSigned}
                    signedAt={data.tenantSignedAt}
                    onSign={() => {
                        setSigning("tenant");
                        setSignatureUrl("");
                    }}
                />
            </div>

            {signing && (
                <div className="border-t border-rule-soft bg-cream/40 px-4 py-3">
                    <p className="text-[12px] font-semibold text-ink">
                        Sign as {signing}
                    </p>
                    <Input
                        value={signatureUrl}
                        onChange={(e) => setSignatureUrl(e.target.value)}
                        placeholder="https://example.com/signature.png"
                        className="mt-1.5"
                    />
                    <div className="mt-2 flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSigning(null)}
                            disabled={signMut.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            disabled={signMut.isPending || !signatureUrl}
                            onClick={() =>
                                signMut.mutate(
                                    {
                                        role: signing,
                                        signatureUrl: signatureUrl.trim(),
                                    },
                                    { onSuccess: () => setSigning(null) },
                                )
                            }
                            className="bg-jade-900 text-paper hover:bg-jade-950"
                        >
                            {signMut.isPending ? (
                                <>
                                    <Loader2
                                        size={12}
                                        className="animate-spin"
                                    />
                                    Signing…
                                </>
                            ) : (
                                "Apply signature"
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

function SignatureRow({
    role,
    bn,
    signed,
    signedAt,
    onSign,
}: {
    role: string;
    bn: string;
    signed: boolean;
    signedAt: string | null;
    onSign: () => void;
}) {
    return (
        <div className="flex items-center justify-between rounded-md border border-rule-soft bg-paper px-3 py-2">
            <div>
                <p className="text-[12px] font-semibold text-ink">
                    {role}{" "}
                    <span className="font-bangla text-[10px] text-ink-soft/70">
                        ({bn})
                    </span>
                </p>
                {signed && signedAt ? (
                    <p className="inline-flex items-center gap-1 text-[10.5px] text-jade-700">
                        <CheckCircle2 size={10} />
                        Signed {formatDate(signedAt)}
                    </p>
                ) : (
                    <p className="text-[10.5px] text-ink-soft">Not signed</p>
                )}
            </div>
            {!signed && (
                <Button size="sm" variant="outline" onClick={onSign}>
                    <PenLine size={11} />
                    Sign
                </Button>
            )}
        </div>
    );
}
