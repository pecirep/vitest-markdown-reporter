import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";

import { VitestMarkdownReporter } from "./src/index.js";
import baseConfig from "./vitest.config.mjs";

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      reporters: [
        "default",
        new VitestMarkdownReporter({
          outputPath: "./test-report.md",
          enableGithubActionsSummary: false,
        }),
      ],
    },
  })
);
