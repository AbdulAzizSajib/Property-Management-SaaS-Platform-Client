"use client";

import {
    deleteDocument,
    getDocumentById,
    getDocuments,
    uploadDocument,
} from "@/src/services/document.services";
import type { DocumentFilters } from "@/src/types/document.types";
import { getErrorMessage } from "@/src/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const documentKeys = {
    all: ["documents"] as const,
    list: (filters?: DocumentFilters) =>
        [...documentKeys.all, "list", filters ?? {}] as const,
    detail: (id: string) => [...documentKeys.all, "detail", id] as const,
};

export function useDocuments(filters?: DocumentFilters) {
    return useQuery({
        queryKey: documentKeys.list(filters),
        queryFn: async () => {
            const res = await getDocuments(filters);
            return res.data;
        },
    });
}

export function useDocument(id: string | undefined) {
    return useQuery({
        queryKey: id
            ? documentKeys.detail(id)
            : ["documents", "detail", "_none"],
        queryFn: async () => {
            if (!id) throw new Error("Document id is required");
            const res = await getDocumentById(id);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useUploadDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await uploadDocument(formData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: documentKeys.all });
            toast.success("Document uploaded");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to upload document"));
        },
    });
}

export function useDeleteDocument() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await deleteDocument(id);
            return id;
        },
        onSuccess: (id) => {
            queryClient.removeQueries({ queryKey: documentKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: documentKeys.all });
            toast.success("Document deleted");
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to delete document"));
        },
    });
}
