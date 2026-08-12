"use server";

import {
    getDefaultDashboardRoute,
    isValidRedirectForRole,
} from "@/src/lib/authUtils";
import { setTokenInCookies } from "@/src/lib/tokenUtils";
import type {
    AuthData,
    LoginActionResult,
    LoginPayload,
    VerifyEmailActionResult,
} from "@/src/types/auth";
import type { SubscriptionPlan } from "@/src/types/subscription.types";
import { cookies } from "next/headers";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if(!BASE_API_URL){
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

/**
 * Server-action login. Cross-site setup: the backend lives on a different
 * domain, so cookies it sets land on *its* domain — the Next middleware
 * (proxy.ts) reading the Vercel domain never sees them, and every login
 * bounces straight back to /login. Fix: do the login server-side, read the
 * tokens from the response body, and set httpOnly cookies on *our* domain so
 * the middleware can read the role and route the user.
 */
export async function loginAction(
    payload: LoginPayload,
    redirectParam?: string | null,
): Promise<LoginActionResult> {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(payload),
        });

        const json = await res.json().catch(() => null);

        if (!res.ok) {
            return {
                ok: false,
                // Surface the machine-readable code (e.g. EMAIL_NOT_VERIFIED)
                // so the client can route to the verify screen.
                code: json?.error?.body?.code,
                message: json?.message ?? "Sign in failed. Please try again.",
            };
        }

        const data = json?.data as AuthData;
        const { accessToken, refreshToken, token, user } = data;

        if (accessToken) {
            await setTokenInCookies("accessToken", accessToken);
        }
        if (refreshToken) {
            await setTokenInCookies("refreshToken", refreshToken);
        }
        if (token) {
            await setTokenInCookies(
                "better-auth.session_token",
                token,
                24 * 60 * 60, // 1 day
            );
        }

        const role = user.role;
        const fallback = getDefaultDashboardRoute(role);
        const destination =
            redirectParam && isValidRedirectForRole(redirectParam, role)
                ? redirectParam
                : fallback;

        return { ok: true, destination };
    } catch (error) {
        console.error("Error during login:", error);
        return { ok: false, message: "Sign in failed. Please try again." };
    }
}

/**
 * Server-action email verification. Same cross-site cookie problem as
 * loginAction: the backend now returns the auth tokens straight from
 * /auth/verify-email (the new flow logs the user in on verify), but cookies it
 * sets land on *its* domain. So we POST server-side, read the tokens from the
 * response body, set httpOnly cookies on *our* domain, and hand back the
 * role-based dashboard route for the client to navigate to.
 */
export async function verifyEmailAction(payload: {
    email: string;
    otp: string;
    /**
     * Plan carried from the public pricing page's ?plan= param, through
     * registration. When present and a paid (non-FREE) plan, the returned
     * destination routes to the subscription page with the payment-request
     * dialog pre-opened, instead of the default dashboard route.
     */
    plan?: SubscriptionPlan;
}): Promise<VerifyEmailActionResult> {
    try {
        const { plan, ...body } = payload;

        const res = await fetch(`${BASE_API_URL}/auth/verify-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(body),
        });

        const json = await res.json().catch(() => null);

        if (!res.ok) {
            return {
                ok: false,
                message:
                    json?.message ??
                    "Invalid or expired OTP. Please try again.",
            };
        }

        const data = json?.data as AuthData;
        const { accessToken, refreshToken, token, user } = data;

        if (accessToken) {
            await setTokenInCookies("accessToken", accessToken);
        }
        if (refreshToken) {
            await setTokenInCookies("refreshToken", refreshToken);
        }
        if (token) {
            await setTokenInCookies(
                "better-auth.session_token",
                token,
                24 * 60 * 60, // 1 day
            );
        }

        const fallback = getDefaultDashboardRoute(user.role);
        const destination =
            plan && plan !== "FREE"
                ? `/owner/dashboard/subscription?openPayment=${plan}`
                : fallback;

        return { ok: true, destination };
    } catch (error) {
        console.error("Error during email verification:", error);
        return {
            ok: false,
            message: "Verification failed. Please try again.",
        };
    }
}

export async function getNewTokensWithRefreshToken(refreshToken  : string) : Promise<boolean> {
    try {
        const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                Cookie : `refreshToken=${refreshToken}`
            }
        });

        if(!res.ok){
            return false;
        }

        const {data} = await res.json();

        const { accessToken, refreshToken: newRefreshToken, token } = data;

        if(accessToken){
            await setTokenInCookies("accessToken", accessToken);
        }

        if(newRefreshToken){
            await setTokenInCookies("refreshToken", newRefreshToken);
        }

        if(token){
            await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds
        }

        return true;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return false;
    }
}

export async function getUserInfo(tokens?: {
    accessToken?: string;
    sessionToken?: string;
}) {
    try {
        // In the Edge middleware `next/headers` cookies() isn't reliable, so the
        // caller passes the tokens it already read from the request. Elsewhere
        // (server components/actions) we fall back to the cookie store.
        let accessToken = tokens?.accessToken;
        let sessionToken = tokens?.sessionToken;

        if (!tokens) {
            const cookieStore = await cookies();
            accessToken = cookieStore.get("accessToken")?.value;
            sessionToken = cookieStore.get("better-auth.session_token")?.value;
        }

        if (!accessToken) {
            return null;
        }

        const cookieParts = [`accessToken=${accessToken}`];
        if (sessionToken) {
            cookieParts.push(`better-auth.session_token=${sessionToken}`);
        }

        const res = await fetch(`${BASE_API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: cookieParts.join("; ")
            }
        });

        if (!res.ok) {
            console.error("Failed to fetch user info:", res.status, res.statusText);
            return null;
        }

        const { data } = await res.json();

        return data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}
