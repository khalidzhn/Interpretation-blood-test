import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
const backendUrl = process.env.VITE_BACKEND_URL || "http://backend-dev.eba-jfrvuvms.us-west-2.elasticbeanstalk.com";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/token": {
        target: backendUrl,
        changeOrigin: true,
      },
      "/hospitals": {
        target: backendUrl,
        changeOrigin: true,
      },
      "/users": {
        target: backendUrl,
        changeOrigin: true,
      },
      "/analysis-results": {
        target: backendUrl,
        changeOrigin: true,
      },
      "/upload-pdf": {
        target: backendUrl,
        changeOrigin: true,
      },
      "/lab-result": {
        target: backendUrl,
        changeOrigin: true,
      },
      "/invite": {
        target: backendUrl,
        changeOrigin: true,
      },
      "/clinics": {
        target: backendUrl,
        changeOrigin: true,
      },
      "/api": {
        target: backendUrl,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
