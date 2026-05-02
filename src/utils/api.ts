import { CONSTANTS } from '@constants';
import type { ApiError, ApiResponse } from '@types';

export class ApiService {
    public static async fetch<T>(
        endpoint: string,
        options?: {
            method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
            body?: any;
            headers?: Record<string, string>;
        }
    ) {
        const url = `${CONSTANTS.BASE_URL}/${endpoint}`;
        const {
            method = 'GET',
            body,
            headers: customHeaders = {},
        } = options ?? {};

        const headers = {
            'Content-Type': 'application/json',
            'x-client': 'cli',
            ...customHeaders,
        };

        try {
            const response = await fetch(url, {
                method,
                headers,
                ...(body && { body: JSON.stringify(body) }),
            });

            const result = await response.json();

            if (!response.ok) {
                return { error: result as ApiError };
            }

            return { data: (result as ApiResponse<T>).data };
        } catch (error) {
            return {
                error: {
                    statusCode: 500,
                    message: 'Network error',
                    data: null,
                },
            };
        }
    }
}
