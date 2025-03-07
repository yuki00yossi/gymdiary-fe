import axios from "axios";
import { useNavigate } from "react-router";

// Axiosインスタンスの作成
const ApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_ROOT ?? "http://localhost",
  withCredentials: true, // Cookieを送信するための設定
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// クッキーから `csrftoken` を取得する関数
const getCsrfTokenFromCookie = () => {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === "csrftoken") {
      return value;
    }
  }
  return null;
};

// リクエストインターセプターで `X-CSRFToken` を設定
ApiClient.interceptors.request.use(
  async (config) => {
    const csrfToken = getCsrfTokenFromCookie();
    if (csrfToken) {
      config.headers["X-CSRFToken"] = csrfToken; // Django の CSRF ヘッダーにセット
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// レスポンスインターセプターで 403 や 401 の場合にリダイレクト
export const setupResponseInterceptor = (
  navigate: ReturnType<typeof useNavigate>
) => {
  ApiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // CSRF トークンのリフレッシュ (Django が `419` を返すことはないが、 `403` で対応)
      if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        return ApiClient(originalRequest);
      }

      // 403: ログインが必要な場合はリダイレクト
      if (error.response?.status === 403) {
        navigate("/login");
      }

      return Promise.reject(error);
    }
  );
};

export default ApiClient;
