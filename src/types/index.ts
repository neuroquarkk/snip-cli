export interface ApiResponse<T = any> {
    statusCode: number;
    message: string;
    data: T;
    success: boolean;
}

export interface ApiError {
    statusCode: number;
    message: string;
    data: null;
    errors?: string[];
}
