"use client";

import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { useBuildings } from "@/src/hooks/useBuildings";
import { useUnits } from "@/src/hooks/useUnits";
import type { TenantListItem } from "@/src/types/tenant.types";
import type {
    CreateTenantFormPayload,
    UpdateTenantFormPayload,
} from "@/src/types/tenantForm.types";
import { Loader2, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

export interface FamilyMemberRow {
    name: string;
    age: string;
    occupation: string;
    contactNumber: string;
}

export interface TenantFormValues {
    tenantId: string;
    name: string;
    fatherName: string;
    motherName: string;
    dateOfBirth: string;
    maritalStatus: string;
    parmanentAddress: string;
    occupationAndAddress: string;
    religion: string;
    educationalQualification: string;
    phone: string;
    email: string;
    nidNumber: string;
    passportNumber: string;
    reasonForMoving: string;
    rentDate: string;
    submittedToPolice: boolean;

    division: string;
    thana: string;
    flatFloor: string;
    houseNo: string;
    roadNo: string;
    areaName: string;
    postCode: string;

    emName: string;
    emPhone: string;
    emAddress: string;
    emRelationship: string;

    maidName: string;
    maidNid: string;
    maidContact: string;
    maidAddress: string;

    driverName: string;
    driverNid: string;
    driverContact: string;
    driverAddress: string;

    presentOwnerName: string;
    presentOwnerContact: string;
    presentOwnerAddress: string;
    previousOwnerName: string;
    previousOwnerContact: string;
    previousOwnerAddress: string;

    familyMembers: FamilyMemberRow[];
}

const emptyFamilyRow: FamilyMemberRow = {
    name: "",
    age: "",
    occupation: "",
    contactNumber: "",
};

const emptyForm: TenantFormValues = {
    tenantId: "",
    name: "",
    fatherName: "",
    motherName: "",
    dateOfBirth: "",
    maritalStatus: "",
    parmanentAddress: "",
    occupationAndAddress: "",
    religion: "",
    educationalQualification: "",
    phone: "",
    email: "",
    nidNumber: "",
    passportNumber: "",
    reasonForMoving: "",
    rentDate: "",
    submittedToPolice: false,

    division: "",
    thana: "",
    flatFloor: "",
    houseNo: "",
    roadNo: "",
    areaName: "",
    postCode: "",

    emName: "",
    emPhone: "",
    emAddress: "",
    emRelationship: "",

    maidName: "",
    maidNid: "",
    maidContact: "",
    maidAddress: "",

    driverName: "",
    driverNid: "",
    driverContact: "",
    driverAddress: "",

    presentOwnerName: "",
    presentOwnerContact: "",
    presentOwnerAddress: "",
    previousOwnerName: "",
    previousOwnerContact: "",
    previousOwnerAddress: "",

    familyMembers: [
        { ...emptyFamilyRow },
        { ...emptyFamilyRow },
        { ...emptyFamilyRow },
    ],
};

interface TenantFormFormProps {
    mode: "create" | "edit";
    defaultValues?: Partial<TenantFormValues>;
    /** Tenants to pick from — only needed in create mode. */
    tenants?: TenantListItem[];
    submitting: boolean;
    submitLabel: string;
    onSubmit: (values: TenantFormValues) => void;
    onCancel?: () => void;
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {children}
    </h3>
);

export function TenantFormForm({
    mode,
    defaultValues,
    tenants,
    submitting,
    submitLabel,
    onSubmit,
    onCancel,
}: TenantFormFormProps) {
    const tr = useTranslations("tenantFormForm");
    const [values, setValues] = useState<TenantFormValues>({
        ...emptyForm,
        ...defaultValues,
    });

    // Two-step tenant picker (create mode): pick a building first, then the
    // tenant dropdown is narrowed to just the tenants leasing a unit in it.
    const [buildingId, setBuildingId] = useState("");
    const { data: buildings } = useBuildings();
    // Server-side filter to the chosen building; skipped until one is picked.
    const { data: buildingUnits } = useUnits(
        buildingId ? { buildingId } : undefined,
    );

    // tenantIds that hold a lease in the selected building's units.
    const buildingTenantIds = useMemo(() => {
        if (!buildingId) return null; // null = "no building chosen yet"
        const ids = new Set<string>();
        (buildingUnits ?? []).forEach((u) =>
            u.leases.forEach((l) => ids.add(l.tenantId)),
        );
        return ids;
    }, [buildingId, buildingUnits]);

    // The tenants shown in the dropdown, after the building filter.
    const filteredTenants = useMemo(() => {
        const all = tenants ?? [];
        if (!buildingTenantIds) return all;
        return all.filter((t) => buildingTenantIds.has(t.id));
    }, [tenants, buildingTenantIds]);

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

    function setFamily(
        index: number,
        key: keyof FamilyMemberRow,
        value: string,
    ) {
        setValues((v) => ({
            ...v,
            familyMembers: v.familyMembers.map((row, i) =>
                i === index ? { ...row, [key]: value } : row,
            ),
        }));
    }

    function addFamilyRow() {
        setValues((v) => ({
            ...v,
            familyMembers: [...v.familyMembers, { ...emptyFamilyRow }],
        }));
    }

    function removeFamilyRow(index: number) {
        setValues((v) => ({
            ...v,
            familyMembers: v.familyMembers.filter((_, i) => i !== index),
        }));
    }

    function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        onSubmit(values);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tenant link (create only) — building first, then tenant */}
            {mode === "create" && (
                <div className="space-y-3">
                    <SectionTitle>{tr("sectionTenant")}</SectionTitle>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Step 1: pick a building */}
                        <div className="space-y-1.5">
                            <Label htmlFor="tf-building">
                                {tr("building")}{" "}
                                <span className="text-rose-500">*</span>
                            </Label>
                            <select
                                id="tf-building"
                                value={buildingId}
                                onChange={(e) => {
                                    setBuildingId(e.target.value);
                                    // Clear a tenant that no longer belongs to
                                    // the newly selected building.
                                    set("tenantId", "");
                                }}
                                className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:border-jade-700 focus:outline-none focus:ring-2 focus:ring-jade-700/20"
                            >
                                <option value="">{tr("allBuildings")}</option>
                                {(buildings ?? []).map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-[11px] text-slate-500">
                                {tr("buildingHint")}
                            </p>
                        </div>

                        {/* Step 2: pick a tenant (narrowed by building) */}
                        <div className="space-y-1.5">
                            <Label htmlFor="tf-tenant">
                                {tr("linkedTenant")}{" "}
                                <span className="text-rose-500">*</span>
                            </Label>
                            <select
                                id="tf-tenant"
                                value={values.tenantId}
                                onChange={(e) =>
                                    set("tenantId", e.target.value)
                                }
                                required
                                className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:border-jade-700 focus:outline-none focus:ring-2 focus:ring-jade-700/20"
                            >
                                <option value="" disabled>
                                    {filteredTenants.length === 0
                                        ? tr("noTenantsInBuilding")
                                        : tr("selectTenant")}
                                </option>
                                {filteredTenants.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name} — {t.phone}
                                    </option>
                                ))}
                            </select>
                            <p className="text-[11px] text-slate-500">
                                {tr("linkedTenantHint")}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Police form header + property address */}
            <div className="space-y-3">
                <SectionTitle>{tr("sectionPolice")}</SectionTitle>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="tf-division">{tr("division")}</Label>
                        <Input
                            id="tf-division"
                            value={values.division}
                            onChange={(e) => set("division", e.target.value)}
                            placeholder="Dhaka"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="tf-thana">{tr("thana")}</Label>
                        <Input
                            id="tf-thana"
                            value={values.thana}
                            onChange={(e) => set("thana", e.target.value)}
                            placeholder="Gulshan"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="tf-flat">{tr("flatFloor")}</Label>
                        <Input
                            id="tf-flat"
                            value={values.flatFloor}
                            onChange={(e) => set("flatFloor", e.target.value)}
                            placeholder="B-4 / 3rd"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="tf-house">{tr("house")}</Label>
                        <Input
                            id="tf-house"
                            value={values.houseNo}
                            onChange={(e) => set("houseNo", e.target.value)}
                            placeholder="12"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="tf-road">{tr("road")}</Label>
                        <Input
                            id="tf-road"
                            value={values.roadNo}
                            onChange={(e) => set("roadNo", e.target.value)}
                            placeholder="7/A"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="tf-area">{tr("area")}</Label>
                        <Input
                            id="tf-area"
                            value={values.areaName}
                            onChange={(e) => set("areaName", e.target.value)}
                            placeholder="Banani"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="tf-postcode">{tr("postCode")}</Label>
                        <Input
                            id="tf-postcode"
                            value={values.postCode}
                            onChange={(e) => set("postCode", e.target.value)}
                            placeholder="1213"
                        />
                    </div>
                </div>
            </div>

            {/* Personal info */}
            <div className="space-y-3">
                <SectionTitle>{tr("sectionPersonal")}</SectionTitle>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="tf-name">
                            {tr("fullName")}{" "}
                            <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                            id="tf-name"
                            value={values.name}
                            onChange={(e) => set("name", e.target.value)}
                            placeholder="Karim Rahman"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="tf-father">
                            {tr("fatherName")}{" "}
                            <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                            id="tf-father"
                            value={values.fatherName}
                            onChange={(e) => set("fatherName", e.target.value)}
                            placeholder="Abdul Rahman"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="tf-mother">{tr("motherName")}</Label>
                        <Input
                            id="tf-mother"
                            value={values.motherName}
                            onChange={(e) => set("motherName", e.target.value)}
                            placeholder="Ayesha Begum"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="tf-dob">{tr("dateOfBirth")}</Label>
                        <Input
                            id="tf-dob"
                            type="date"
                            value={values.dateOfBirth}
                            onChange={(e) => set("dateOfBirth", e.target.value)}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="tf-marital">
                            {tr("maritalStatus")}
                        </Label>
                        <Input
                            id="tf-marital"
                            value={values.maritalStatus}
                            onChange={(e) =>
                                set("maritalStatus", e.target.value)
                            }
                            placeholder="Married"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="tf-religion">{tr("religion")}</Label>
                        <Input
                            id="tf-religion"
                            value={values.religion}
                            onChange={(e) => set("religion", e.target.value)}
                            placeholder="Islam"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="tf-edu">{tr("education")}</Label>
                        <Input
                            id="tf-edu"
                            value={values.educationalQualification}
                            onChange={(e) =>
                                set(
                                    "educationalQualification",
                                    e.target.value,
                                )
                            }
                            placeholder="BSc in CSE"
                        />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="tf-occupation">
                            {tr("occupation")}
                        </Label>
                        <Textarea
                            id="tf-occupation"
                            rows={2}
                            value={values.occupationAndAddress}
                            onChange={(e) =>
                                set("occupationAndAddress", e.target.value)
                            }
                            placeholder="Software Engineer, Gulshan, Dhaka"
                        />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="tf-address">
                            {tr("permanentAddress")}
                        </Label>
                        <Textarea
                            id="tf-address"
                            rows={2}
                            value={values.parmanentAddress}
                            onChange={(e) =>
                                set("parmanentAddress", e.target.value)
                            }
                            placeholder="Village Road, Sylhet"
                        />
                    </div>
                </div>
            </div>

            {/* Contact & IDs */}
            <div className="space-y-3">
                <SectionTitle>{tr("sectionContact")}</SectionTitle>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="tf-phone">{tr("phone")}</Label>
                        <Input
                            id="tf-phone"
                            type="tel"
                            value={values.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            placeholder="01711000000"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="tf-email">{tr("email")}</Label>
                        <Input
                            id="tf-email"
                            type="email"
                            value={values.email}
                            onChange={(e) => set("email", e.target.value)}
                            placeholder="karim@example.com"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="tf-nid">{tr("nidNumber")}</Label>
                        <Input
                            id="tf-nid"
                            value={values.nidNumber}
                            onChange={(e) => set("nidNumber", e.target.value)}
                            placeholder="1234567890"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="tf-passport">
                            {tr("passportNumber")}
                        </Label>
                        <Input
                            id="tf-passport"
                            value={values.passportNumber}
                            onChange={(e) =>
                                set("passportNumber", e.target.value)
                            }
                            placeholder="BP0123456"
                        />
                    </div>
                </div>
            </div>

            {/* Family / mess members */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <SectionTitle>{tr("sectionFamily")}</SectionTitle>
                    <button
                        type="button"
                        onClick={addFamilyRow}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11.5px] font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        <Plus size={11} /> {tr("addRow")}
                    </button>
                </div>
                <div className="space-y-2">
                    {values.familyMembers.map((row, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-1 gap-2 rounded-md border border-slate-200 p-2 sm:grid-cols-[1.4fr_0.8fr_1fr_1fr_auto]"
                        >
                            <Input
                                aria-label={tr("memberNameAria", { n: i + 1 })}
                                value={row.name}
                                onChange={(e) =>
                                    setFamily(i, "name", e.target.value)
                                }
                                placeholder={tr("memberName")}
                            />
                            <Input
                                aria-label={tr("memberAgeAria", { n: i + 1 })}
                                type="date"
                                value={row.age}
                                onChange={(e) =>
                                    setFamily(i, "age", e.target.value)
                                }
                            />
                            <Input
                                aria-label={tr("memberOccupationAria", {
                                    n: i + 1,
                                })}
                                value={row.occupation}
                                onChange={(e) =>
                                    setFamily(i, "occupation", e.target.value)
                                }
                                placeholder={tr("memberOccupation")}
                            />
                            <Input
                                aria-label={tr("memberMobileAria", { n: i + 1 })}
                                value={row.contactNumber}
                                onChange={(e) =>
                                    setFamily(
                                        i,
                                        "contactNumber",
                                        e.target.value,
                                    )
                                }
                                placeholder={tr("memberMobile")}
                            />
                            <button
                                type="button"
                                onClick={() => removeFamilyRow(i)}
                                className="inline-flex items-center justify-center rounded-md border border-slate-200 px-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                                aria-label={tr("removeMemberAria", { n: i + 1 })}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
                <p className="text-[11px] text-slate-500">
                    {tr("familyHint")}
                </p>
            </div>

            {/* Emergency contact */}
            <div className="space-y-3">
                <SectionTitle>{tr("sectionEmergency")}</SectionTitle>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="tf-em-name">{tr("name")}</Label>
                            <Input
                                id="tf-em-name"
                                value={values.emName}
                                onChange={(e) => set("emName", e.target.value)}
                                placeholder="Rahim Uddin"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="tf-em-phone">{tr("phone")}</Label>
                            <Input
                                id="tf-em-phone"
                                type="tel"
                                value={values.emPhone}
                                onChange={(e) => set("emPhone", e.target.value)}
                                placeholder="01822000000"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="tf-em-rel">
                                {tr("relationship")}
                            </Label>
                            <Input
                                id="tf-em-rel"
                                value={values.emRelationship}
                                onChange={(e) =>
                                    set("emRelationship", e.target.value)
                                }
                                placeholder="Brother"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="tf-em-addr">{tr("address")}</Label>
                            <Input
                                id="tf-em-addr"
                                value={values.emAddress}
                                onChange={(e) =>
                                    set("emAddress", e.target.value)
                                }
                                placeholder="Uttara, Dhaka"
                            />
                        </div>
                    </div>
            </div>

            {/* Maid */}
            <div className="space-y-3">
                <SectionTitle>{tr("sectionMaid")}</SectionTitle>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="tf-maid-name">{tr("name")}</Label>
                            <Input
                                id="tf-maid-name"
                                value={values.maidName}
                                onChange={(e) =>
                                    set("maidName", e.target.value)
                                }
                                placeholder="Rina Begum"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="tf-maid-nid">
                                {tr("nidNumber")}
                            </Label>
                            <Input
                                id="tf-maid-nid"
                                value={values.maidNid}
                                onChange={(e) => set("maidNid", e.target.value)}
                                placeholder="1234567890"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="tf-maid-contact">
                                {tr("mobileNumber")}
                            </Label>
                            <Input
                                id="tf-maid-contact"
                                type="tel"
                                value={values.maidContact}
                                onChange={(e) =>
                                    set("maidContact", e.target.value)
                                }
                                placeholder="01644000000"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="tf-maid-addr">
                                {tr("permanentAddress")}
                            </Label>
                            <Input
                                id="tf-maid-addr"
                                value={values.maidAddress}
                                onChange={(e) =>
                                    set("maidAddress", e.target.value)
                                }
                                placeholder="Barisal"
                            />
                        </div>
                    </div>
                </div>

            {/* Driver */}
            <div className="space-y-3">
                <SectionTitle>{tr("sectionDriver")}</SectionTitle>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="tf-driver-name">{tr("name")}</Label>
                            <Input
                                id="tf-driver-name"
                                value={values.driverName}
                                onChange={(e) =>
                                    set("driverName", e.target.value)
                                }
                                placeholder="Jashim Uddin"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="tf-driver-nid">
                                {tr("nidNumber")}
                            </Label>
                            <Input
                                id="tf-driver-nid"
                                value={values.driverNid}
                                onChange={(e) =>
                                    set("driverNid", e.target.value)
                                }
                                placeholder="1234567890"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="tf-driver-contact">
                                {tr("mobileNumber")}
                            </Label>
                            <Input
                                id="tf-driver-contact"
                                type="tel"
                                value={values.driverContact}
                                onChange={(e) =>
                                    set("driverContact", e.target.value)
                                }
                                placeholder="01555000000"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="tf-driver-addr">
                                {tr("permanentAddress")}
                            </Label>
                            <Input
                                id="tf-driver-addr"
                                value={values.driverAddress}
                                onChange={(e) =>
                                    set("driverAddress", e.target.value)
                                }
                                placeholder="Comilla"
                            />
                        </div>
                    </div>
                </div>

            {/* House owners */}
            <div className="space-y-3">
                <SectionTitle>{tr("sectionOwners")}</SectionTitle>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="tf-present-name">
                                {tr("presentOwnerName")}
                            </Label>
                            <Input
                                id="tf-present-name"
                                value={values.presentOwnerName}
                                onChange={(e) =>
                                    set("presentOwnerName", e.target.value)
                                }
                                placeholder="Current Landlord"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="tf-present-contact">
                                {tr("presentOwnerContact")}
                            </Label>
                            <Input
                                id="tf-present-contact"
                                value={values.presentOwnerContact}
                                onChange={(e) =>
                                    set("presentOwnerContact", e.target.value)
                                }
                                placeholder="01877000000"
                            />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="tf-present-addr">
                                {tr("presentOwnerAddress")}
                            </Label>
                            <Input
                                id="tf-present-addr"
                                value={values.presentOwnerAddress}
                                onChange={(e) =>
                                    set("presentOwnerAddress", e.target.value)
                                }
                                placeholder="Banani, Dhaka"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="tf-prev-name">
                                {tr("previousOwnerName")}
                            </Label>
                            <Input
                                id="tf-prev-name"
                                value={values.previousOwnerName}
                                onChange={(e) =>
                                    set("previousOwnerName", e.target.value)
                                }
                                placeholder="Former Landlord"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="tf-prev-contact">
                                {tr("previousOwnerContact")}
                            </Label>
                            <Input
                                id="tf-prev-contact"
                                value={values.previousOwnerContact}
                                onChange={(e) =>
                                    set("previousOwnerContact", e.target.value)
                                }
                                placeholder="01766000000"
                            />
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label htmlFor="tf-prev-addr">
                                {tr("previousOwnerAddress")}
                            </Label>
                            <Input
                                id="tf-prev-addr"
                                value={values.previousOwnerAddress}
                                onChange={(e) =>
                                    set("previousOwnerAddress", e.target.value)
                                }
                                placeholder="Mirpur, Dhaka"
                            />
                        </div>
                    </div>
                </div>

            {/* Moving details */}
            <div className="space-y-3">
                <SectionTitle>{tr("sectionMoving")}</SectionTitle>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="tf-rentdate">{tr("rentDate")}</Label>
                        <Input
                            id="tf-rentdate"
                            type="date"
                            value={values.rentDate}
                            onChange={(e) => set("rentDate", e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor="tf-reason">
                            {tr("reasonForMoving")}
                        </Label>
                        <Textarea
                            id="tf-reason"
                            rows={2}
                            value={values.reasonForMoving}
                            onChange={(e) =>
                                set("reasonForMoving", e.target.value)
                            }
                            placeholder="Job relocation"
                        />
                    </div>
                </div>
            </div>

            {/* Police submission flag */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                    <Checkbox
                        checked={values.submittedToPolice}
                        onCheckedChange={(checked) =>
                            set("submittedToPolice", checked === true)
                        }
                        className="mt-0.5"
                    />
                    <div className="space-y-0.5">
                        <p className="text-sm font-medium text-slate-800">
                            {tr("submittedToPolice")}
                        </p>
                        <p className="font-bangla text-xs text-slate-500">
                            {tr("submittedToPoliceBn")}
                        </p>
                    </div>
                </label>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={submitting}
                    >
                        {tr("cancel")}
                    </Button>
                )}
                <Button type="submit" disabled={submitting}>
                    {submitting ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            {tr("saving")}
                        </>
                    ) : (
                        submitLabel
                    )}
                </Button>
            </div>
        </form>
    );
}

// ── Payload builders ────────────────────────────────────────────────

const t = (s: string) => s.trim();
const opt = (s: string) => (t(s) ? t(s) : undefined);

/**
 * Compute the nested child payloads from form values. Each child is included
 * only when its identifying field (name / name+phone) is filled in — an empty
 * section is left out so it's not created/upserted.
 */
function buildNested(values: TenantFormValues) {
    const emergencyContact =
        t(values.emName) && t(values.emPhone)
            ? {
                  name: t(values.emName),
                  phone: t(values.emPhone),
                  address: opt(values.emAddress),
                  relationship: opt(values.emRelationship),
              }
            : undefined;

    const maidInfo = t(values.maidName)
        ? {
              name: t(values.maidName),
              nidNumber: opt(values.maidNid),
              contactNumber: opt(values.maidContact),
              parmanentAddress: opt(values.maidAddress),
          }
        : undefined;

    const driverInfo = t(values.driverName)
        ? {
              name: t(values.driverName),
              nidNumber: opt(values.driverNid),
              contactNumber: opt(values.driverContact),
              parmanentAddress: opt(values.driverAddress),
          }
        : undefined;

    const presentHouseOwner = t(values.presentOwnerName)
        ? {
              name: t(values.presentOwnerName),
              contactNumber: opt(values.presentOwnerContact),
              address: opt(values.presentOwnerAddress),
          }
        : undefined;

    const previousHouseOwner = t(values.previousOwnerName)
        ? {
              name: t(values.previousOwnerName),
              contactNumber: opt(values.previousOwnerContact),
              address: opt(values.previousOwnerAddress),
          }
        : undefined;

    const familyRows = values.familyMembers
        .filter((r) => t(r.name))
        .map((r) => ({
            name: t(r.name),
            age: opt(r.age),
            occupation: opt(r.occupation),
            contactNumber: opt(r.contactNumber),
        }));
    // Send the list even when empty so an edit that clears all rows persists;
    // for create, an empty array simply creates no members.
    const familyMembers = familyRows;

    return {
        emergencyContact,
        familyMembers,
        maidInfo,
        driverInfo,
        presentHouseOwner,
        previousHouseOwner,
    };
}

export function buildCreateTenantFormPayload(
    values: TenantFormValues,
): CreateTenantFormPayload {
    const {
        emergencyContact,
        familyMembers,
        maidInfo,
        driverInfo,
        presentHouseOwner,
        previousHouseOwner,
    } = buildNested(values);

    return {
        tenantId: t(values.tenantId),
        name: t(values.name),
        fatherName: t(values.fatherName),
        motherName: opt(values.motherName),
        dateOfBirth: opt(values.dateOfBirth),
        maritalStatus: opt(values.maritalStatus),
        parmanentAddress: opt(values.parmanentAddress),
        occupationAndAddress: opt(values.occupationAndAddress),
        religion: opt(values.religion),
        educationalQualification: opt(values.educationalQualification),
        phone: opt(values.phone),
        email: opt(values.email),
        nidNumber: opt(values.nidNumber),
        passportNumber: opt(values.passportNumber),
        reasonForMoving: opt(values.reasonForMoving),
        rentDate: opt(values.rentDate),
        submittedToPolice: values.submittedToPolice,
        division: opt(values.division),
        thana: opt(values.thana),
        flatFloor: opt(values.flatFloor),
        houseNo: opt(values.houseNo),
        roadNo: opt(values.roadNo),
        areaName: opt(values.areaName),
        postCode: opt(values.postCode),
        emergencyContact,
        familyMembers,
        maidInfo,
        driverInfo,
        presentHouseOwner,
        previousHouseOwner,
    };
}

export function buildUpdateTenantFormPayload(
    values: TenantFormValues,
): UpdateTenantFormPayload {
    const {
        emergencyContact,
        familyMembers,
        maidInfo,
        driverInfo,
        presentHouseOwner,
        previousHouseOwner,
    } = buildNested(values);

    return {
        name: t(values.name),
        fatherName: t(values.fatherName),
        motherName: opt(values.motherName),
        dateOfBirth: opt(values.dateOfBirth),
        maritalStatus: opt(values.maritalStatus),
        parmanentAddress: opt(values.parmanentAddress),
        occupationAndAddress: opt(values.occupationAndAddress),
        religion: opt(values.religion),
        educationalQualification: opt(values.educationalQualification),
        phone: opt(values.phone),
        email: opt(values.email),
        nidNumber: opt(values.nidNumber),
        passportNumber: opt(values.passportNumber),
        reasonForMoving: opt(values.reasonForMoving),
        rentDate: opt(values.rentDate),
        submittedToPolice: values.submittedToPolice,
        division: opt(values.division),
        thana: opt(values.thana),
        flatFloor: opt(values.flatFloor),
        houseNo: opt(values.houseNo),
        roadNo: opt(values.roadNo),
        areaName: opt(values.areaName),
        postCode: opt(values.postCode),
        emergencyContact,
        familyMembers,
        maidInfo,
        driverInfo,
        presentHouseOwner,
        previousHouseOwner,
    };
}
