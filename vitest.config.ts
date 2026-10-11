import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    // Mirror tsconfig "paths" ("@/*" -> "./*") so modules under test can
    // import "@/lib/..." exactly as the app code does.
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["modules/**/__tests__/**/*.test.ts"],
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
