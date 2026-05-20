"use client";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface FloorFormValues {
    name: string;
    floorNumber: number;
}

interface FloorFormProps {
    defaultValues?: Partial<FloorFormValues>;
    submitting: boolean;
    submitLabel: string;
    onSubmit: (values: FloorFormValues) => void;
    onCancel?: () => void;
}

export function FloorForm({
    defaultValues,
    submitting,
    submitLabel,
    onSubmit,
    onCancel,
}: FloorFormProps) {
    const [values, setValues] = useState<FloorFormValues>({
        name: defaultValues?.name ?? "",
        floorNumber: defaultValues?.floorNumber ?? 1,
    });

    useEffect(() => {
        if (defaultValues) {
            setValues({
                name: defaultValues.name ?? "",
                floorNumber: defaultValues.floorNumber ?? 1,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)]);

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        onSubmit({
            name: values.name.trim(),
            floorNumber: Number(values.floorNumber),
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="floor-name">
                        Floor name <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                        id="floor-name"
                        value={values.name}
                        onChange={(e) =>
                            setValues((v) => ({ ...v, name: e.target.value }))
                        }
                        placeholder="1st Floor"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="floor-number">
                        Floor # <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                        id="floor-number"
                        type="number"
                        min={0}
                        value={values.floorNumber}
                        onChange={(e) =>
                            setValues((v) => ({
                                ...v,
                                floorNumber: Number(e.target.value),
                            }))
                        }
                        required
                    />
                    <p className="text-[11px] text-slate-500">Use 0 for ground floor</p>
                </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={submitting}>
                    {submitting ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Saving...
                        </>
                    ) : (
                        submitLabel
                    )}
                </Button>
            </div>
        </form>
    );
}
