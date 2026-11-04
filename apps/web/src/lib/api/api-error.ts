
export type FieldErrors = Record<string, string>;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly fieldErrors?: FieldErrors,
    public readonly retryAfter?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
