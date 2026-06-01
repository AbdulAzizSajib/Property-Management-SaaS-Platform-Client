import { httpClient } from "@/src/lib/axios/browserHttpClient";
import type {
    DocumentDetail,
    DocumentFilters,
    DocumentListItem,
    DocumentRecord,
} from "@/src/types/document.types";

function buildDocumentQuery(filters?: DocumentFilters): string {
    if (!filters) return "";
    const params = new URLSearchParams();
    if (filters.type) params.set("type", filters.type);
    if (filters.tenantId) params.set("tenantId", filters.tenantId);
    if (filters.buildingId) params.set("buildingId", filters.buildingId);
    if (filters.leaseId) params.set("leaseId", filters.leaseId);
    const qs = params.toString();
    return qs ? `?${qs}` : "";
}

/**
 * POST /documents — multipart upload.
 * FormData fields: file, name, type, plus optional tenantId / buildingId / leaseId.
 */
export const uploadDocument = async (formData: FormData) =>
    httpClient.upload<DocumentRecord>("/documents", formData);

/** GET /documents — list with optional type / tenant / building / lease filters. */
export const getDocuments = async (filters?: DocumentFilters) =>
    httpClient.get<DocumentListItem[]>(
        `/documents${buildDocumentQuery(filters)}`,
    );

/** GET /documents/:id — full detail with embedded building, tenant, uploader. */
export const getDocumentById = async (id: string) =>
    httpClient.get<DocumentDetail>(`/documents/${id}`);

/** DELETE /documents/:id. */
export const deleteDocument = async (id: string) =>
    httpClient.delete<{ id: string }>(`/documents/${id}`);
