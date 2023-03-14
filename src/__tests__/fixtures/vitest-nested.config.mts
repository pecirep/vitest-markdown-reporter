import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";

import { VitestMarkdownReporter } from "../../../src/index.js";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: __dirname,
  test: {
    include: ["*.test.ts"],
    reporters: [
      "basic",
      new VitestMarkdownReporter({
        outputPath: path.resolve(__dirname, "dist", "report-nested.md"),
        flat: false,
      }),
    ],
  },
});
