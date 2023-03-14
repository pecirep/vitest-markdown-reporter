import { defineConfig } from "vitest/config";

export default defineConfig({
  root: ".",
  resolve: {
    alias: [{ find: /^(\.{1,3}\/.*)\.js$/, replacement: "$1" }],
  },
  test: {
    include: ["src/**/__tests__/**/*.test.ts"],
    exclude: ["**/__tests__/fixtures/**"],
    clearMocks: true,
    coverage: {
      provider: "istanbul",
      exclude: ["**/__tests__/**"],
      reporter: ["lcov", "text-summary", "html", "cobertura", "json"],
      reportsDirectory: "./coverage",
    },
  },
});
