/* eslint-disable @typescript-eslint/no-explicit-any */
import { getNewTokensWithRefreshToken } from '@/src/services/auth.services';
import { ApiResponse } from '@/src/types/api.types';
import axios from 'axios';
import { cookies, headers } from 'next/headers';
import { isTokenExpiringSoon } from '../tokenUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if(!API_BASE_URL) {
    throw new Error('API_BASE_URL is not defined in environment variables');
}

async function tryRefreshToken(
    accessToken: string,
    refreshToken: string
): Promise<void>
{
    if(!(await isTokenExpiringSoon(accessToken))) {
        return;
    }

    const requestHeader = await headers();

    if (requestHeader.get("x-token-refreshed") === "1") {
        return; // avoid multiple refresh attempts in the same request lifecycle
    }

    try {
        await getNewTokensWithRefreshToken(refreshToken);
    } catch (error : any) {
        console.error("Error refreshing token in http client:", error);
    }
}

const axiosInstance = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if(accessToken && refreshToken){
        await tryRefreshToken(accessToken, refreshToken);
    }

    const cookieHeader = cookieStore
                                .getAll()
                                .map((cookie) => `${cookie.name}=${cookie.value}`)
                                .join("; ");
    // eg Cookie: "accessToken=abc123; refreshToken=def456"

    const instance = axios.create({
        baseURL : API_BASE_URL,
        timeout : 30000,
        headers:{
            'Content-Type' : 'application/json',
            Cookie : cookieHeader
        }
    })

    return instance;
}

const getApiErrorMessage = (error: unknown): string => {

    if (axios.isAxiosError(error)) {

        const data = error.response?.data;

        if (
            data &&
            typeof data === "object" &&
            "message" in data &&
            typeof data.message === "string"
        ) {
            return data.message;
        }

        if (typeof data === "string") {
            return data;
        }

        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong";
};

export interface ApiRequestOptions {
    params?: Record<string, unknown>;
    headers?: Record<string, string>;
    /** HTTP method for multipart uploads. Defaults to POST. */
    method?: "POST" | "PUT" | "PATCH";
}

const httpGet = async <TData>(endpoint: string, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.get<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        console.error(`GET request to ${endpoint} failed:`, error);
        throw error;
    }
}

const httpPost = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.post<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } 
    // catch (error) {
    //     console.error(`POST request to ${endpoint} failed:`, error);
    //     throw error;
    // }
    catch (error: unknown) {

    const message = getApiErrorMessage(error);

    console.error(
        `POST request to ${endpoint} failed:`,
        message
    );

    throw new Error(message);
}
}

const httpPut = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.put<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        console.error(`PUT request to ${endpoint} failed:`, error);
        throw error;
    }
}

const httpPatch = async <TData>(endpoint: string, data: unknown, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.patch<ApiResponse<TData>>(endpoint, data, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    }
    catch (error) {
        console.error(`PATCH request to ${endpoint} failed:`, error);
        throw error;
    }
}

/**
 * Multipart file upload. Passes FormData through to axios so the multipart
 * boundary is set automatically — does NOT use the default JSON Content-Type.
 */
const httpUpload = async <TData>(endpoint: string, formData: FormData, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.request<ApiResponse<TData>>({
            url: endpoint,
            method: options?.method ?? "POST",
            data: formData,
            params: options?.params,
            // Drop the JSON Content-Type so axios sets multipart/form-data; boundary=…
            headers: {
                ...options?.headers,
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error(`UPLOAD request to ${endpoint} failed:`, error);
        throw error;
    }
}

const httpDelete =  async <TData>(endpoint: string, options?: ApiRequestOptions) : Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.delete<ApiResponse<TData>>(endpoint, {
            params: options?.params,
            headers: options?.headers,
        });
        return response.data;
    } catch (error) {
        console.error(`DELETE request to ${endpoint} failed:`, error);
        throw error;
    }
}

export const httpClient = {
    get: httpGet,
    post: httpPost,
    put: httpPut,
    patch: httpPatch,
    delete: httpDelete,
    upload: httpUpload,
}
