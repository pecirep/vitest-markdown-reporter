import type { TaskState } from "vitest";

import type { Report, Summary, TestFile, TestSuiteResult, TestResult } from "./types.js";

export const printReport = (report: Report, options: { flat: boolean; permalinkBaseUrl?: string }): string => {
  const resultText = [`# ${report.title}`];
  resultText.push(printSummary(report.summary));
  resultText.push(printTestFiles(report.testFiles, options));
  return resultText.join("\n\n") + "\n";
};

const printSummary = (summary: Summary): string => {
  const resultText: string[] = [];

  const startTime = new Date(summary.startTime);
  resultText.push("| 🕙 Start time | ⌛ Duration |");
  resultText.push("| --- | ---: |");
  resultText.push(`| ${startTime.toLocaleString().replace("\u202F", " ")} | ${summary.totalRunTime} s |\n`);

  resultText.push("| | ✅ Passed | ❌ Failed | ⏩ Skipped | 🚧 Todo | ⚪ Total |");
  resultText.push("| --- | ---: | ---: | ---: | ---: | ---: |");
  resultText.push(
    `|Test Suites|${summary.numPassedTestSuites}|${summary.numFailedTestSuites}|${summary.numSkippedTestSuites}|${summary.numTodoTestSuites}|${summary.numTotalTestSuites}|`
  );
  resultText.push(
    `|Tests|${summary.numPassedTests}|${summary.numFailedTests}|${summary.numSkippedTests}|${summary.numTodoTests}|${summary.numTotalTests}|`
  );
  return resultText.join("\n");
};

const printTestFiles = (testFiles: TestFile[], options: { flat: boolean; permalinkBaseUrl?: string }): string => {
  const resultText: string[] = [];
  for (const [index, file] of testFiles.entries()) {
    const state = printState(file.state);
    const headerText = `<a id="file${index}" href="#file${index}">${file.filePath}</a>`;
    const link = options.permalinkBaseUrl ? ` [[link](${options.permalinkBaseUrl + file.filePath})]` : "";
    resultText.push(`## ${state} ${headerText}${link}`);

    resultText.push(
      `${file.numPassingTests} passed, ${file.numFailingTests} failed, ${file.numSkippedTests} skipped, ${file.numTodoTests} todo, done in ${file.duration} s`
    );

    const tests = file.tests.map(printTestResult);
    const suites = options.flat ? file.suites.flatMap(flattenSuite) : file.suites;
    const printedSuites = suites.map((suite) => printSuiteResult(suite));
    resultText.push("```\n" + [...tests, ...printedSuites].join("\n") + "\n```");
  }
  return resultText.join("\n\n");
};

const flattenSuite = (suite: TestSuiteResult): TestSuiteResult[] => {
  const suites = suite.suites.map((s) => ({ ...s, name: suite.name + " \u203A " + s.name })).flatMap(flattenSuite);
  return [...suites, { ...suite, suites: [] }];
};

const printTestResult = (test: TestResult) => `${printState(test.state)} ${test.name}`;

const printSuiteResult = (suite: TestSuiteResult, level = 1): string => {
  const suites = suite.suites.map((s) => "   ".repeat(level) + printSuiteResult(s, level + 1));
  const tests = suite.tests.map((t) => "   ".repeat(level) + printTestResult(t));
  const title = printTestResult(suite);
  return [title, ...tests, ...suites].join("\n");
};

const printState = (state: TaskState | undefined): string => {
  switch (state) {
    case "pass":
      return "✅";
    case "fail":
      return "❌";
    case "skip":
      return "⏩";
    case "todo":
      return "🚧";
    case "only":
      return "⭐";
    default:
      return "??";
  }
};
