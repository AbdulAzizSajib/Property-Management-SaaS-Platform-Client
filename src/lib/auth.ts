"use client";
import { apiRequest } from "@/src/lib/api";
import type {
    AuthData,
    LoginPayload,
    RegisterPayload,
} from "@/src/types/auth";

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
