import axios, { AxiosError } from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 15_000,
});

export interface ApiError {
  message: string;
  code?: string;
  fieldErrors?: Record<string, string[]>;
}

apiClient.interceptors.response.use(
  (res) => res,
  (err: AxiosError<ApiError>) => {
    const apiError: ApiError = err.response?.data ?? {
      message: err.message || "Network error",
    };
    return Promise.reject(apiError);
  }
);