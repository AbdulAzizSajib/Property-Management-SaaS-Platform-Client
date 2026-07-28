"use client";

// src/components/dashboard/floors/FloorForm.tsx

import {
    Field,
    FormActions,
    fieldClass,
} from "@/src/components/dashboard/forms/form-primitives";
import { Input } from "@/src/components/ui/input";
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

    const isGround = values.floorNumber === 0;

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
                <Field
                    label="Floor name"
                    htmlFor="floor-name"
                    required
                    className="sm:col-span-2"
                >
                    <Input
                        id="floor-name"
                        value={values.name}
                        onChange={(e) =>
                            setValues((v) => ({ ...v, name: e.target.value }))
                        }
                        placeholder={isGround ? "Ground floor" : "1st floor"}
                        required
                        className={fieldClass}
                    />
                </Field>

                <Field
                    label="Floor #"
                    htmlFor="floor-number"
                    required
                    hint={
                        isGround
                            ? "0 = ground floor"
                            : "Use 0 for ground floor"
                    }
                >
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
                        className={`${fieldClass} tabular-nums`}
                    />
                </Field>
            </div>

            <FormActions
                submitting={submitting}
                submitLabel={submitLabel}
                onCancel={onCancel}
            />
        </form>
    );
}