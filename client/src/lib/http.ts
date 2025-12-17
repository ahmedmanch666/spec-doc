export class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export async function fetchJson<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  // Get token from localStorage
  const token = localStorage.getItem("auth_token");
  
  // Merge headers
  const headers = new Headers(init?.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(input, {
    ...init,
    headers,
  });

  if (!res.ok) {
    // Handle 401 Unauthorized - clear auth and redirect to login
    if (res.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      if (window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }

    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      message = data?.error || data?.message || message;
    } catch {
      // ignore
    }

    throw new HttpError(message, res.status);
  }

  return res.json() as Promise<T>;
}
