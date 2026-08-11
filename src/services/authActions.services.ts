// src/services/authActions.services.ts
//
// Server-action auth ops. change-password is for authenticated users; verify /
// forget / reset are public flows. These run on the server (like every other
// *.services.ts), so httpClient reads the httpOnly cookies via next/headers.

"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
import { clearAuthCookies } from "@/src/lib/cookieUtils";
import type {
    ChangePasswordPayload,
    CurrentUser,
    ForgetPasswordPayload,
    ResendVerificationOtpPayload,
    ResetPasswordPayload,
    VerifyEmailPayload,
} from "@/src/types/auth";

/** GET /auth/me — the currently authenticated user's profile. */
export const getMe = async () => httpClient.get<CurrentUser>("/auth/me");

/**
 * PATCH /auth/me — self-service profile update (name, contactNumber, image).
 * Scoped to the caller's own account; no id param and no isActive field.
 * Multipart: `image` (if present) is an uploaded file, not a URL string.
 */
export const updateMyProfile = async (formData: FormData) =>
    httpClient.upload<CurrentUser>("/auth/me", formData, { method: "PATCH" });

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

/**
 * POST /auth/logout — tells the backend to end the session, then clears the
 * Next.js-domain auth cookies ourselves. The backend's Set-Cookie headers
 * only clear cookies on its own origin (this is a server-to-server axios
 * call, not a browser request), so the middleware would otherwise keep
 * treating the browser as authenticated and bounce it straight back to the
 * dashboard whenever it lands on /login.
 */
export const logout = async () => {
    const res = await httpClient.post("/auth/logout", {});
    await clearAuthCookies();
    return res;
};
