import axios, { AxiosError } from "axios";
import { ApiError, type FieldErrors } from "./api-error";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 15_000,
});

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

function normalizeFields(
  fields?: Record<string, string | string[]>,
): FieldErrors | undefined {
  if (!fields) return undefined;

  return Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] ?? "Invalid value" : value,
    ]),
  );
}

apiClient.interceptors.response.use(
  (response) => response,

  (error: AxiosError<ErrorResponse>) => {
    if (!error.response) {
      const message =
        error.code === "ECONNABORTED"
          ? "Request timed out. Please try again."
          : "Unable to connect to the server. Check your connection.";

      return Promise.reject(
        new ApiError(message, 0, "NETWORK_ERROR"),
      );
    }

    const { status, data, headers } = error.response;

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

    const serverMessage =
      data?.error?.message ?? data?.message;

    const message =
      status >= 500
        ? messages[status] ?? messages[500]
        : serverMessage ??
          messages[status] ??
          "Something went wrong. Please try again.";

    return Promise.reject(
      new ApiError(
        message,
        status,
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