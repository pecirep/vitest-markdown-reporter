import fsSync from "fs";
import fs from "fs/promises";
import os from "os";
import path from "path";

import git from "isomorphic-git";
import { beforeEach, describe, expect, it } from "vitest";

import { Logger } from "../log.js";
import { buildTitle, getVitestConfigOutputFile, buildPermalinkBaseUrl } from "../options.js";

const log = new Logger();

describe("buildTitle", () => {
  it("should return default value", () => {
    expect(buildTitle()).toBe("Test Report");
  });
  it("should return input value", () => {
    expect(buildTitle("My report")).toBe("My report");
  });
});

describe("getVitestConfigOutputFile", () => {
  it("should return default value", () => {
    expect(getVitestConfigOutputFile()).toBe(undefined);
  });
  it("should return input value", () => {
    expect(getVitestConfigOutputFile({ outputFile: { markdown: "/path/to/report.md" } })).toBe("/path/to/report.md");
  });
  it("should return default outputFile", () => {
    expect(getVitestConfigOutputFile({ outputFile: "/path/to/default/report.md" })).toBe("/path/to/default/report.md");
  });
  it("should return default value if not markdown option is provided", () => {
    expect(getVitestConfigOutputFile({ outputFile: { json: "/path/to/report.json" } })).toBe(undefined);
  });
});

describe("buildPermalinkBaseUrl", () => {
  beforeEach(() => {
    delete process.env.GITHUB_ACTIONS;
    delete process.env.GITHUB_SERVER_URL;
    delete process.env.GITHUB_REPOSITORY;
    delete process.env.GITHUB_SHA;
    delete process.env.GITHUB_WORKSPACE;
  });

  it("should return permalinkBaseUrl using user input", async () => {
    process.env.GITHUB_ACTIONS = "true";
    process.env.GITHUB_SERVER_URL = "https://github.com";
    process.env.GITHUB_REPOSITORY = "pecirep/vitest-markdown-reporter";
    process.env.GITHUB_SHA = "main";
    process.env.GITHUB_WORKSPACE = "/path/to/repository/";
    const input = "https://github.example.com/pecirep/vitest-markdown-reporter/files/develop/";
    const actual = await buildPermalinkBaseUrl({
      permalinkBaseUrl: input,
      viteRootDir: "/path/to/repository/",
      log,
    });
    expect(actual).toBe(input);
  });

  describe("on GitHub Actions", () => {
    beforeEach(() => {
      process.env.GITHUB_ACTIONS = "true";
      process.env.GITHUB_SERVER_URL = "https://github.com";
      process.env.GITHUB_REPOSITORY = "pecirep/vitest-markdown-reporter";
      process.env.GITHUB_SHA = "main";
      process.env.GITHUB_WORKSPACE = "/path/to/repository/";
    });

    it("should return permalinkBaseUrl", async () => {
      const actual = await buildPermalinkBaseUrl({
        viteRootDir: "/path/to/repository/",
        log,
      });
      const expected = "https://github.com/pecirep/vitest-markdown-reporter/blob/main/";
      expect(actual).toBe(expected);
    });

    it("should return permalinkBaseUrl (GHE)", async () => {
      process.env.GITHUB_SERVER_URL = "https://github.example.com";
      const actual = await buildPermalinkBaseUrl({
        viteRootDir: "/path/to/repository",
        log,
      });
      const expected = "https://github.example.com/pecirep/vitest-markdown-reporter/blob/main/";
      expect(actual).toBe(expected);
    });

    it("should return permalinkBaseUrl if vitest runs on subtree", async () => {
      const actual = await buildPermalinkBaseUrl({
        viteRootDir: "/path/to/repository/subtree",
        log,
      });
      const expected = "https://github.com/pecirep/vitest-markdown-reporter/blob/main/subtree/";
      expect(actual).toBe(expected);
    });

    it("should throw Error if required variables are missing", async () => {
      delete process.env.GITHUB_SERVER_URL;
      await expect(() =>
        buildPermalinkBaseUrl({
          viteRootDir: "/path/to/repository/subtree",
          log,
        })
      ).rejects.toThrow(
        "The following environment variables are required for the GitHub Actions environment\n- GITHUB_SERVER_URL\n- GITHUB_REPOSITORY\n- GITHUB_SHA\n- GITHUB_WORKSPACE"
      );
    });
  });

  describe("using local git config", () => {
    it("should return permalinkBaseUrl using git config", async () => {
      const gitProject = await fs.mkdtemp(path.join(os.tmpdir(), "vitest-markdown-reporter-"));
      await git.init({ fs: fsSync, dir: gitProject });
      await git.addRemote({
        fs: fsSync,
        dir: gitProject,
        remote: "origin",
        url: "git@github.com:pecirep/vitest-markdown-reporter.git",
      });
      const sha = await git.commit({
        fs: fsSync,
        dir: gitProject,
        message: "initial commit",
        author: { name: "test", email: "git@example.com" },
      });

      const actual = await buildPermalinkBaseUrl({
        viteRootDir: gitProject,
        log,
      });
      const expected = `https://github.com/pecirep/vitest-markdown-reporter/blob/${sha}/`;
      expect(actual).toBe(expected);
    });
    it("should return undefined if vitest runs outside of git project", async () => {
      const nonGitProject = await fs.mkdtemp(path.join(os.tmpdir(), "vitest-markdown-reporter-"));
      const actual = await buildPermalinkBaseUrl({
        viteRootDir: nonGitProject,
        log: new Logger(true),
      });
      expect(actual).toBeUndefined();
    });
  });
});
