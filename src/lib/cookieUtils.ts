"use server";

import { cookies } from "next/headers";

export const setCookie = async (
    name : string,
    value : string,
    maxAgeInSeconds : number,
) => {
    const cookieStore = await cookies();

    cookieStore.set(name, value, {
        httpOnly : true,
        secure : true,
        sameSite : "none",
        path : "/",
        maxAge : maxAgeInSeconds,
    })
}

export const getCookie = async (name : string) => {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value;
}

export const deleteCookie = async (name : string) => {
    const cookieStore = await cookies();
    cookieStore.delete(name);
}

/**
 * Clears all auth-related cookies (access token, refresh token, session token).
 * Used when we need the user to re-authenticate — e.g. after email verification
 * in the register flow, so they're forced back through the login screen.
 */
export const clearAuthCookies = async () => {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    cookieStore.delete("better-auth.session_token");
}