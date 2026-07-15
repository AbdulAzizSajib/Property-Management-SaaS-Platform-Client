import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from "./lib/authUtils";
import { routing } from "./i18n/routing";
import { jwtUtils } from "./lib/jwtUtils";
import { getNewTokensWithRefreshToken, getUserInfo } from "./services/auth.services";

// next-intl's middleware: detects the locale, sets the NEXT_LOCALE cookie and
// (for the default locale, which is un-prefixed by default) rewrites internally.
const intlMiddleware = createIntlMiddleware(routing);

const LOCALE_PATTERN = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);

/**
 * Strip a leading locale segment so all auth rules below can reason about
 * clean, locale-agnostic paths (e.g. "/bn/owner/dashboard" -> "/owner/dashboard",
 * "/en" -> "/"). Returns the detected locale (or null) and the bare pathname.
 */
function stripLocale(pathname: string): { locale: string | null; rest: string } {
    const match = pathname.match(LOCALE_PATTERN);
    if (!match) return { locale: null, rest: pathname };
    const rest = pathname.slice(match[0].length) || "/";
    return { locale: match[1], rest };
}

/** Re-attach the active locale prefix when building redirect targets. */
function withLocale(locale: string | null, path: string): string {
    if (!locale) return path;
    return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/**
 * Copy the cookies/headers next-intl wants to set (e.g. NEXT_LOCALE) onto a
 * response produced by the auth logic, so locale detection isn't lost on
 * redirects.
 */
function mergeIntlCookies(from: NextResponse, to: NextResponse): NextResponse {
    from.cookies.getAll().forEach((c) => to.cookies.set(c));
    return to;
}

async function refreshTokenMiddleware (refreshToken : string) : Promise<boolean> {
    try {
        const refresh = await getNewTokensWithRefreshToken(refreshToken);
        if(!refresh){
            return false;
        }
        return true;
    } catch (error) {
        console.error("Error refreshing token in middleware:", error);
        return false;   
    }
}


export async function proxy (request : NextRequest) {
   try {
       // The raw URL still carries the locale prefix (/en, /bn). Run next-intl
       // first so locale detection / NEXT_LOCALE cookie is always applied, then
       // strip the prefix so every auth rule below stays locale-agnostic.
       const intlResponse = intlMiddleware(request);

       const rawPathname = request.nextUrl.pathname;
       const { locale, rest: pathname } = stripLocale(rawPathname); // eg /owner/dashboard
       // Preserve the locale prefix on any path we redirect to.
       const localized = (path: string) => withLocale(locale, path);
       // The "continue" response — hand control back to next-intl's result.
       const proceed = () => intlResponse;
       // Build a locale-prefixed redirect that also carries next-intl's cookies.
       const redirectTo = (url: URL) =>
           mergeIntlCookies(intlResponse, NextResponse.redirect(url));

    const pathWithQuery = `${pathname}${request.nextUrl.search}`;
       const accessToken = request.cookies.get("accessToken")?.value;
       const refreshToken = request.cookies.get("refreshToken")?.value;

       const verified = accessToken
           ? await jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
           : null;

       const isValidAccessToken = verified?.success === true;
       const decodedAccessToken = verified?.success ? verified.data : null;

       let userRole: UserRole | null = null;

       if(decodedAccessToken){
            userRole = decodedAccessToken.role as UserRole;
       }

       const routerOwner = getRouteOwner(pathname);

       const unifySuperAdminAndAdminRole = userRole === "SUPER_ADMIN" ? "ADMIN" : userRole;

       userRole = unifySuperAdminAndAdminRole;

       const isAuth = isAuthRoute(pathname);


       //proactively refresh token if refresh token exists and access token is expired or about to expire
       if (isValidAccessToken && refreshToken && accessToken && jwtUtils.isTokenExpiringSoon(accessToken)){
            const requestHeaders = new Headers(request.headers);

            const response = NextResponse.next({
                request: {
                    headers : requestHeaders
            
                },
            })


            try {
                const refreshed = await refreshTokenMiddleware(refreshToken);

                if(refreshed){
                    requestHeaders.set("x-token-refreshed", "1");
                }

                return mergeIntlCookies(
                    intlResponse,
                    NextResponse.next({
                        request: {
                            headers : requestHeaders
                        },
                        headers : response.headers
                    })
                )
            } catch (error) {
                console.error("Error refreshing token:", error);

            }

            return mergeIntlCookies(intlResponse, response);
       }


    // Rule - 1 : Logged-in users should not access auth pages,
    // except pages that may be mandatory due to account state.
    if(
     isAuth &&
     isValidAccessToken &&
     pathname !== "/verify-email" &&
     pathname !== "/reset-password"
    ){
        return redirectTo(new URL(localized(getDefaultDashboardRoute(userRole as UserRole)), request.url));
       }

       // Cache getUserInfo() across rules in this request lifecycle
       let cachedUserInfo: Awaited<ReturnType<typeof getUserInfo>> | undefined;
       const loadUserInfo = async () => {
           if (cachedUserInfo === undefined) {
               cachedUserInfo = await getUserInfo({
                   accessToken,
                   sessionToken: request.cookies.get("better-auth.session_token")?.value,
               });
           }
           return cachedUserInfo;
       };

       // Rule - 2 : User is trying to access reset password page
       if(pathname === "/reset-password"){

        const email = request.nextUrl.searchParams.get("email");

            // case - 1 user has needPasswordChange true
            //no need for case 1 if need password change is handled from change-password page
            if(accessToken && email){
                const userInfo = await loadUserInfo();

                if(userInfo?.needPasswordChange){
                    return proceed();
                }else{
                    return redirectTo(new URL(localized(getDefaultDashboardRoute(userRole as UserRole)), request.url));
                }
            }

            // Case-2 user coming from forgot password

            if(email){
                return proceed();
            }

            const loginUrl = new URL(localized("/login"), request.url);
            loginUrl.searchParams.set("redirect", pathWithQuery);
            return redirectTo(loginUrl);
       }

       // Rule-3 User trying to access Public route -> allow
       if(routerOwner === null){
        return proceed();
       }

       // Rule - 4 User is Not logged in but trying to access protected route -> redirect to login
       if(!accessToken || !isValidAccessToken){
        const loginUrl = new URL(localized("/login"), request.url);
        loginUrl.searchParams.set("redirect", pathWithQuery);
        return redirectTo(loginUrl);
       }

       //Rule - Enforcing user to stay in reset password or verify email page if their needPasswordChange or isEmailVerified flags are not satisfied respectively

       if(accessToken){
            const userInfo = await loadUserInfo();

            if(userInfo){
                // need email verification scenario
                if(userInfo.emailVerified === false){
                    if(pathname !== "/verify-email"){
                        const verifyEmailUrl = new URL(localized("/verify-email"), request.url);
                        verifyEmailUrl.searchParams.set("email", userInfo.email);
                        return redirectTo(verifyEmailUrl);
                    }

                    return proceed();
                }

                if(userInfo.emailVerified && pathname === "/verify-email"){
                    return redirectTo(new URL(localized(getDefaultDashboardRoute(userRole as UserRole)), request.url));
                }

                // need password change scenario
                if (userInfo.needPasswordChange){
                    if(pathname !== "/reset-password"){
                        const resetPasswordUrl = new URL(localized("/reset-password"), request.url);
                        resetPasswordUrl.searchParams.set("email", userInfo.email);
                        return redirectTo(resetPasswordUrl);
                    }

                    return proceed();
                }

                if(!userInfo.needPasswordChange && pathname === "/reset-password"){
                    return redirectTo(new URL(localized(getDefaultDashboardRoute(userRole as UserRole)), request.url));
                }
            }
       }

       // Rule - 5 User trying to access Common protected route -> allow
       if(routerOwner === "COMMON"){
        return proceed();
       }

       //Rule-6 User trying to visit role based protected but doesn't have required role -> redirect to their default dashboard

       if(
           routerOwner === "ADMIN" ||
           routerOwner === "OWNER" ||
           routerOwner === "MANAGER" ||
           routerOwner === "CARETAKER" ||
           routerOwner === "TENANT"
       ){
            if(routerOwner !== userRole){
                return redirectTo(new URL(localized(getDefaultDashboardRoute(userRole as UserRole)), request.url));
            }
       }

       return proceed();

   } catch (error) {
         console.error("Error in proxy middleware:", error);
         // Fail closed: never silently return undefined (which Next treats as "continue"
         // and would let protected routes through on middleware errors).
         // Note: no locale prefix here — this is the last-resort error path.
         const loginUrl = new URL("/login", request.url);
         return NextResponse.redirect(loginUrl);
   }
}

export const config = {
    matcher : [
        // Run on everything EXCEPT: API routes, Next internals, and any request
        // for a file with an extension (e.g. /assets/logo.png). The trailing
        // `(?!.*\\.).*` guard skips static files in /public so next-intl doesn't
        // redirect them to a locale-prefixed path (which 404s the asset).
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known|.*\\..*).*)',
    ]
}