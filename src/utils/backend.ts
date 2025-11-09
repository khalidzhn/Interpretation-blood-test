export function getBackendUrl() {
  // In development, use the local proxy. In production, use the environment variable
  if (import.meta.env.DEV) {
    return "";
  }
  return import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
}
