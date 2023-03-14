import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import git from "isomorphic-git";

import { parseRemoteUrl } from "./git.js";
import { Logger } from "./log.js";

import { ReporterOptions } from "./index.js";

interface PotentialVitestConfig {
  outputFile?: string | Partial<Record<string, string>>;
}

export const buildTitle = (title?: string): string => {
  return title ?? process.env.VITEST_JUNIT_SUITE_NAME ?? "Test Report";
};

export const getVitestConfigOutputFile = (config?: PotentialVitestConfig): string | undefined => {
  if (typeof config?.outputFile === "string") return config.outputFile;

  return config?.outputFile?.markdown;
};

export const buildPermalinkBaseUrl = async ({
  permalinkBaseUrl,
  viteRootDir,
  log,
}: {
  permalinkBaseUrl?: ReporterOptions["permalinkBaseUrl"];
  viteRootDir: string;
  log: Logger;
}): Promise<string | undefined> => {
  if (permalinkBaseUrl) {
    return permalinkBaseUrl;
  }

  if (process.env.GITHUB_ACTIONS) {
    if (
      !process.env.GITHUB_SERVER_URL ||
      !process.env.GITHUB_REPOSITORY ||
      !process.env.GITHUB_SHA ||
      !process.env.GITHUB_WORKSPACE
    ) {
      throw new Error(
        "The following environment variables are required for the GitHub Actions environment\n- GITHUB_SERVER_URL\n- GITHUB_REPOSITORY\n- GITHUB_SHA\n- GITHUB_WORKSPACE"
      );
    }
    const serverUrl = process.env.GITHUB_SERVER_URL;
    const repository = process.env.GITHUB_REPOSITORY;
    const commit = process.env.GITHUB_SHA;
    const rootDir = process.env.GITHUB_WORKSPACE;
    const subtree = path.relative(rootDir, viteRootDir);
    const trailingSlash = subtree.length > 0 && !subtree.endsWith("/") ? "/" : "";
    return `${serverUrl}/${repository}/blob/${commit}/${subtree}${trailingSlash}`;
  }

  const rootDir = await git
    .findRoot({ fs, filepath: viteRootDir })
    .then((dir) => dir)
    .catch(async () => undefined);
  if (rootDir === undefined) {
    log.info("permalink disabled because project is not a git repository");
    return undefined;
  }

  try {
    const remotes = await git.listRemotes({ fs, dir: rootDir });
    if (remotes.length === 0) {
      log.error("no remote URL found.");
      return undefined;
    }
    const remote = remotes[0];
    if (!remote) return undefined;
    const { serverUrl, repository } = parseRemoteUrl(remote.url);
    const commit = await git.resolveRef({ fs, dir: rootDir, ref: "HEAD" });
    const subtree = path.relative(rootDir, viteRootDir);
    const trailingSlash = subtree.length > 0 && !subtree.endsWith("/") ? "/" : "";
    return `${serverUrl}/${repository}/blob/${commit}/${subtree}${trailingSlash}`;
  } catch (e) {
    log.error(e);
    return undefined;
  }
};
