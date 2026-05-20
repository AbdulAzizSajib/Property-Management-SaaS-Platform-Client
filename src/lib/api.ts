import type { ApiErrorBody, ApiResponse } from "@/src/types/auth";

const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

export class ApiError extends Error {
    status: number;
    body: ApiErrorBody | null;
    constructor(message: string, status: number, body: ApiErrorBody | null) {
        super(message);
        this.status = status;
        this.body = body;
    }
}

type RequestOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    token?: string;
    signal?: AbortSignal;
};

export async function apiRequest<TData>(
    path: string,
    { method = "GET", body, token, signal }: RequestOptions = {},
): Promise<ApiResponse<TData>> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const url = `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

    let res: Response;
    try {
        res = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            signal,
            credentials: "include",
        });
    } catch (err) {
        throw new ApiError(
            err instanceof Error ? err.message : "Network request failed",
            0,
            null,
        );
    }

    let json: unknown = null;
    try {
        json = await res.json();
    } catch {
        // empty / non-JSON body
    }

    if (!res.ok) {
        const errBody = (json as ApiErrorBody | null) ?? null;
        throw new ApiError(
            errBody?.message ?? `Request failed with status ${res.status}`,
            res.status,
            errBody,
        );
    }

    return json as ApiResponse<TData>;
}
