const API_BASE = '/api';

/**
 * Generic API fetch wrapper — replaces the old Electron IPC invokeIPC().
 * Handles JSON parsing, auth errors (401 → redirect to login), and error messages.
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  // Default to 20-second timeout if none provided to avoid infinite loading spinners
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      signal: options.signal || controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Send session cookies
    });
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. The server took too long to respond.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status === 401) {
    // Session expired or not logged in — redirect to login
    window.location.hash = '#/login';
    throw new Error('Session expired. Please log in again.');
  }

  if (response.status === 403) {
    throw new Error('Access denied. You do not have permission for this action.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  // Handle empty responses (204 No Content)
  const text = await response.text();
  if (!text) return null as T;

  return JSON.parse(text);
}

// Convenience methods
export const api = {
  get: <T = any>(endpoint: string) => apiFetch<T>(endpoint),

  post: <T = any>(endpoint: string, data?: any) =>
    apiFetch<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = any>(endpoint: string, data?: any) =>
    apiFetch<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = any>(endpoint: string, data?: any) =>
    apiFetch<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(endpoint: string) =>
    apiFetch<T>(endpoint, { method: 'DELETE' }),
};
