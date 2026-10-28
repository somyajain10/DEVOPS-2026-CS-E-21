const API_BASE_URL = import.meta.env.VITE_API_URL || "https://devops-2026-cs-e-21.onrender.com";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers || {});

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "The request could not be completed");
  }
  return data;
}
