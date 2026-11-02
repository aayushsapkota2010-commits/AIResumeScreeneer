export const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const BACKEND_ORIGIN = (API_BASE_URL || "").replace(/\/api\/?$/, "");

export const GOOGLE_LOGIN_URL =
    `${BACKEND_ORIGIN}/oauth2/authorization/google`;
