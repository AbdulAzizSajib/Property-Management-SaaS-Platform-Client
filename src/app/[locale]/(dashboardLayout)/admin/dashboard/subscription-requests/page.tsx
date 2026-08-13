"use client";

import { Skeleton } from "@/src/components/ui/skeleton";
import {
  useApproveSubscriptionRequest,
  useRejectSubscriptionRequest,
  useSubscriptionRequests,
} from "@/src/hooks/useSubscriptionRequests";
import { cn } from "@/src/lib/utils";
import type {
  AdminSubscriptionRequest,
  SubscriptionRequestStatus,
} from "@/src/types/subscriptionRequest.types";
import { Check, Clock, Loader2, X } from "lucide-react";
import { useState } from "react";

const FILTERS: { value: SubscriptionRequestStatus | "ALL"; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "ALL", label: "All" },
];

const statusChip: Record<SubscriptionRequestStatus, string> = {
  PENDING: "bg-coral-50 text-coral-600 border-coral-100",
  APPROVED: "bg-jade-50 text-jade-800 border-jade-100",
  REJECTED: "bg-cream text-ink-soft border-rule-soft",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(n);

export default function AdminSubscriptionRequestsPage() {
  const [filter, setFilter] = useState<SubscriptionRequestStatus | "ALL">(
    "PENDING",
  );
  const { data: requests, isLoading } = useSubscriptionRequests(
    filter === "ALL" ? undefined : filter,
  );
  const approve = useApproveSubscriptionRequest();
  const reject = useRejectSubscriptionRequest();

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-[1080px] space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header>
          <p className="font-serif text-[13px] italic text-coral-600/85">
            Manual payments
          </p>
          <h1 className="mt-0.5 text-[28px] font-bold tracking-[-0.02em] text-jade-950 sm:text-[30px]">
            Subscription payment requests
          </h1>
          <p className="mt-1 text-[13px] text-ink-soft">
            Verify the bKash transaction, then approve to activate the plan.
          </p>
        </header>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-[9px] border px-3 py-1.5 text-[12.5px] font-medium transition-colors",
                filter === f.value
                  ? "border-jade-700 bg-sky-950 text-paper"
                  : "border-rule-soft bg-paper text-ink-soft hover:text-jade-900",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-[14px] bg-paper" />
            ))}
          </div>
        ) : !requests || requests.length === 0 ? (
          <div className="rounded-[14px] border border-rule-soft bg-paper px-6 py-16 text-center">
            <p className="text-[13.5px] text-ink-soft">
              No {filter === "ALL" ? "" : filter.toLowerCase()} requests.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {requests.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                approving={
                  approve.isPending && approve.variables?.id === r.id
                }
                rejecting={reject.isPending && reject.variables?.id === r.id}
                onApprove={() => {
                  if (
                    window.confirm(
                      `Activate the ${r.targetPlan} plan for ${r.organization.name}? Make sure the payment is verified.`,
                    )
                  ) {
                    approve.mutate({ id: r.id, payload: {} });
                  }
                }}
                onReject={() => {
                  const note = window.prompt(
                    "Reason for rejecting this request?",
                  );
                  if (note && note.trim().length >= 3) {
                    reject.mutate({ id: r.id, payload: { note: note.trim() } });
                  }
                }}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function RequestCard({
  request: r,
  approving,
  rejecting,
  onApprove,
  onReject,
}: {
  request: AdminSubscriptionRequest;
  approving: boolean;
  rejecting: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  const isPending = r.status === "PENDING";
  return (
    <li className="rounded-[14px] border border-rule-soft bg-paper p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[15px] font-bold text-jade-950">
              {r.organization.name}
            </h3>
            <span
              className={cn(
                "rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                statusChip[r.status],
              )}
            >
              {r.status}
            </span>
          </div>

          <p className="mt-1 text-[13px] text-ink-soft">
            Wants{" "}
            <span className="font-semibold text-ink">{r.targetPlan}</span> ·{" "}
            <span className="font-semibold text-jade-900 tabular-nums">
              {fmt(Number(r.amount))}
            </span>
          </p>

          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] sm:grid-cols-4">
            <Detail label="Method" value={r.method} />
            <Detail label="Sender" value={r.senderNumber ?? "—"} mono />
            <Detail label="TrxID" value={r.transactionId ?? "—"} mono />
            <Detail
              label="Submitted"
              value={new Date(r.createdAt).toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          </div>

          {r.requestedBy && (
            <p className="mt-2 text-[11px] text-ink-soft/75">
              by {r.requestedBy.name} · {r.requestedBy.email}
            </p>
          )}
          {r.reviewNote && (
            <p className="mt-2 rounded-[8px] border-l-[2.5px] border-rule-soft bg-cream/60 px-2.5 py-1.5 text-[11.5px] text-ink-soft">
              Note: {r.reviewNote}
            </p>
          )}
        </div>

        {isPending && (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              disabled={approving || rejecting}
              onClick={onReject}
              className="inline-flex h-9 items-center gap-1.5 rounded-[9px] border border-coral-200 bg-coral-50/60 px-3 text-[12.5px] font-semibold text-coral-600 transition-colors hover:bg-coral-50 disabled:opacity-60"
            >
              {rejecting ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <X size={13} />
              )}
              Reject
            </button>
            <button
              type="button"
              disabled={approving || rejecting}
              onClick={onApprove}
              className="inline-flex h-9 items-center gap-1.5 rounded-[9px] bg-sky-950 px-3.5 text-[12.5px] font-semibold text-paper transition-colors hover:bg-sky-950 disabled:opacity-60"
            >
              {approving ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Check size={13} />
              )}
              Approve &amp; activate
            </button>
          </div>
        )}
        {!isPending && (
          <span className="inline-flex shrink-0 items-center gap-1 text-[11.5px] text-ink-soft">
            <Clock size={12} />
            {r.reviewedAt
              ? `Reviewed ${new Date(r.reviewedAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}`
              : ""}
          </span>
        )}
      </div>
    </li>
  );
}

function Detail({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-ink-soft/70">
        {label}
      </p>
      <p
        className={cn(
          "mt-0.5 truncate text-ink",
          mono ? "font-mono tabular-nums" : "",
        )}
      >
        {value}
      </p>
    </div>
  );
}
