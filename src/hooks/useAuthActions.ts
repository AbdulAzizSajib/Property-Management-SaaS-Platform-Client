"use client";

import { getErrorMessage } from "@/src/lib/utils";
import {
  changePassword,
  forgetPassword,
  getMe,
  resendVerificationOtp,
  resetPassword,
  updateMyProfile,
  verifyEmail,
} from "@/src/services/authActions.services";
import type {
  ChangePasswordPayload,
  ForgetPasswordPayload,
  ResendVerificationOtpPayload,
  ResetPasswordPayload,
  UpdateMyProfilePayload,
  VerifyEmailPayload,
} from "@/src/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const currentUserKeys = {
  me: ["auth", "me"] as const,
};

/** The signed-in user (GET /auth/me). Source of truth for UI user info. */
export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserKeys.me,
    queryFn: async () => {
      const res = await getMe();
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 min — avoids refetching on every mount
  });
}

/**
 * Self-service profile update (name, contactNumber, image file).
 * PATCH /auth/me, multipart — mirrors useUploadDocument's FormData pattern.
 */
export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateMyProfilePayload) => {
      const formData = new FormData();
      if (payload.name !== undefined) formData.append("name", payload.name);
      if (payload.contactNumber !== undefined) {
        formData.append("contactNumber", payload.contactNumber);
      }
      if (payload.image !== undefined) formData.append("image", payload.image);

      const res = await updateMyProfile(formData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: currentUserKeys.me });
      toast.success("Profile updated");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update profile"));
    },
  });
}

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
