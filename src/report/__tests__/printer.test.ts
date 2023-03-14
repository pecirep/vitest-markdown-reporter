import fs from "fs";
import path from "path";

import { describe, expect, it } from "vitest";

import { printReport } from "../printer.js";

import { report } from "./fixtures/printer/input-report.js";

const expectedFlat = fs.readFileSync(path.resolve(__dirname, "./fixtures/printer/expected-report-flat.md"), "utf-8");
const noPermalinkExpected = fs.readFileSync(
  path.resolve(__dirname, "./fixtures/printer/expected-report-no-permalink.md"),
  "utf-8"
);

describe("printReport", () => {
  it("should print flat report correctly", () => {
    const options = { flat: true, permalinkBaseUrl: "https://github.com/pecirep/vitest-markdown-reporter/blob/main/" };
    const actual = printReport(report, options);
    expect(actual).toBe(expectedFlat);
  });

  it("should print nested report without permalink", () => {
    const options = { flat: false };
    const actual = printReport(report, options);
    expect(actual).toBe(noPermalinkExpected);
  });
});
