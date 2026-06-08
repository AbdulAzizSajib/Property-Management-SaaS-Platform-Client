export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const BD_PHONE_RE = /^01[3-9]\d{8}$/;
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(input: string): string {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

export function isEmail(v: string): boolean {
    return EMAIL_RE.test(v.trim());
}

export function isBdPhone(v: string): boolean {
    return BD_PHONE_RE.test(v.trim());
}

export function isSlug(v: string): boolean {
    return SLUG_RE.test(v.trim());
}

/**
 * Login identifier — accepts either an email address or a Bangladeshi phone number.
 * Matches the `identifier` field on the /auth/login endpoint.
 */
export function isLoginIdentifier(v: string): boolean {
    const trimmed = v.trim();
    return isEmail(trimmed) || isBdPhone(trimmed);
}
