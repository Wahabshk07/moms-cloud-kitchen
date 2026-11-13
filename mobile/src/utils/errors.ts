export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status = 0, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }

  get isNetwork(): boolean {
    return this.status === 0;
  }
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error instanceof ApiError) return error.message || fallback;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
