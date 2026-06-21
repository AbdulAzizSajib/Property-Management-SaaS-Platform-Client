export type UserRole =
    | "SUPER_ADMIN"   // SaaS platform owner
    | "ADMIN"         // Platform admin (staff of SaaS owner)
    | "OWNER"         // Landlord / property owner
    | "MANAGER"       // Manages buildings on behalf of owner
    | "CARETAKER"     // Limited: payments, complaints, tenant updates
    | "TENANT";       // Renter — uses tenant app

// Role groups
export const PLATFORM_ROLES: UserRole[] = ["SUPER_ADMIN", "ADMIN"];
export const ORG_STAFF_ROLES: UserRole[] = ["OWNER", "MANAGER", "CARETAKER"];

export type RouteOwner = UserRole | "COMMON";

export const authRoutes = [
    "/login",
    "/register",
    "/reset-password",
    "/verify-email",
];

export const isAuthRoute = (pathname: string) => {
    return authRoutes.some((route: string) => route === pathname);
};

export type RouteConfig = {
    exact: string[];
    pattern: RegExp[];
};

// Common routes accessible to any authenticated user
export const commonProtectedRoutes: RouteConfig = {
    exact: ["/my-profile", "/change-password"],
    pattern: [],
};

// Platform-level admin area (SUPER_ADMIN + ADMIN)
export const adminProtectedRoutes: RouteConfig = {
    exact: [],
    pattern: [/^\/admin\/dashboard/],
};

// Landlord / property owner area
export const ownerProtectedRoutes: RouteConfig = {
    exact: [],
    pattern: [/^\/owner\/dashboard/],
};

// Manager area
export const managerProtectedRoutes: RouteConfig = {
    exact: [],
    pattern: [/^\/manager\/dashboard/],
};

// Caretaker area
export const caretakerProtectedRoutes: RouteConfig = {
    exact: [],
    pattern: [/^\/caretaker\/dashboard/],
};

// Tenant portal
export const tenantProtectedRoutes: RouteConfig = {
    exact: ["/payment/success"],
    pattern: [/^\/tenant\/dashboard/, /^\/dashboard/],
};

export const isRouteMatches = (pathname: string, routes: RouteConfig) => {
    if (routes.exact.includes(pathname)) {
        return true;
    }
    return routes.pattern.some((pattern: RegExp) => pattern.test(pathname));
};

/**
 * Returns which role owns the given route, or "COMMON" if any authenticated
 * user may visit it, or null if the route is public.
 *
 * SUPER_ADMIN and ADMIN are treated as the same owner ("ADMIN") for routing —
 * the proxy unifies them before calling this.
 */
export const getRouteOwner = (pathname: string): RouteOwner | null => {
    if (isRouteMatches(pathname, adminProtectedRoutes)) {
        return "ADMIN";
    }

    if (isRouteMatches(pathname, ownerProtectedRoutes)) {
        return "OWNER";
    }

    if (isRouteMatches(pathname, managerProtectedRoutes)) {
        return "MANAGER";
    }

    if (isRouteMatches(pathname, caretakerProtectedRoutes)) {
        return "CARETAKER";
    }

    if (isRouteMatches(pathname, tenantProtectedRoutes)) {
        return "TENANT";
    }

    if (isRouteMatches(pathname, commonProtectedRoutes)) {
        return "COMMON";
    }

    return null; // public route
};

export const getDefaultDashboardRoute = (role: UserRole) => {
    switch (role) {
        case "SUPER_ADMIN":
        case "ADMIN":
            return "/admin/dashboard";
        case "OWNER":
            return "/owner/dashboard";
        case "MANAGER":
            return "/manager/dashboard";
        case "CARETAKER":
            return "/caretaker/dashboard";
        case "TENANT":
            return "/tenant/dashboard";
        default:
            return "/";
    }
};

export const isValidRedirectForRole = (redirectPath: string, role: UserRole) => {
    const unifiedRole: UserRole = role === "SUPER_ADMIN" ? "ADMIN" : role;

    const sanitizedRedirectPath = redirectPath.split("?")[0] || redirectPath;
    const routeOwner = getRouteOwner(sanitizedRedirectPath);

    if (routeOwner === null || routeOwner === "COMMON") {
        return true;
    }

    if (routeOwner === unifiedRole) {
        return true;
    }

    return false;
};
