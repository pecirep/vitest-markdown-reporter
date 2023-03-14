import type { TaskState } from "vitest";

export type Report = {
  title: string;
  summary: Summary;
  testFiles: TestFile[];
};

export type Summary = {
  startTime: number;
  totalRunTime: number;
  numPassedTestSuites: number;
  numFailedTestSuites: number;
  numSkippedTestSuites: number;
  numTodoTestSuites: number;
  numTotalTestSuites: number;
  numPassedTests: number;
  numFailedTests: number;
  numSkippedTests: number;
  numTodoTests: number;
  numTotalTests: number;
};

export type TestFile = {
  filePath: string;
  numPassingTests: number;
  numFailingTests: number;
  numSkippedTests: number;
  numTodoTests: number;
  duration: number;
} & TestSuiteResult;

export type TestSuiteResult = {
  tests: TestResult[];
  suites: TestSuiteResult[];
} & TestResult;

export type TestResult = {
  name: string;
  state?: TaskState;
};
