import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

const apiTarget = process.env.API_PROXY_TARGET ?? "https://localhost:443";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  server: {
    proxy: {
      "/api": {
        target: apiTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
