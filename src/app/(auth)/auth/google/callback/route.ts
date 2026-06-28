import {
    getDefaultDashboardRoute,
    isValidRedirectForRole,
    type UserRole,
} from "@/src/lib/authUtils";
import { getUserInfo } from "@/src/services/auth.services";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

/**
 * Google OAuth callback route handler.
 *
 * The backend lives on a different domain, so the auth cookies it sets during
 * the OAuth redirect land on *its* domain and our middleware never sees them —
 * the same cross-site problem `loginAction` solves for email/password login.
 *
 * The backend redirects here with the tokens as query params. We re-set them as
 * httpOnly cookies on *our* domain (a Route Handler can mutate cookies; a page
 * Server Component cannot), resolve the user's role, and redirect to their
 * dashboard.
 */
function secondsRemaining(token: string, fallback: number): number {
    try {
        const payload = jwt.decode(token) as JwtPayload | null;
        if (!payload?.exp) return fallback;
        const remaining = payload.exp - Math.floor(Date.now() / 1000);
        return remaining > 0 ? remaining : fallback;
    } catch {
        return fallback;
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;

    const accessToken = searchParams.get("accessToken") || undefined;
    const refreshToken = searchParams.get("refreshToken") || undefined;
    const sessionToken = searchParams.get("sessionToken") || undefined;
    const redirectParam = searchParams.get("redirect") || undefined;

    if (!accessToken) {
        return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
    }

    // Resolve the user's role to pick the correct dashboard. The backend sends a
    // generic "/dashboard" redirect; translate it to the role-based route.
    const user = await getUserInfo({ accessToken, sessionToken });
    const role = (user?.role as UserRole) ?? undefined;

    if (!role) {
        return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url));
    }

    const fallback = getDefaultDashboardRoute(role);
    const destination =
        redirectParam &&
        redirectParam !== "/dashboard" &&
        isValidRedirectForRole(redirectParam, role)
            ? redirectParam
            : fallback;

    const response = NextResponse.redirect(new URL(destination, request.url));

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none" as const,
        path: "/",
    };

    const oneDay = 24 * 60 * 60;
    response.cookies.set("accessToken", accessToken, {
        ...cookieOptions,
        maxAge: secondsRemaining(accessToken, oneDay),
    });
    if (refreshToken) {
        response.cookies.set("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: secondsRemaining(refreshToken, 7 * oneDay),
        });
    }
    if (sessionToken) {
        response.cookies.set("better-auth.session_token", sessionToken, {
            ...cookieOptions,
            maxAge: oneDay,
        });
    }

    return response;
}
