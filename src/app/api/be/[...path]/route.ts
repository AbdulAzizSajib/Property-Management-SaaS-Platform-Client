// Same-origin proxy to the backend API.
//
// Why this exists: the auth tokens are httpOnly cookies set on *our* (Vercel)
// domain so the middleware can read the role. The backend lives on a different
// domain, so a browser request straight to the backend can't carry those
// cookies (`withCredentials` only sends cookies for the target origin) — the
// backend then reports "Refresh token is missing". Routing through this Next
// route handler fixes it: the browser calls us same-origin (cookies flow), we
// read them and forward them as a `Cookie` header to the backend, and we relay
// the backend's `Set-Cookie` back so token refresh updates our domain's cookies.

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BACKEND_BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

// Hop-by-hop / host-specific headers we must NOT forward verbatim.
const STRIPPED_REQUEST_HEADERS = new Set([
    "host",
    "connection",
    "content-length",
    "cookie", // we rebuild this from our cookie store
]);

async function handler(
    req: NextRequest,
    ctx: { params: Promise<{ path: string[] }> },
) {
    const { path } = await ctx.params;

    const cookieStore = await cookies();
    const cookieHeader = cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");

    const targetUrl = `${BACKEND_BASE_URL}/${path.join("/")}${req.nextUrl.search}`;

    // Forward the incoming headers (content-type with multipart boundary, accept,
    // etc.) but replace Cookie with the tokens read from our domain.
    const forwardHeaders = new Headers();
    req.headers.forEach((value, key) => {
        if (!STRIPPED_REQUEST_HEADERS.has(key.toLowerCase())) {
            forwardHeaders.set(key, value);
        }
    });
    if (cookieHeader) {
        forwardHeaders.set("cookie", cookieHeader);
    }

    const method = req.method.toUpperCase();
    let body: ArrayBuffer | undefined;
    if (method !== "GET" && method !== "HEAD") {
        const raw = await req.arrayBuffer();
        body = raw.byteLength > 0 ? raw : undefined;
    }

    let backendRes: Response;
    try {
        backendRes = await fetch(targetUrl, {
            method,
            headers: forwardHeaders,
            body,
            redirect: "manual",
            // No `credentials` — we set the Cookie header explicitly above.
        });
    } catch (error) {
        console.error(`Proxy request to ${targetUrl} failed:`, error);
        return NextResponse.json(
            { success: false, message: "Upstream request failed" },
            { status: 502 },
        );
    }

    const resBody = await backendRes.arrayBuffer();

    const response = new NextResponse(resBody, { status: backendRes.status });

    const contentType = backendRes.headers.get("content-type");
    if (contentType) {
        response.headers.set("content-type", contentType);
    }

    // Relay Set-Cookie so a backend token refresh updates OUR domain's cookies.
    const setCookies = backendRes.headers.getSetCookie?.() ?? [];
    for (const sc of setCookies) {
        response.headers.append("set-cookie", sc);
    }

    return response;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
