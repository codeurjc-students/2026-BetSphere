import { defineConfig, configDefaults } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setupTests.ts", // Apuntando a tu setup
    exclude: [
      ...configDefaults.exclude,
      "tests/integration/**",
      "tests/system/**",
    ],
    coverage: {
      provider: "v8",
      include: ["app/**/*.{ts,tsx}"],
      reporter: ["text", "html"],
    },
  },
});