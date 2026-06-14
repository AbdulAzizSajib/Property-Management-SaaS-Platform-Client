// Edge-safe JWT helpers for the middleware (proxy.ts).
//
// Next.js middleware runs in the Edge runtime, where Node's `crypto` (and thus
// the `jsonwebtoken` package) is unavailable — `jwt.verify` throws there, which
// made every login bounce back to /login. `jose` is built on the Web Crypto
// API and works in Edge, so we verify/decode tokens with it here.

import { decodeJwt, jwtVerify, type JWTPayload } from "jose";

type VerifyResult =
    | { success: true; data: JWTPayload }
    | { success: false; message: string; error: unknown };

const verifyToken = async (
    token: string,
    secret: string,
): Promise<VerifyResult> => {
    try {
        const key = new TextEncoder().encode(secret);
        const { payload } = await jwtVerify(token, key);
        return { success: true, data: payload };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Invalid token",
            error,
        };
    }
};

/** Decode without verifying the signature (base64 only — safe in Edge). */
const decodedToken = (token: string): JWTPayload | null => {
    try {
        return decodeJwt(token);
    } catch {
        return null;
    }
};

/** True when the token is still valid but expires within the threshold. */
const isTokenExpiringSoon = (
    token: string,
    thresholdInSeconds = 300,
): boolean => {
    const payload = decodedToken(token);
    if (!payload?.exp) return false;
    const remainingSeconds = payload.exp - Math.floor(Date.now() / 1000);
    return remainingSeconds > 0 && remainingSeconds <= thresholdInSeconds;
};

export const jwtUtils = {
    verifyToken,
    decodedToken,
    isTokenExpiringSoon,
};
