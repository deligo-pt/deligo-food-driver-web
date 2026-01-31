const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

type ApiConfig = RequestInit & {
  headers?: HeadersInit;
};

async function apiRequest<T>(url: string, options: ApiConfig = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    credentials: "include", // send cookies
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  // handle HTTP errors (fetch does NOT throw automatically)
  if (!response.ok) {
    let message = "Request failed";
    try {
      const error = await response.json();
      message = error?.message || message;
    } catch {
      message = `${response.status} ${response.statusText}`;
    }
    throw new Error(message);
  }

  // handle empty responses (204 No Content)
  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

// =====================
// PUBLIC API METHODS
// =====================

export const postData = <T, B = unknown>(
  url: string,
  data: B,
  config?: ApiConfig,
): Promise<T> => {
  return apiRequest<T>(url, {
    method: "POST",
    body: JSON.stringify(data),
    ...config,
  });
};