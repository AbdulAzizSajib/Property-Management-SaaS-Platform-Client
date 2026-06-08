"use client";

import { getErrorMessage } from "@/src/lib/utils";
import {
    changePassword,
    forgetPassword,
    resendVerificationOtp,
    resetPassword,
    verifyEmail,
    type ChangePasswordPayload,
    type ForgetPasswordPayload,
    type ResendVerificationOtpPayload,
    type ResetPasswordPayload,
    type VerifyEmailPayload,
} from "@/src/services/authActions.services";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useChangePassword() {
    return useMutation({
        mutationFn: async (payload: ChangePasswordPayload) => {
            await changePassword(payload);
        },
        onSuccess: () => {
            toast.success("Password changed");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to change password"));
        },
    });
}

export function useVerifyEmail() {
    return useMutation({
        mutationFn: async (payload: VerifyEmailPayload) => {
            await verifyEmail(payload);
        },
        onSuccess: () => {
            toast.success("Email verified");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Verification failed"));
        },
    });
}

export function useResendVerificationOtp() {
    return useMutation({
        mutationFn: async (payload: ResendVerificationOtpPayload) => {
            await resendVerificationOtp(payload);
        },
        onSuccess: () => {
            toast.success("New OTP sent to your email");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to resend OTP"));
        },
    });
}

export function useForgetPassword() {
    return useMutation({
        mutationFn: async (payload: ForgetPasswordPayload) => {
            await forgetPassword(payload);
        },
        onSuccess: () => {
            toast.success("Reset code sent to your email");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to send reset code"));
        },
    });
}

export function useResetPassword() {
    return useMutation({
        mutationFn: async (payload: ResetPasswordPayload) => {
            await resetPassword(payload);
        },
        onSuccess: () => {
            toast.success("Password reset successful");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to reset password"));
        },
    });
}
