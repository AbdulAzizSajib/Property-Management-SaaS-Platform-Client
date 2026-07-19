"use client";

// src/components/dashboard/forms/form-primitives.tsx
//
// Shared atoms for every form in the dashboard. Keeps BuildingForm, FloorForm,
// UnitForm (and anything new) visually identical without copy-pasting Tailwind
// strings. If you need to tune form styling, do it here once.

import { Label } from "@/src/components/ui/label";
import { Loader2 } from "lucide-react";

/**
 * Applied to every shadcn Input / Textarea / SelectTrigger in our forms.
 * Replaces the default indigo focus ring with jade.
 */
export const fieldClass =
  "border-rule-soft bg-paper text-ink placeholder:text-ink-soft/55 " +
  "focus-visible:border-jade-700 focus-visible:ring-2 focus-visible:ring-jade-700/20";

interface FieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

export function Field({
  label,
  htmlFor,
  required,
  hint,
  className,
  children,
}: FieldProps) {
  const id = htmlFor ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label htmlFor={id} className="text-[12.5px] font-semibold text-ink">
        {label}
        {required && (
          <span className="ml-1 text-coral-600" aria-label="required">
            *
          </span>
        )}
      </Label>
      {children}
      {hint && <p className="text-[11.5px] text-ink-soft/85">{hint}</p>}
    </div>
  );
}

interface FormActionsProps {
  submitting: boolean;
  submitLabel: string;
  onCancel?: () => void;
}

export function FormActions({
  submitting,
  submitLabel,
  onCancel,
}: FormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2  pt-2">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="inline-flex h-9 items-center rounded-[8px] border border-rule-soft bg-paper px-4 text-[13px] font-medium text-ink-soft transition-colors hover:border-jade-700/30 hover:text-jade-900 disabled:opacity-50"
        >
          Cancel
        </button>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-9 items-center gap-1.5 rounded-[8px] bg-jade-900 px-4 text-[13px] font-semibold text-paper transition-colors hover:bg-jade-950 disabled:opacity-70"
      >
        {submitting ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Saving…
          </>
        ) : (
          submitLabel
        )}
      </button>
    </div>
  );
}
