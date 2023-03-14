import { accessSync } from "node:fs";
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { summary } from "@actions/core";
import type { Reporter, File, Vitest } from "vitest";

import { Logger } from "./log.js";
import { buildPermalinkBaseUrl, buildTitle, getVitestConfigOutputFile } from "./options.js";
import { convertResultsToReport, printReport } from "./report/index.js";

export type ReporterOptions = {
  title?: string;
  outputPath?: string;
  permalinkBaseUrl?: string;
  enableGithubActionsSummary?: boolean;
  flat?: boolean;
};

const existsSync = (path: string): boolean => {
  try {
    accessSync(path);
    return true;
  } catch {
    return false;
  }
};

export class VitestMarkdownReporter implements Reporter {
  private log: Logger;
  ctx!: Vitest;
  private start = 0;

  constructor(private readonly reporterOptions: ReporterOptions = {}) {
    this.log = new Logger();
    this.reporterOptions.enableGithubActionsSummary ??= true;
  }

  onInit(ctx: Vitest): void {
    this.ctx = ctx;
    this.start = Date.now();
  }

  onFinished = async (files: File[] = []): Promise<void> => {
    const title = buildTitle(this.reporterOptions.title);

    const permalinkBaseUrl = await buildPermalinkBaseUrl({
      permalinkBaseUrl: this.reporterOptions.permalinkBaseUrl,
      viteRootDir: this.ctx.config.root,
      log: this.log,
    });

    const flat = this.reporterOptions.flat ?? true;

    const report = convertResultsToReport(files, this.start, title, process.cwd());
    const reportText = printReport(report, { flat, permalinkBaseUrl });

    const outputPath = this.reporterOptions.outputPath ?? getVitestConfigOutputFile(this.ctx.config);

    if (outputPath) {
      const reportFile = resolve(this.ctx.config.root, outputPath);

      const outputDirectory = dirname(reportFile);
      if (!existsSync(outputDirectory)) await mkdir(outputDirectory, { recursive: true });

      await writeFile(reportFile, reportText, "utf-8");
      this.ctx.logger.log(`Markdown report written to ${reportFile}`);
    } else {
      this.ctx.logger.log(reportText);
    }

    if (process.env.GITHUB_ACTIONS && this.reporterOptions.enableGithubActionsSummary) {
      summary.addRaw(reportText);
      summary.write();
    }
  };
}

export default VitestMarkdownReporter;
