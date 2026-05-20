"use client";

import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export interface TenantFormValues {
    name: string;
    phone: string;
    email: string;
    nidNumber: string;
    occupation: string;
    emergencyContact: string;
    emergencyName: string;
    permanentAddress: string;
    photoUrl: string;
    // Create-only:
    createLoginAccount: boolean;
    password: string;
}

const emptyForm: TenantFormValues = {
    name: "",
    phone: "",
    email: "",
    nidNumber: "",
    occupation: "",
    emergencyContact: "",
    emergencyName: "",
    permanentAddress: "",
    photoUrl: "",
    createLoginAccount: false,
    password: "",
};

interface TenantFormProps {
    mode: "create" | "edit";
    defaultValues?: Partial<TenantFormValues>;
    submitting: boolean;
    submitLabel: string;
    onSubmit: (values: TenantFormValues) => void;
    onCancel?: () => void;
}

export function TenantForm({
    mode,
    defaultValues,
    submitting,
    submitLabel,
    onSubmit,
    onCancel,
}: TenantFormProps) {
    const [values, setValues] = useState<TenantFormValues>({
        ...emptyForm,
        ...defaultValues,
    });

    useEffect(() => {
        if (defaultValues) {
            setValues((prev) => ({ ...prev, ...defaultValues }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)]);

    function set<K extends keyof TenantFormValues>(
        key: K,
        value: TenantFormValues[K],
    ) {
        setValues((v) => ({ ...v, [key]: value }));
    }

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        onSubmit(values);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Identity */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Identity
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="t-name">
                            Full name <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                            id="t-name"
                            value={values.name}
                            onChange={(e) => set("name", e.target.value)}
                            placeholder="Rahim Uddin"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="t-phone">
                            Phone <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                            id="t-phone"
                            type="tel"
                            value={values.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            placeholder="01711000333"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="t-email">Email</Label>
                        <Input
                            id="t-email"
                            type="email"
                            value={values.email}
                            onChange={(e) => set("email", e.target.value)}
                            placeholder="rahim@example.com"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="t-nid">NID number</Label>
                        <Input
                            id="t-nid"
                            value={values.nidNumber}
                            onChange={(e) => set("nidNumber", e.target.value)}
                            placeholder="1234567890"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="t-occupation">Occupation</Label>
                        <Input
                            id="t-occupation"
                            value={values.occupation}
                            onChange={(e) => set("occupation", e.target.value)}
                            placeholder="Software Engineer"
                        />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="t-photo">Photo URL</Label>
                        <Input
                            id="t-photo"
                            type="url"
                            value={values.photoUrl}
                            onChange={(e) => set("photoUrl", e.target.value)}
                            placeholder="https://example.com/photo.jpg"
                        />
                    </div>
                </div>
            </div>

            {/* Emergency contact */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Emergency contact
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="t-em-name">Name</Label>
                        <Input
                            id="t-em-name"
                            value={values.emergencyName}
                            onChange={(e) => set("emergencyName", e.target.value)}
                            placeholder="Karim Uddin"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="t-em-phone">Phone</Label>
                        <Input
                            id="t-em-phone"
                            type="tel"
                            value={values.emergencyContact}
                            onChange={(e) => set("emergencyContact", e.target.value)}
                            placeholder="01711000444"
                        />
                    </div>
                </div>
            </div>

            {/* Address */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Address
                </h3>
                <div className="space-y-1.5">
                    <Label htmlFor="t-address">Permanent address</Label>
                    <Textarea
                        id="t-address"
                        rows={2}
                        value={values.permanentAddress}
                        onChange={(e) => set("permanentAddress", e.target.value)}
                        placeholder="Lalmatia, Dhaka"
                    />
                </div>
            </div>

            {/* Login account (create-only) */}
            {mode === "create" && (
                <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <label className="flex cursor-pointer items-start gap-3">
                        <Checkbox
                            checked={values.createLoginAccount}
                            onCheckedChange={(checked) =>
                                set("createLoginAccount", checked === true)
                            }
                            className="mt-0.5"
                        />
                        <div className="space-y-0.5">
                            <p className="text-sm font-medium text-slate-800">
                                Create tenant login account
                            </p>
                            <p className="text-xs text-slate-500">
                                Lets this tenant sign in to the tenant portal to see invoices and
                                pay rent. Requires email above.
                            </p>
                        </div>
                    </label>

                    {values.createLoginAccount && (
                        <div className="space-y-1.5 pl-7">
                            <Label htmlFor="t-password">
                                Initial password <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="t-password"
                                type="text"
                                value={values.password}
                                onChange={(e) => set("password", e.target.value)}
                                placeholder="Minimum 8 characters"
                                required={values.createLoginAccount}
                                minLength={8}
                            />
                            <p className="text-[11px] text-slate-500">
                                Share securely with the tenant. They&apos;ll be prompted to
                                change it on first sign-in.
                            </p>
                        </div>
                    )}
                </div>
            )}

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

/**
 * Build a CreateTenantPayload from form values: trim strings, omit empty optionals.
 */
export function buildCreateTenantPayload(values: TenantFormValues) {
    return {
        name: values.name.trim(),
        phone: values.phone.trim(),
        ...(values.email.trim() && { email: values.email.trim() }),
        ...(values.nidNumber.trim() && { nidNumber: values.nidNumber.trim() }),
        ...(values.occupation.trim() && { occupation: values.occupation.trim() }),
        ...(values.emergencyContact.trim() && {
            emergencyContact: values.emergencyContact.trim(),
        }),
        ...(values.emergencyName.trim() && {
            emergencyName: values.emergencyName.trim(),
        }),
        ...(values.permanentAddress.trim() && {
            permanentAddress: values.permanentAddress.trim(),
        }),
        ...(values.photoUrl.trim() && { photoUrl: values.photoUrl.trim() }),
        createLoginAccount: values.createLoginAccount,
        ...(values.createLoginAccount && { password: values.password }),
    };
}
