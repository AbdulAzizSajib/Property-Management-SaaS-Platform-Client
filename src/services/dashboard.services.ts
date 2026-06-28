import { httpClient } from "@/src/lib/axios/browserHttpClient";
import type { DashboardOverview } from "@/src/types/dashboard.types";

/** GET /dashboard/overview — everything the owner dashboard home page renders. */
export const getDashboardOverview = async () =>
    httpClient.get<DashboardOverview>("/dashboard/overview");
