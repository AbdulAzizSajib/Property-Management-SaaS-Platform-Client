import { Loader2 } from "lucide-react";

export default function ManagerDashboardLoading() {
    return (
        <div className="flex items-center justify-center min-h-[60vh] text-slate-500">
            <Loader2 size={20} className="animate-spin mr-2" />
            <span className="text-sm">Loading manager dashboard...</span>
        </div>
    );
}
