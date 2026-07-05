// src/lib/axios/browserHttpClient.ts
//
// Browser-side HTTP client. Calls the backend through our SAME-ORIGIN proxy
// route (`/api/be/*`, see src/app/api/be/[...path]/route.ts) instead of hitting
// the backend domain directly. The auth tokens are httpOnly cookies on our
// (Vercel) domain — a direct cross-site request can't carry them, so the
// backend would report "Refresh token is missing". Going same-origin means the
// browser sends our cookies automatically; the proxy forwards them to the
// backend and relays any Set-Cookie back.
//
// Reactive auth refresh: on 401, this client calls /auth/refresh-token
// (which Set-Cookie's a new pair) and retries the original request once.

import { ApiResponse } from "@/src/types/api.types";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

// Same-origin proxy base — NOT the backend domain. Relative URL keeps requests
// on our origin so the httpOnly auth cookies are sent.
const API_BASE_URL = "/api/be";

// Singleton — created once per browser tab.
const browserAxios: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30_000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// ──────────────────────────────────────────────────────────────────────
// Refresh-on-401 interceptor
// Concurrent 401s share a single in-flight refresh promise so we don't
// fire multiple /auth/refresh-token calls in parallel.
// ──────────────────────────────────────────────────────────────────────

let refreshInFlight: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
    if (refreshInFlight) return refreshInFlight;
    refreshInFlight = (async () => {
        try {
            // Through the same-origin proxy so our httpOnly cookies are sent and
            // the refreshed Set-Cookie comes back to our domain. The response
            // interceptor below skips retrying this URL, so no recursion.
            const res = await axios.post(
                `${API_BASE_URL}/auth/refresh-token`,
                {},
                { withCredentials: true },
            );
            return res.status >= 200 && res.status < 300;
        } catch {
            return false;
        } finally {
            // Allow a future 401 to trigger another refresh attempt.
            refreshInFlight = null;
        }
    })();
    return refreshInFlight;
}

type RetriableConfig = AxiosRequestConfig & { _retry?: boolean };

browserAxios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const original = error.config as RetriableConfig | undefined;

        if (
            error.response?.status === 401 &&
            original &&
            !original._retry &&
            // Don't try to refresh the refresh endpoint itself.
            !original.url?.includes("/auth/refresh-token")
        ) {
            original._retry = true;
            const ok = await refreshTokens();
            if (ok) {
                return browserAxios(original);
            }
        }

        return Promise.reject(error);
    },
);

// ──────────────────────────────────────────────────────────────────────
// Error normalization — match the server-side httpClient's behavior
// so service callers don't need to know which transport they're using.
// ──────────────────────────────────────────────────────────────────────

function throwClientError(error: unknown): never {
    if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message;
        throw new Error(typeof msg === "string" ? msg : error.message);
    }
    throw error;
}

// ──────────────────────────────────────────────────────────────────────
// Public API — mirrors the server-side httpClient shape one-for-one.
// ──────────────────────────────────────────────────────────────────────

export interface ApiRequestOptions {
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
    /** HTTP method for multipart uploads. Defaults to POST. */
    method?: "POST" | "PUT" | "PATCH";
}

const httpGet = async <TData>(
    endpoint: string,
    options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
    try {
        const response = await browserAxios.get<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        throwClientError(error);
    }
};

const httpPost = async <TData>(
    endpoint: string,
    data: unknown,
    options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
    try {
        const response = await browserAxios.post<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        throwClientError(error);
    }
};

const httpPut = async <TData>(
    endpoint: string,
    data: unknown,
    options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
    try {
        const response = await browserAxios.put<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        throwClientError(error);
    }
};

const httpPatch = async <TData>(
    endpoint: string,
    data: unknown,
    options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
    try {
        const response = await browserAxios.patch<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        throwClientError(error);
    }
};

const httpDelete = async <TData>(
    endpoint: string,
    options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
    try {
        const response = await browserAxios.delete<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        throwClientError(error);
    }
};

/**
 * Multipart upload. Forwards FormData with proper Content-Type boundary
 * set by axios. Auth cookies flow via `withCredentials: true`.
 */
const httpUpload = async <TData>(
    endpoint: string,
    formData: FormData,
    options?: ApiRequestOptions,
): Promise<ApiResponse<TData>> => {
    try {
        const response = await browserAxios.request<ApiResponse<TData>>({
            url: endpoint,
            method: options?.method ?? "POST",
            data: formData,
            params: options?.params,
            headers: {
                ...options?.headers,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        throwClientError(error);
    }
};

export const httpClient = {
    get: httpGet,
    post: httpPost,
    put: httpPut,
    patch: httpPatch,
    delete: httpDelete,
    upload: httpUpload,
};
