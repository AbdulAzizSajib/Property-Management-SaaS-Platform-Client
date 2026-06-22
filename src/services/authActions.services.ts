// src/services/authActions.services.ts
//
// Browser-side auth ops that don't fit the server-action shape in
// auth.services.ts. These run after page load — change-password is for
// authenticated users; verify / forget / reset are public flows.

import { httpClient } from "@/src/lib/axios/browserHttpClient";
import type { CurrentUser } from "@/src/types/auth";

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export interface VerifyEmailPayload {
    email: string;
    otp: string;
}

export interface ResendVerificationOtpPayload {
    email: string;
}

export interface ForgetPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    email: string;
    otp: string;
    newPassword: string;
}

/** GET /auth/me — the currently authenticated user's profile. */
export const getMe = async () => httpClient.get<CurrentUser>("/auth/me");

/** POST /auth/change-password — caller must be logged in. */
export const changePassword = async (payload: ChangePasswordPayload) =>
    httpClient.post<{ success: true }>("/auth/change-password", payload);

/** POST /auth/verify-email — confirms an OTP sent to email. */
export const verifyEmail = async (payload: VerifyEmailPayload) =>
    httpClient.post<{ success: true }>("/auth/verify-email", payload);

/** POST /auth/resend-verification-otp — sends a fresh OTP to the same email. */
export const resendVerificationOtp = async (
    payload: ResendVerificationOtpPayload,
) =>
    httpClient.post<{ success: true }>(
        "/auth/resend-verification-otp",
        payload,
    );

/** POST /auth/forget-password — sends an OTP to the email. */
export const forgetPassword = async (payload: ForgetPasswordPayload) =>
    httpClient.post<{ success: true }>("/auth/forget-password", payload);

/** POST /auth/reset-password — verifies OTP and sets a new password. */
export const resetPassword = async (payload: ResetPasswordPayload) =>
    httpClient.post<{ success: true }>("/auth/reset-password", payload);

/** POST /auth/logout — clears server-side session cookies. */
export const logout = async () => httpClient.post("/auth/logout", {});

/**
 * Returns the absolute URL the browser should navigate to in order to start
 * the Google OAuth flow. The backend handles the redirect.
 */
export const getGoogleOAuthStartUrl = (): string => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
    return `${base}/auth/login/google`;
};
