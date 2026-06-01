"use client";

// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';

const isServer = typeof window === "undefined";

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // Data stays "fresh" for 5 minutes — within that window, no
                // refetch on mount/focus/remount. Big perceived-perf win.
                staleTime: 5 * 60 * 1000,
                // Keep cached entries around for 30 minutes after they go
                // unused, so jumping between pages reuses the cache.
                gcTime: 30 * 60 * 1000,
                // Tab/window focus shouldn't trigger a refetch storm.
                refetchOnWindowFocus: false,
                // Retry once on real network errors; don't hammer the API.
                retry: 1,
            },
            mutations: {
                retry: 0,
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
    if (isServer) {
        // Server: always make a new query client
        return makeQueryClient();
    } else {
        // Browser: make a new query client if we don't already have one
        // This is very important, so we don't re-make a new client if React
        // suspends during the initial render. This may not be needed if we
        // have a suspense boundary BELOW the creation of the query client
        if (!browserQueryClient) browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
}

export default function QueryProviders({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryStreamedHydration>
                {children}
            </ReactQueryStreamedHydration>
        </QueryClientProvider>
    );
}
