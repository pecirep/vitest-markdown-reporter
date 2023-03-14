# vitest-markdown-reporter

[![npm version](https://badge.fury.io/js/vitest-markdown-reporter.svg)](https://badge.fury.io/js/vitest-markdown-reporter)
[![codecov](https://codecov.io/gh/pecirep/vitest-markdown-reporter/branch/main/graph/badge.svg?token=K1X4K9S9UU)](https://codecov.io/gh/pecirep/vitest-markdown-reporter)
[![test](https://github.com/pecirep/vitest-markdown-reporter/actions/workflows/test.yml/badge.svg)](https://github.com/pecirep/vitest-markdown-reporter/actions/workflows/test.yml)
[![lint](https://github.com/pecirep/vitest-markdown-reporter/actions/workflows/lint.yml/badge.svg)](https://github.com/pecirep/vitest-markdown-reporter/actions/workflows/lint.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Generating a pretty Markdown report for Vitest, based on [jest-md-dashboard](https://github.com/mshrtsr/jest-md-dashboard), markdown design heavily inspired by [Test Reporter](https://github.com/dorny/test-reporter/).

## Table of Contents

- [Example](#Example)
- [Installation](#Installation)
- [Usage](#Usage)
- [Options](#Options)
- [Contribution](#Contribution)
- [License](#License)

## Example

See https://github.com/pecirep/vitest-markdown-reporter/issues/1

## Installation

### pnpm

```shell
pnpm install -D vitest-markdown-reporter
```

## Usage

Add `reporters` field in `vitest.config.ts` or under `test` in `vite.config.ts`.

```ts
/// <reference types="vitest" />
import { defineConfig } from "vite";
import { VitestMarkdownReporter } from "vitest-markdown-reporter";

export default defineConfig({
  test: {
    reporters: ["default", new VitestMarkdownReporter()],
    outputFile: {
      markdown: "test-report.md",
    },
  },
});
```

Run vitest and the report will be saved to `test-report.md`. If neither Vitest's native `outputFile` option nor this library's own is used, the report will instead be printed to the console.

### With [options](#Options)

```ts
/// <reference types="vitest" />
import { defineConfig } from "vite";
import { VitestMarkdownReporter } from "vitest-markdown-reporter";

export default defineConfig({
  test: {
    reporters: [
      "default",
      new VitestMarkdownReporter({ title: "My Test Report" }),
    ],
    outputFile: {
      markdown: "test-report.md",
    },
  },
});
```

### Options

| Name                         | Type      | Default         | Description                                                                                 |
| ---------------------------- | --------- | --------------- | ------------------------------------------------------------------------------------------- |
| `title`                      | `string`  | `"Test Report"` | The title of the report.<br>It will be printed at the top of the markdown output.           |
| `outputPath`                 | `string`  | `undefined`     | The file path to save the report to.<br>                                                    |
| `permalinkBaseUrl`           | `string`  | `undefined`     | Override baseUrl of permalink.<br>See [Permalink](#Permalink) section for more information. |
| `enableGithubActionsSummary` | `boolean` | `true`          | Enable GitHub Actions summary when running in CI.                                           |
| `flat`                       | `boolean` | `true`          | Flatten Test suites in report.                                                              |

### Permalink

vitest-markdown-reporter generates permalinks to test files on GitHub (or other services) by default.

It tries to find git information from the following sources.

1. `permalinkBaseUrl` option
2. (on GitHub Actions) environment variables
3. (in git repository) repository config

#### 1. `permalinkBaseUrl` option

If `permalinkBaseUrl` is supplied vitest-markdown-reporter will use it to generate permalinks.

Specify this option when if generated permalinks are incorrect.

The URL must have a trailing slash.

e.g. `https://github.com/pecirep/vitest-markdown-reporter/blob/`

#### 2. Run on GitHub Actions

If vitest runs on GitHub Actions, vitest-markdown-reporter refers to the the [environment variables](https://docs.github.com/ja/actions/learn-github-actions/environment-variables).

#### 3. Run in git repository

If vitest runs in a git repository, vitest-markdown-reporter refers to the local repository config.

## Contribution

We appreciate your help!

## License

- [MIT](LICENSE)
