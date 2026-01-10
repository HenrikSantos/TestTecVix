import axios, { AxiosError } from "axios";

export interface IResponse<T> {
  message: string;
  error: boolean;
  err: unknown;
  data: T;
}

const getToken = (): string | null => {
  try {
    const userProfile = localStorage.getItem("userProfile");
    if (userProfile) {
      const parsed = JSON.parse(userProfile);
      return parsed.state?.token || null;
    }
    return null;
  } catch {
    return null;
  }
};

export const baseAuth = (auth: Record<string, unknown> = {}) => {
  const signature = import.meta.env.VITE_SIGN_HASH || "";
  const token = getToken();

  return {
    headers: {
      "x-sign": signature,
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...auth,
    },
  };
};

const retryRequest = async <T>({
  method = "GET",
  url = "",
  data = {},
  auth = {},
  params = {},
  timeout = 50000,
  fullEndpoint = "",
} = {}): Promise<IResponse<T>> => {
  try {
    const BASE_URL =
      import.meta.env.VITE_BASE_URL || "http://localhost:3001/api/v1";
    const nAuth = baseAuth(auth);
    const response: { data: T } = await axios({
      ...(timeout && { timeout }),
      method,
      url: fullEndpoint || `${BASE_URL}${url}`,
      data,
      params,
      ...nAuth,
    });

    return { data: response.data, error: false, err: null, message: "" };
  } catch (error) {
    let message = "Unknown error";
    if (error instanceof AxiosError) {
      message = error?.response?.data?.message || error.message;
    }
    return { message, error: true, err: error, data: [] as T };
  }
};

const app = async <T>({
  method = "GET",
  url = "",
  data = {},
  auth = {},
  params = {},
  timeout = 80000,
  fullEndpoint = "",
  tryRefetch = false,
} = {}): Promise<IResponse<T>> => {
  try {
    const BASE_URL =
      import.meta.env.VITE_BASE_URL || "http://localhost:3001/api/v1";
    const nAuth = baseAuth(auth);
    const response: { data: T } = await axios({
      ...(timeout && { timeout }),
      method,
      url: fullEndpoint || `${BASE_URL}${url}`,
      data,
      params,
      ...nAuth,
    });

    return { data: response.data, error: false, err: null, message: "" };
  } catch (error) {
    let message = "Unknown error";
    if (error instanceof AxiosError) {
      if (
        error.status === 403 ||
        (error.code === "ECONNABORTED" && error.message.includes("timeout"))
      ) {
        if (tryRefetch) {
          // implementar um log de registros desses erros
          return retryRequest<T>({
            method,
            url,
            data,
            auth,
            params,
            timeout: timeout * 2 || undefined,
            fullEndpoint,
          });
        }
      }
      message = error?.response?.data?.message || error.message;
    }
    return { message, error: true, err: error, data: [] as T };
  }
};

const get = async <T>({
  url = "",
  data = {},
  auth = {},
  params = {},
  timeout = undefined,
  fullEndpoint = "",
  tryRefetch = false,
} = {}) => {
  return app<T>({
    method: "GET",
    url,
    auth,
    data,
    params,
    timeout,
    fullEndpoint,
    tryRefetch,
  });
};

const remove = async <T>({
  url = "",
  data = {},
  auth = {},
  timeout = undefined,
  fullEndpoint = "",
  tryRefetch = false,
}) =>
  app<T>({
    method: "DELETE",
    url,
    data,
    auth,
    timeout,
    fullEndpoint,
    tryRefetch,
  });

const put = async <T>({
  url = "",
  data = {},
  auth = {},
  timeout = undefined,
  fullEndpoint = "",
  tryRefetch = false,
}) => {
  return app<T>({
    method: "PUT",
    url,
    data,
    auth,
    timeout,
    fullEndpoint,
    tryRefetch,
  });
};

const post = async <T>({
  url = "",
  data = {},
  auth = {},
  timeout = undefined,
  fullEndpoint = "",
  tryRefetch = false,
}) =>
  app<T>({
    method: "POST",
    url,
    data,
    auth,
    timeout,
    fullEndpoint,
    tryRefetch,
  });

export const api = {
  get,
  delete: remove,
  put,
  post,
};
