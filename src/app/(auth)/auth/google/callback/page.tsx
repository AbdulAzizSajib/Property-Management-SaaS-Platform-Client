import {
    getDefaultDashboardRoute,
    isValidRedirectForRole,
    type UserRole,
} from "@/src/lib/authUtils";
import { setTokenInCookies } from "@/src/lib/tokenUtils";
import { getUserInfo } from "@/src/services/auth.services";
import { redirect } from "next/navigation";

/**
 * Google OAuth callback landing page.
 *
 * The backend lives on a different domain, so the auth cookies it sets during
 * the OAuth redirect land on *its* domain and our middleware never sees them —
 * exactly the cross-site problem `loginAction` already solves for email/password
 * login. So instead of redirecting straight to the dashboard, the backend sends
 * the tokens here as query params; we re-set them as httpOnly cookies on *our*
 * domain, then route the user to their role's dashboard.
 */
export default async function GoogleCallbackPage({
    searchParams,
}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const params = await searchParams;

    const accessToken = typeof params.accessToken === "string" ? params.accessToken : undefined;
    const refreshToken = typeof params.refreshToken === "string" ? params.refreshToken : undefined;
    const sessionToken = typeof params.sessionToken === "string" ? params.sessionToken : undefined;
    const redirectParam = typeof params.redirect === "string" ? params.redirect : undefined;

    if (!accessToken) {
        redirect("/login?error=oauth_failed");
    }

    // Set the tokens as httpOnly cookies on our own domain so the middleware can
    // read them — mirroring loginAction / verifyEmailAction.
    await setTokenInCookies("accessToken", accessToken);
    if (refreshToken) {
        await setTokenInCookies("refreshToken", refreshToken);
    }
    if (sessionToken) {
        await setTokenInCookies(
            "better-auth.session_token",
            sessionToken,
            24 * 60 * 60, // 1 day
        );
    }

    // Resolve the user's role to pick the correct dashboard. The backend sends a
    // generic "/dashboard" redirect; we translate it to the role-based route.
    const user = await getUserInfo({ accessToken, sessionToken });
    const role = (user?.role as UserRole) ?? undefined;

    let destination = "/login?error=oauth_failed";
    if (role) {
        const fallback = getDefaultDashboardRoute(role);
        destination =
            redirectParam &&
            redirectParam !== "/dashboard" &&
            isValidRedirectForRole(redirectParam, role)
                ? redirectParam
                : fallback;
    }

    redirect(destination);
}
