// src/services/authActions.services.ts
//
// Server-action auth ops. change-password is for authenticated users; verify /
// forget / reset are public flows. These run on the server (like every other
// *.services.ts), so httpClient reads the httpOnly cookies via next/headers.

"use server";

import { httpClient } from "@/src/lib/axios/httpClient";
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
