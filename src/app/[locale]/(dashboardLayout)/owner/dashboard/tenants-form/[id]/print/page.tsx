"use client";

// Printable "ভাড়াটিয়া নিবন্ধন ফরম" (Dhaka Metropolitan Police) rendered from
// a TenantForm record. Use the browser's Print (Ctrl+P) to get an A4 sheet;
// the on-screen toolbar is hidden in print via the `.no-print` class.

import { useTenantForm } from "@/src/hooks/useTenantForms";
import { ArrowLeft, Printer } from "lucide-react";
import { Link } from "@/src/i18n/navigation";
import { useParams } from "next/navigation";

const D = "................................................";

function fmtDate(v: string | null): string {
    if (!v) return "";
    return v.slice(0, 10);
}

/** A labelled fill-in line: label, then value (or dotted blank). */
function Field({
    label,
    value,
    className = "",
}: {
    label: string;
    value?: string | null;
    className?: string;
}) {
    return (
        <div className={`flex items-baseline gap-1 ${className}`}>
            <span className="whitespace-nowrap font-semibold">{label} ঃ</span>
            <span className="min-w-0 flex-1 border-b border-dotted border-black px-1">
                {value || " "}
            </span>
        </div>
    );
}

export default function TenantFormPrintPage() {
    const params = useParams<{ id: string }>();
    const { data: form, isLoading, isError } = useTenantForm(params.id);

    if (isLoading) {
        return (
            <div className="p-10 text-center text-sm text-slate-500">
                Loading form…
            </div>
        );
    }
    if (isError || !form) {
        return (
            <div className="p-10 text-center text-sm text-rose-600">
                Couldn&apos;t load this form.
            </div>
        );
    }

    const em = form.emergencyContact;
    const present = form.presentHouseOwner;
    const previous = form.previousHouseOwner;
    const maid = form.maidInfo;
    const driver = form.driverInfo;
    const family = form.familyMembers ?? [];
    const familyRows = [0, 1, 2].map((i) => family[i]);

    return (
        <div className="min-h-screen bg-slate-100 py-6 print:bg-white print:py-0">
            {/* Print styles: A4, hide toolbar */}
            <style jsx global>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    @page {
                        size: A4;
                        margin: 12mm;
                    }
                    body {
                        background: #fff;
                    }
                }
            `}</style>

            {/* Toolbar (screen only) */}
            <div className="no-print mx-auto mb-4 flex max-w-[794px] items-center justify-between px-4">
                <Link
                    href="/owner/dashboard/tenants-form"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                    <ArrowLeft size={15} /> Back
                </Link>
                <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex h-9 items-center gap-1.5 rounded-md bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
                >
                    <Printer size={15} /> Print
                </button>
            </div>

            {/* The sheet */}
            <div className="mx-auto w-[794px] max-w-full border border-black bg-white p-6 text-[12px] leading-relaxed text-black print:w-full print:border-0 print:p-0">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="w-[150px] shrink-0 border border-black p-2 text-center text-[10px] leading-tight">
                        ভাড়াটিয়ার এক কপি
                        <br />
                        পাসপোর্ট সাইজ ছবি
                    </div>

                    <div className="flex-1 text-center">
                        <h1 className="text-[17px] font-bold">
                            ঢাকা মেট্রোপলিটন পুলিশ
                        </h1>
                        <div className="mx-auto mt-2 w-[220px] space-y-1 text-left">
                            <Field label="বিভাগ" value={form.division} />
                            <Field label="থানা" value={form.thana} />
                        </div>
                    </div>

                    <div className="w-[190px] shrink-0 space-y-1 text-[11px]">
                        <Field label="ফ্ল্যাট/তলা" value={form.flatFloor} />
                        <Field label="বাড়ি/হোল্ডিং" value={form.houseNo} />
                        <Field label="রাস্তা" value={form.roadNo} />
                        <Field label="এলাকা" value={form.areaName} />
                        <Field label="পোস্ট কোড" value={form.postCode} />
                    </div>
                </div>

                <h2 className="my-3 text-center text-[15px] font-bold underline">
                    ভাড়াটিয়া নিবন্ধন ফরম
                </h2>

                {/* Numbered fields */}
                <ol className="space-y-1.5">
                    <li className="flex gap-1">
                        <span className="w-5 shrink-0">১।</span>
                        <Field
                            label="ভাড়াটিয়া/বাড়িওয়ালার নাম"
                            value={form.name}
                            className="flex-1"
                        />
                    </li>
                    <li className="flex gap-1">
                        <span className="w-5 shrink-0">২।</span>
                        <Field
                            label="পিতার নাম"
                            value={form.fatherName}
                            className="flex-1"
                        />
                    </li>
                    <li className="flex gap-1">
                        <span className="w-5 shrink-0">৩।</span>
                        <Field
                            label="জন্ম তারিখ"
                            value={fmtDate(form.dateOfBirth)}
                            className="flex-1"
                        />
                        <Field
                            label="বৈবাহিক অবস্থা"
                            value={form.maritalStatus}
                            className="flex-1"
                        />
                    </li>
                    <li className="flex gap-1">
                        <span className="w-5 shrink-0">৪।</span>
                        <Field
                            label="স্থায়ী ঠিকানা"
                            value={form.parmanentAddress}
                            className="flex-1"
                        />
                    </li>
                    <li className="flex gap-1">
                        <span className="w-5 shrink-0">৫।</span>
                        <Field
                            label="পেশা ও প্রতিষ্ঠান/কর্মস্থলের ঠিকানা"
                            value={form.occupationAndAddress}
                            className="flex-1"
                        />
                    </li>
                    <li className="flex gap-1">
                        <span className="w-5 shrink-0">৬।</span>
                        <Field
                            label="ধর্ম"
                            value={form.religion}
                            className="flex-1"
                        />
                        <Field
                            label="শিক্ষাগত যোগ্যতা"
                            value={form.educationalQualification}
                            className="flex-1"
                        />
                    </li>
                    <li className="flex gap-1">
                        <span className="w-5 shrink-0">৭।</span>
                        <Field
                            label="মোবাইল নম্বর"
                            value={form.phone}
                            className="flex-1"
                        />
                        <Field
                            label="ই-মেইল আইডি"
                            value={form.email}
                            className="flex-1"
                        />
                    </li>
                    <li className="flex gap-1">
                        <span className="w-5 shrink-0">৮।</span>
                        <Field
                            label="জাতীয় পরিচয়পত্র নম্বর"
                            value={form.nidNumber}
                            className="flex-1"
                        />
                    </li>
                    <li className="flex gap-1">
                        <span className="w-5 shrink-0">৯।</span>
                        <Field
                            label="পাসপোর্ট নম্বর (যদি থাকে)"
                            value={form.passportNumber}
                            className="flex-1"
                        />
                    </li>

                    {/* 10 — emergency contact */}
                    <li>
                        <div className="flex gap-1">
                            <span className="w-5 shrink-0">১০।</span>
                            <span className="font-semibold">জরুরী যোগাযোগ ঃ</span>
                        </div>
                        <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 pl-5">
                            <Field label="(ক) নাম" value={em?.name} />
                            <Field
                                label="(খ) সম্পর্ক"
                                value={em?.relationship}
                            />
                            <Field label="(গ) ঠিকানা" value={em?.address} />
                            <Field
                                label="(ঘ) মোবাইল নম্বর"
                                value={em?.phone}
                            />
                        </div>
                    </li>

                    {/* 11 — family members table */}
                    <li>
                        <div className="flex gap-1">
                            <span className="w-5 shrink-0">১১।</span>
                            <span className="font-semibold">
                                পরিবার / মেসের সদস্যদের বিবরণ ঃ
                            </span>
                        </div>
                        <table className="mt-1 w-full border-collapse text-[11px]">
                            <thead>
                                <tr>
                                    <th className="border border-black px-1 py-0.5 w-10">
                                        ক্রঃ নং
                                    </th>
                                    <th className="border border-black px-1 py-0.5">
                                        নাম
                                    </th>
                                    <th className="border border-black px-1 py-0.5 w-20">
                                        বয়স
                                    </th>
                                    <th className="border border-black px-1 py-0.5 w-24">
                                        পেশা
                                    </th>
                                    <th className="border border-black px-1 py-0.5 w-28">
                                        মোবাইল নম্বর
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {familyRows.map((m, i) => (
                                    <tr key={i}>
                                        <td className="border border-black px-1 py-1 text-center">
                                            {["১।", "২।", "৩।"][i]}
                                        </td>
                                        <td className="border border-black px-1 py-1">
                                            {m?.name || " "}
                                        </td>
                                        <td className="border border-black px-1 py-1">
                                            {fmtDate(m?.age ?? null)}
                                        </td>
                                        <td className="border border-black px-1 py-1">
                                            {m?.occupation || " "}
                                        </td>
                                        <td className="border border-black px-1 py-1">
                                            {m?.contactNumber || " "}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </li>

                    {/* 12 — maid */}
                    <li>
                        <div className="flex gap-1">
                            <span className="w-5 shrink-0">১২।</span>
                            <div className="flex-1 space-y-1">
                                <div className="grid grid-cols-2 gap-x-4">
                                    <Field
                                        label="গৃহকর্মীর নাম"
                                        value={maid?.name}
                                    />
                                    <Field
                                        label="জাতীয় পরিচয়পত্র নং"
                                        value={maid?.nidNumber}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-x-4">
                                    <Field
                                        label="মোবাইল নম্বর"
                                        value={maid?.contactNumber}
                                    />
                                    <Field
                                        label="স্থায়ী ঠিকানা"
                                        value={maid?.parmanentAddress}
                                    />
                                </div>
                            </div>
                        </div>
                    </li>

                    {/* 13 — driver */}
                    <li>
                        <div className="flex gap-1">
                            <span className="w-5 shrink-0">১৩।</span>
                            <div className="flex-1 space-y-1">
                                <div className="grid grid-cols-2 gap-x-4">
                                    <Field
                                        label="ড্রাইভারের নাম"
                                        value={driver?.name}
                                    />
                                    <Field
                                        label="জাতীয় পরিচয়পত্র নং"
                                        value={driver?.nidNumber}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-x-4">
                                    <Field
                                        label="মোবাইল নম্বর"
                                        value={driver?.contactNumber}
                                    />
                                    <Field
                                        label="স্থায়ী ঠিকানা"
                                        value={driver?.parmanentAddress}
                                    />
                                </div>
                            </div>
                        </div>
                    </li>

                    {/* 14 — previous house owner */}
                    <li>
                        <div className="flex gap-1">
                            <span className="w-5 shrink-0">১৪।</span>
                            <div className="flex-1 space-y-1">
                                <div className="grid grid-cols-2 gap-x-4">
                                    <Field
                                        label="পূর্ববর্তী বাড়িওয়ালার নাম"
                                        value={previous?.name}
                                    />
                                    <Field
                                        label="মোবাইল নম্বর"
                                        value={previous?.contactNumber}
                                    />
                                </div>
                                <Field
                                    label="ঠিকানা"
                                    value={previous?.address}
                                />
                            </div>
                        </div>
                    </li>

                    {/* 15 — reason for moving */}
                    <li className="flex gap-1">
                        <span className="w-5 shrink-0">১৫।</span>
                        <Field
                            label="পূর্ববর্তী বাসা ছাড়ার কারণ"
                            value={form.reasonForMoving}
                            className="flex-1"
                        />
                    </li>

                    {/* 16 — present house owner */}
                    <li className="flex gap-1">
                        <span className="w-5 shrink-0">১৬।</span>
                        <Field
                            label="বর্তমান বাড়িওয়ালার নাম"
                            value={present?.name}
                            className="flex-1"
                        />
                        <Field
                            label="মোবাইল নম্বর"
                            value={present?.contactNumber}
                            className="flex-1"
                        />
                    </li>

                    {/* 17 — moving-in date */}
                    <li className="flex gap-1">
                        <span className="w-5 shrink-0">১৭।</span>
                        <Field
                            label="বর্তমান বাড়িতে কোন তারিখ থেকে বসবাস"
                            value={fmtDate(form.rentDate)}
                            className="flex-1"
                        />
                    </li>
                </ol>

                {/* Signatures */}
                <div className="mt-10 flex items-end justify-between">
                    <div className="text-center">
                        <div className="w-40 border-t border-black pt-1">
                            তারিখ
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="w-40 border-t border-black pt-1">
                            ভাড়াটিয়ার স্বাক্ষর
                        </div>
                    </div>
                </div>

                <p className="mt-4 text-[11px] font-semibold">
                    বিঃদ্রঃ এই ফরমের একটি কপি বাড়ির মালিক অবশ্যই সংরক্ষণ করবেন।
                </p>

                <p className="text-[10px]" aria-hidden>
                    {D}
                </p>
            </div>
        </div>
    );
}
