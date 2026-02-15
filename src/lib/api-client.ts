import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

// Create axios instance
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Request interceptor - Add JWT token to all requests
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        try {
            // Get the session which contains the backend JWT token
            const session = await getSession();

            if (session?.backendToken) {
                // Add Authorization header with Bearer token
                config.headers.Authorization = `Bearer ${session.backendToken}`;
            }
        } catch (error) {
            console.error('Error getting session for API request:', error);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        if (error.response) {
            const status = error.response.status;

            // Handle 401 Unauthorized - Token expired or invalid
            if (status === 401) {
                console.error('Unauthorized - Token expired or invalid');

                if (typeof window !== 'undefined') {
                    window.location.href = '/';
                }

                return Promise.reject({
                    message: 'Your session has expired. Please sign in again.',
                    status: 401,
                });
            }

            // Handle 403 Forbidden - Insufficient permissions
            if (status === 403) {
                console.error('Forbidden - Insufficient permissions');

                return Promise.reject({
                    message: 'You do not have permission to perform this action.',
                    status: 403,
                });
            }

            // Handle 404 Not Found
            if (status === 404) {
                return Promise.reject({
                    message: 'Resource not found.',
                    status: 404,
                });
            }

            // Handle 500 Internal Server Error
            if (status >= 500) {
                return Promise.reject({
                    message: 'Server error. Please try again later.',
                    status: status,
                });
            }

            // Handle other errors
            return Promise.reject({
                message: error.response.data || 'An error occurred.',
                status: status,
            });
        }

        // Handle network errors
        if (error.message === 'Network Error') {
            return Promise.reject({
                message: 'Network error. Please check your internet connection.',
                status: 0,
            });
        }

        // Handle timeout errors
        if (error.code === 'ECONNABORTED') {
            return Promise.reject({
                message: 'Request timeout. Please try again.',
                status: 0,
            });
        }

        return Promise.reject(error);
    }
);

// Helper functions for common HTTP methods
export const api = {
    get: <T = any>(url: string, config?: AxiosRequestConfig) =>
        apiClient.get<T>(url, config),

    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
        apiClient.post<T>(url, data, config),

    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
        apiClient.put<T>(url, data, config),

    patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
        apiClient.patch<T>(url, data, config),

    delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
        apiClient.delete<T>(url, config),
};

export default apiClient;