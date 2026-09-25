const API_URL = "http://127.0.0.1:8000";

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("menswear_token");

  const isFormData = options.body instanceof FormData;
  const isUrlEncoded = options.body instanceof URLSearchParams;

  const headers = {
    ...(isFormData
      ? {}
      : isUrlEncoded
      ? {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      : {
          "Content-Type": "application/json",
        }),
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      "Something went wrong.";

    throw new Error(
      Array.isArray(message)
        ? message.map((item) => item.msg).join(", ")
        : message
    );
  }

  return data;
}

export const api = {
  get(endpoint) {
    return apiRequest(endpoint, {
      method: "GET",
    });
  },

  post(endpoint, body) {
    return apiRequest(endpoint, {
      method: "POST",
      body:
        body instanceof FormData || body instanceof URLSearchParams
          ? body
          : JSON.stringify(body),
    });
  },

  put(endpoint, body) {
    return apiRequest(endpoint, {
      method: "PUT",
      body:
        body instanceof FormData || body instanceof URLSearchParams
          ? body
          : JSON.stringify(body),
    });
  },

  patch(endpoint, body) {
    return apiRequest(endpoint, {
      method: "PATCH",
      body:
        body instanceof FormData || body instanceof URLSearchParams
          ? body
          : JSON.stringify(body),
    });
  },

  delete(endpoint) {
    return apiRequest(endpoint, {
      method: "DELETE",
    });
  },
};

export { API_URL };

export default api;