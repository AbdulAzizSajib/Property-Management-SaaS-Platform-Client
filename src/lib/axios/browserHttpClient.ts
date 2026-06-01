// src/lib/axios/browserHttpClient.ts
//
// Browser-side HTTP client. Calls the backend DIRECTLY from the browser
// (no Next.js server action hop), which removes 200–500ms of latency per
// request. Cookies (accessToken, refreshToken) flow automatically because
// of `withCredentials: true` — they're HttpOnly so JS can't read them,
// but the browser still sends them along with the request.
//
// Reactive auth refresh: on 401, this client calls /auth/refresh-token
// (which Set-Cookie's a new pair) and retries the original request once.

import { ApiResponse } from "@/src/types/api.types";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

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
        const response = await browserAxios.post<ApiResponse<TData>>(endpoint, formData, {
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
