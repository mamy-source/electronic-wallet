
import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { ApiError, type FieldErrors } from "./api-error";
import { tokenStore } from "./token";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 15_000,
});

// ---------------------------------------------
// Types
// ---------------------------------------------

type ErrorResponse = {
  message?: string;
  code?: string;
  fieldErrors?: Record<string, string | string[]>;
  errors?: Record<string, string | string[]>;
  error?: {
    message?: string;
    code?: string;
    fieldErrors?: Record<string, string | string[]>;
  };
};

interface ApiResponse<T> {
  success: boolean;
  message: string;
  timestamp: string;
  data: T;
}

interface RefreshResponse {
  accessToken: string;
}

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ---------------------------------------------
// Error field normalization
// ---------------------------------------------

function normalizeFields(
  fields?: Record<string, string | string[]>,
): FieldErrors | undefined {
  if (!fields) return undefined;

  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      Array.isArray(value)
        ? value[0] ?? "Invalid value"
        : value,
    ]),
  );
}

// ---------------------------------------------
// Request interceptor
// Automatically attach access token
// ---------------------------------------------

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = tokenStore.get();

    if (accessToken) {
      config.headers.set(
        "Authorization",
        `Bearer ${accessToken}`,
      );
    }

    return config;
  },
);

// ---------------------------------------------
// Refresh token management
// ---------------------------------------------

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  // Reuse an existing refresh request if one is running
  if (!refreshPromise) {
    const baseURL = (
      apiClient.defaults.baseURL ?? ""
    ).replace(/\/$/, "");

    refreshPromise = axios
      .post<ApiResponse<RefreshResponse>>(
        `${baseURL}/auth/refresh`,
        {},
        {
          withCredentials: true,
          timeout: 15_000,
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      .then(({ data }) => {
        const newAccessToken = data.data.accessToken;

        if (!newAccessToken) {
          throw new Error("Invalid refresh response");
        }

        tokenStore.set(newAccessToken);

        return newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

// ---------------------------------------------
// Authentication endpoint exclusion
// ---------------------------------------------

function shouldSkipRefresh(url?: string): boolean {
  if (!url) return false;

  const excludedEndpoints = [
    "/auth/login",
    "/auth/register",
    "/auth/verify-2fa",
    "/auth/refresh",
    "/auth/logout",
    "/auth/verify-email",
    "/auth/resend-verification",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];

  return excludedEndpoints.some((endpoint) =>
    url.includes(endpoint),
  );
}

// ---------------------------------------------
// Response interceptor
// Automatic refresh + retry + error handling
// ---------------------------------------------

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError<ErrorResponse>) => {
    const originalRequest = error.config as
      | RetryConfig
      | undefined;

    const status = error.response?.status;

    // 1. Handle expired access token
    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !shouldSkipRefresh(originalRequest.url)
    ) {
      originalRequest._retry = true;

      try {
        // 2. Get a new access token
        const newAccessToken = await refreshAccessToken();

        // 3. Update authorization header
        originalRequest.headers.set(
          "Authorization",
          `Bearer ${newAccessToken}`,
        );

        // 4. Retry the original request
        return apiClient(originalRequest);

      } catch {
        // Refresh failed: session is no longer usable
        tokenStore.clear();
      }
    }

    // Clear token if the retried request still receives 401
    if (
      status === 401 &&
      originalRequest?._retry
    ) {
      tokenStore.clear();
    }

    // -----------------------------------------
    // Existing error handling
    // -----------------------------------------

    if (!error.response) {
      const message =
        error.code === "ECONNABORTED"
          ? "Request timed out. Please try again."
          : "Unable to connect to the server. Check your connection.";

      return Promise.reject(
        new ApiError(message, 0, "NETWORK_ERROR"),
      );
    }

    const { status: responseStatus, data, headers } =
      error.response;

    const messages: Record<number, string> = {
      400: "Invalid request.",
      401: "Please sign in to continue.",
      403: "You do not have permission.",
      404: "Resource not found.",
      409: "This account already exists.",
      422: "Please check the information provided.",
      429: "Too many attempts. Please try again later.",
      500: "An unexpected server error occurred.",
      502: "The service is temporarily unavailable.",
      503: "The service is temporarily unavailable.",
    };

    // Retry-After header
    const retryAfterHeader = headers["retry-after"];

    const retryAfterValue = Array.isArray(retryAfterHeader)
      ? retryAfterHeader[0]
      : retryAfterHeader;

    const parsedRetryAfter = Number(retryAfterValue);

    const retryAfter =
      retryAfterValue != null &&
      retryAfterValue !== "" &&
      Number.isFinite(parsedRetryAfter)
        ? parsedRetryAfter
        : undefined;

    // Backend error message
    const serverMessage =
      data?.error?.message ?? data?.message;

    const message =
      responseStatus >= 500
        ? messages[responseStatus] ?? messages[500]
        : serverMessage ??
          messages[responseStatus] ??
          "Something went wrong. Please try again.";

    return Promise.reject(
      new ApiError(
        message,
        responseStatus,
        data?.error?.code ?? data?.code,
        normalizeFields(
          data?.error?.fieldErrors ??
          data?.fieldErrors ??
          data?.errors,
        ),
        retryAfter,
      ),
    );
  },
);
