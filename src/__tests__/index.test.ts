import * as fs from "fs/promises";
import path from "path";

import { beforeAll, describe, expect, it } from "vitest";

import { runVitest } from "./helpers/command.js";

const vitestConfig = path.resolve(__dirname, "fixtures", "vitest.config.mts");
const expectedPath = path.resolve(__dirname, "fixtures", "expected-flat.md");
const outputPath = path.resolve(__dirname, "fixtures", "dist", "report-flat.md");

const vitestNestedConfig = path.resolve(__dirname, "fixtures", "vitest-nested.config.mts");
const expectedNestedPath = path.resolve(__dirname, "fixtures", "expected-nested.md");
const outputNestedPath = path.resolve(__dirname, "fixtures", "dist", "report-nested.md");

const rootDir = path.resolve(__dirname, "..", "..");

const env = {
  GITHUB_ACTIONS: "true",
  GITHUB_SERVER_URL: "https://github.com",
  GITHUB_REPOSITORY: "pecirep/vitest-markdown-reporter",
  GITHUB_SHA: "main",
  GITHUB_WORKSPACE: rootDir,
};

describe("vitest-markdown-reporter", () => {
  beforeAll(async () => {
    await fs.rm(path.dirname(outputPath), { recursive: true, force: true });
    await fs.rm(path.dirname(outputNestedPath), { recursive: true, force: true });
  });
  it("can print flat report to a file", async () => {
    const result = runVitest(vitestConfig, env);

    const stderr = result.stderr.toString();
    if (stderr.length > 0) console.log(stderr);
    const stdout = result.stdout.toString();
    if (stdout.length > 0) console.log(stdout);
    expect(result.error).toBeUndefined();

    const rawOutput = await fs.readFile(outputPath, "utf-8");
    const output = rawOutput
      .replace(/\| .+ \| \d(\.\d+)? s \|/, "| x | x s |")
      .replace(/(\d+ passed, \d+ failed, \d+ skipped, \d+ todo), done in \d+(\.\d+)? s/g, "$1, done in x s");

    const expectedReport = await fs.readFile(expectedPath, "utf-8");

    expect(output).toBe(expectedReport);
  });

  it("can print nested report to a file", async () => {
    const result = runVitest(vitestNestedConfig, env);

    const stderr = result.stderr.toString();
    if (stderr.length > 0) console.log(stderr);
    const stdout = result.stdout.toString();
    if (stdout.length > 0) console.log(stdout);
    expect(result.error).toBeUndefined();

    const rawOutput = await fs.readFile(outputNestedPath, "utf-8");
    const output = rawOutput
      .replace(/\| .+ \| \d(\.\d+)? s \|/, "| x | x s |")
      .replace(/(\d+ passed, \d+ failed, \d+ skipped, \d+ todo), done in \d+(\.\d+)? s/g, "$1, done in x s");

    const expectedReport = await fs.readFile(expectedNestedPath, "utf-8");

    expect(output).toBe(expectedReport);
  });
});
