const BASE = '/api';
const TOKEN_KEY = 'medlink.token';

/** An error from the API, with the HTTP status (0 when the server could not be reached). */
export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export function setToken(token: string | null) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);else
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {

    // Storage unavailable; the user will need to sign in again after a reload.
  }}

export function getToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

interface Options {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  /** Send the staff token. Turn off for public calls (registration, QR scan, login). */
  auth?: boolean;
}

export async function api<T>(path: string, { method = 'GET', body, auth = true }: Options = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(BASE + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new ApiError('Could not reach the server. Check your connection and try again.', 0);
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const message =
    res.status === 429 ? 'Too many attempts. Wait a minute and try again.' :
    err.message ?? `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }
  return res.json() as Promise<T>;
}
