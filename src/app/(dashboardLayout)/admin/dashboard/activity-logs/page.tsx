"use client";

import { ActivityLogList } from "@/src/components/dashboard/ActivityLogList";

export default function AdminActivityLogsPage() {
    return (
        <ActivityLogList
            title="Activity logs"
            bnTitle="প্ল্যাটফর্ম অডিট ট্রেইল"
        />
    );
}
