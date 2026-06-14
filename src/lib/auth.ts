"use client";
import { apiRequest } from "@/src/lib/api";
import type {
    AuthData,
    LoginPayload,
    Organization,
    AuthUser as User,
    RegisterPayload,
} from "@/src/types/auth";

const ACCESS_TOKEN_KEY = "baribari.accessToken";
const REFRESH_TOKEN_KEY = "baribari.refreshToken";
const USER_KEY = "baribari.user";
const ORG_KEY = "baribari.org";

// Middleware reads these cookie names — keep them in sync with middleware.ts.
const ACCESS_COOKIE = "accessToken";
const REFRESH_COOKIE = "refreshToken";

const ACCESS_MAX_AGE = 60 * 60 * 24;       // 1 day
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;  // 7 days

function setCookie(name: string, value: string, maxAgeSeconds: number): void {
    if (typeof document === "undefined") return;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function deleteCookie(name: string): void {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function persistAuth(data: AuthData): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    if (data.organization) {
        localStorage.setItem(ORG_KEY, JSON.stringify(data.organization));
    }
    setCookie(ACCESS_COOKIE, data.accessToken, ACCESS_MAX_AGE);
    setCookie(REFRESH_COOKIE, data.refreshToken, REFRESH_MAX_AGE);
}

export function clearAuth(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ORG_KEY);
    deleteCookie(ACCESS_COOKIE);
    deleteCookie(REFRESH_COOKIE);
}

export function getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as User;
    } catch {
        return null;
    }
}

export function getStoredOrganization(): Organization | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(ORG_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as Organization;
    } catch {
        return null;
    }
}

export async function registerOwner(
    payload: RegisterPayload,
    signal?: AbortSignal,
): Promise<AuthData> {
    const res = await apiRequest<AuthData>("/auth/register", {
        method: "POST",
        body: payload,
        signal,
    });
    return res.data;
}

export async function loginUser(
    payload: LoginPayload,
    signal?: AbortSignal,
): Promise<AuthData> {
    const res = await apiRequest<AuthData>("/auth/login", {
        method: "POST",
        body: payload,
        signal,
    });
    return res.data;
}
