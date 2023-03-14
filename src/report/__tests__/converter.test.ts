import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { convertResultsToReport } from "../converter.js";

import { report as expected } from "./fixtures/converter/expected-report.js";
import { testResults } from "./fixtures/converter/input-results.js";
import { testDuration, testStartTime } from "./helpers/datetime.js";

delete process.env.GITHUB_REPOSITORY;
delete process.env.GITHUB_SHA;

const title = "My Report";
const viteRootDir = "/path/to/rootDir/";

describe("convertResultsToReport", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(testStartTime);
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it("should convert results to report", () => {
    const actual = convertResultsToReport(testResults, testStartTime.getTime(), title, viteRootDir);
    actual.summary.totalRunTime = testDuration;
    expect(actual).toStrictEqual(expected);
  });
});
