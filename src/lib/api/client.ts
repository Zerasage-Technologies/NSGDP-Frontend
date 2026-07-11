// Centralised, typed API client (Frontend PRD §7).
// Adds base URL, sends auth cookies, and normalises errors so the UI
// can map them consistently to toasts / inline messages.

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string; // Optional access token for authenticated requests
}

/**
 * Get access token from localStorage
 * Returns null if not found or in SSR context
 */
function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers, token, ...rest } = options;

  // Use provided token or get from localStorage
  const accessToken = token ?? getAccessToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    credentials: "include", // send httpOnly session cookie
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = res.statusText;
    let details: unknown;
    try {
      const data = await res.json();
      message = data?.message ?? message;
      details = data;
    } catch {
      // non-JSON error body — keep statusText
    }
    throw new ApiError(res.status, message, details);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
