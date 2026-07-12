import axios, { AxiosError } from "axios";

type ApiErrorResponse = {
  error?: string;
  message?: string;
};

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Erro na requisição";

    return Promise.reject(new Error(message));
  }
);
