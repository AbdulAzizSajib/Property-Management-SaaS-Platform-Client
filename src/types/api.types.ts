export interface ApiResponse<TData> {
    success: boolean;
    statusCode?: number;
    message?: string;
    data: TData;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}

export interface ApiErrorBody {
    success: false;
    statusCode?: number;
    message: string;
    errorSources?: Array<{ path: string; message: string }>;
    stack?: string;
}
