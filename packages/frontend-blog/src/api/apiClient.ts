const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

let logoutCallback: (() => void) | null = null;

export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("token");
  const baseHeaders: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  let normalizedHeaders: Record<string, string> = {};

  if (options.headers instanceof Headers) {
    normalizedHeaders = Object.fromEntries(options.headers.entries());
  } else if (options.headers) {
    normalizedHeaders = options.headers as Record<string, string>;
  }

  const headers: Record<string, string> = {
    ...baseHeaders,
    ...normalizedHeaders,
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const data = await refreshRes.json();
        localStorage.setItem("token", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);
        return apiRequest<T>(endpoint, options);
      }
    }

    localStorage.clear();
    if (logoutCallback) logoutCallback();
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `API request failed: ${res.status}.`);
  }

  return res.json() as Promise<T>;
}
