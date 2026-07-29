"use client";

// src/components/dashboard/expenses/RecordExpenseDialog.tsx
//
// Shared dialog for creating AND editing expenses.
// Pass `expense` to switch into edit mode; omit it for create mode.

import {
    Field,
    FormActions,
    fieldClass,
} from "@/src/components/dashboard/forms/form-primitives";
import {
    BuildingFloorUnitSelect,
    type BuildingFloorUnitValue,
} from "@/src/components/dashboard/forms/BuildingFloorUnitSelect";
import { toDateInputValue } from "@/src/components/dashboard/expenses/expenseStyles";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Textarea } from "@/src/components/ui/textarea";
import {
    useCreateExpense,
    useUpdateExpense,
} from "@/src/hooks/useExpenses";
import {
    EXPENSE_CATEGORY_OPTIONS,
    type Expense,
    type ExpenseCategory,
} from "@/src/types/expense.types";
import {
    PAYMENT_METHOD_OPTIONS,
    type PaymentMethod,
} from "@/src/types/payment.types";
import { useEffect, useState } from "react";

const EMPTY_LOCATION: BuildingFloorUnitValue = {
    buildingId: "",
    floorId: "",
    unitId: "",
};

interface RecordExpenseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Pass to enter edit mode. Omit for create. */
    expense?: Expense;
}

export function RecordExpenseDialog({
    open,
    onOpenChange,
    expense,
}: RecordExpenseDialogProps) {
    const isEdit = !!expense;

    const createMutation = useCreateExpense();
    const updateMutation = useUpdateExpense(expense?.id ?? "");

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState<ExpenseCategory>("ELECTRICITY");
    const [amount, setAmount] = useState("");
    const [expenseDate, setExpenseDate] = useState(toDateInputValue(new Date()));
    const [paidTo, setPaidTo] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
    const [notes, setNotes] = useState("");
    const [location, setLocation] = useState<BuildingFloorUnitValue>(EMPTY_LOCATION);

    // Reset / hydrate when the dialog opens
    useEffect(() => {
        if (!open) return;

        if (expense) {
            setTitle(expense.title);
            setCategory(expense.category);
            setAmount(String(expense.amount));
            setExpenseDate(toDateInputValue(expense.expenseDate));
            setPaidTo(expense.paidTo ?? "");
            setPaymentMethod(expense.paymentMethod);
            setNotes(expense.notes ?? "");
            setLocation({
                buildingId: expense.buildingId ?? "",
                // The floor isn't stored on Expense — it's only used here to
                // narrow the unit list, so there's nothing to hydrate it from.
                floorId: "",
                unitId: expense.unitId ?? "",
            });
        } else {
            setTitle("");
            setCategory("ELECTRICITY");
            setAmount("");
            setExpenseDate(toDateInputValue(new Date()));
            setPaidTo("");
            setPaymentMethod("CASH");
            setNotes("");
            setLocation(EMPTY_LOCATION);
        }
    }, [open, expense]);

    const mutation = isEdit ? updateMutation : createMutation;

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();

        const isoDate = new Date(`${expenseDate}T00:00:00.000Z`).toISOString();

        const payload = {
            title: title.trim(),
            category,
            amount: Number(amount),
            expenseDate: isoDate,
            paymentMethod,
            ...(paidTo.trim() && { paidTo: paidTo.trim() }),
            ...(notes.trim() && { notes: notes.trim() }),
            buildingId: location.buildingId || undefined,
            unitId: location.unitId || undefined,
        };

        if (isEdit) {
            updateMutation.mutate(payload, {
                onSuccess: () => onOpenChange(false),
            });
        } else {
            createMutation.mutate(payload, {
                onSuccess: () => onOpenChange(false),
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-jade-950">
                        {isEdit ? "Edit expense" : "Record expense"}
                    </DialogTitle>
                    <DialogDescription className="text-ink-soft">
                        {isEdit
                            ? "Update the details of this expense."
                            : "Log an operational cost — utility bill, repair, salary, fuel, etc."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Field label="Title" htmlFor="e-title" required>
                        <Input
                            id="e-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Generator fuel - June"
                            required
                            className={fieldClass}
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Category" htmlFor="e-category" required>
                            <Select
                                value={category}
                                onValueChange={(v) =>
                                    setCategory(
                                        (v ?? "ELECTRICITY") as ExpenseCategory,
                                    )
                                }
                            >
                                <SelectTrigger
                                    id="e-category"
                                    className={`w-full ${fieldClass}`}
                                >
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {EXPENSE_CATEGORY_OPTIONS.map((opt) => (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>

                        <Field
                            label="Amount"
                            htmlFor="e-amount"
                            required
                            hint="BDT"
                        >
                            <MoneyInput
                                id="e-amount"
                                value={amount}
                                onChange={setAmount}
                                placeholder="4,500"
                                required
                            />
                        </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Expense date" htmlFor="e-date" required>
                            <Input
                                id="e-date"
                                type="date"
                                value={expenseDate}
                                onChange={(e) => setExpenseDate(e.target.value)}
                                required
                                className={`${fieldClass} tabular-nums`}
                            />
                        </Field>

                        <Field
                            label="Payment method"
                            htmlFor="e-method"
                            required
                        >
                            <Select
                                value={paymentMethod}
                                onValueChange={(v) =>
                                    setPaymentMethod(
                                        (v ?? "CASH") as PaymentMethod,
                                    )
                                }
                            >
                                <SelectTrigger
                                    id="e-method"
                                    className={`w-full ${fieldClass}`}
                                >
                                    <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PAYMENT_METHOD_OPTIONS.map((opt) => (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </div>

                    <Field
                        label="Paid to"
                        htmlFor="e-paid-to"
                        hint="Vendor / payee · optional"
                    >
                        <Input
                            id="e-paid-to"
                            value={paidTo}
                            onChange={(e) => setPaidTo(e.target.value)}
                            placeholder="Meghna Oil Depot"
                            className={fieldClass}
                        />
                    </Field>

                    <div className="space-y-1.5">
                        <p className="text-[12.5px] font-semibold text-ink">
                            Building / floor / unit
                        </p>
                        <BuildingFloorUnitSelect
                            value={location}
                            onChange={setLocation}
                            idPrefix="e"
                        />
                        <p className="text-[11.5px] text-ink-soft/85">
                            Tie this expense to a specific building or unit ·
                            all optional. Floor only narrows the unit list.
                        </p>
                    </div>

                    <Field label="Notes" htmlFor="e-notes">
                        <Textarea
                            id="e-notes"
                            rows={2}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Monthly refuel…"
                            className={`${fieldClass} resize-none`}
                        />
                    </Field>

                    <FormActions
                        submitting={mutation.isPending}
                        submitLabel={isEdit ? "Save changes" : "Record expense"}
                        onCancel={() => onOpenChange(false)}
                    />
                </form>
            </DialogContent>
        </Dialog>
    );
}

function MoneyInput({
    id,
    value,
    onChange,
    placeholder,
    required,
}: {
    id: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    required?: boolean;
}) {
    return (
        <div className="relative">
            <span
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-ink-soft"
            >
                ৳
            </span>
            <Input
                id={id}
                type="number"
                min={0}
                step="any"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                className={`${fieldClass} pl-7 tabular-nums`}
            />
        </div>
    );
}
