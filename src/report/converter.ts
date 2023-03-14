import path from "node:path";

import { getSuites, getTests } from "@vitest/runner/utils";
import type { File, Suite, Test, Task, TaskState } from "vitest";

import type { Report, Summary, TestFile, TestResult, TestSuiteResult } from "./types.js";

export const convertResultsToReport = (
  files: File[],
  startTime: number,
  title: string,
  viteRootDir: string
): Report => {
  const summary = convertSummary(files, startTime);
  files.sort((a, b) => a.name.localeCompare(b.name));
  const testFiles: TestFile[] = files.map((file) => convertTestFile(file, viteRootDir));
  return {
    title,
    summary,
    testFiles,
  };
};

const convertSummary = (files: File[], startTime: number): Summary => {
  const totalRunTime = (Date.now() - startTime) / 1000;

  const suites = getSuites(files);
  const numPassedTestSuites = suites.filter((s) => s.result?.state === "pass").length;
  const numFailedTestSuites = suites.filter((s) => s.result?.errors).length;
  const numSkippedTestSuites = suites.filter((s) => s.mode === "skip").length;
  const numTodoTestSuites = suites.filter((s) => s.mode === "todo").length;
  const numTotalTestSuites = suites.length;

  const tests = getTests(files);
  const numPassedTests = tests.filter((t) => t.result?.state === "pass").length;
  const numFailedTests = tests.filter((t) => t.result?.state === "fail").length;
  const numSkippedTests = tests.filter((t) => t.mode === "skip").length;
  const numTodoTests = tests.filter((t) => t.mode === "todo").length;
  const numTotalTests = tests.length;

  return {
    numPassedTests,
    numFailedTests,
    numTotalTests,
    numPassedTestSuites,
    numFailedTestSuites,
    numSkippedTestSuites,
    numTodoTestSuites,
    numTotalTestSuites,
    numSkippedTests,
    numTodoTests,
    startTime,
    totalRunTime,
  };
};

const getTaskState = (task: Task) => (task.type === "suite" ? suiteState(task) : task.result?.state ?? task.mode);

const suiteState = (suite: Suite): TaskState => {
  if (suite.result?.state) return suite.result.state;

  if (suite.tasks.some((task) => getTaskState(task) === "fail")) {
    return "fail";
  } else if (suite.tasks.some((task) => getTaskState(task) === "run")) {
    return "run";
  } else if (suite.tasks.every((task) => getTaskState(task) === "skip")) {
    return "skip";
  } else if (suite.tasks.every((task) => getTaskState(task) === "todo")) {
    return "todo";
  } else if (suite.tasks.every((task) => getTaskState(task) === "only")) {
    return "only";
  }
  return "pass";
};

const convertTestFile = (file: File, viteRootDir: string): TestFile => {
  const filePath = path.relative(viteRootDir, file.filepath);
  const duration = file.result?.duration || 0;

  const tests = getTests([file]);
  const numPassingTests = tests.filter((t) => t.result?.state === "pass").length;
  const numFailingTests = tests.filter((t) => t.result?.state === "fail").length;
  const numSkippedTests = tests.filter((t) => t.mode === "skip").length;
  const numTodoTests = tests.filter((t) => t.mode === "todo").length;

  return {
    filePath,
    numPassingTests,
    numFailingTests,
    numSkippedTests,
    numTodoTests,
    duration,
    ...getSuiteResult(file),
  };
};

const getTestResult = (test: Exclude<Task, Suite>): TestResult => {
  return {
    name: test.name,
    state: getTaskState(test),
  };
};

const getSuiteResult = (suite: Suite): TestSuiteResult => {
  return {
    name: suite.name,
    state: suiteState(suite),
    suites: suite.tasks.filter((t): t is Suite => t.type === "suite").map(getSuiteResult),
    tests: suite.tasks.filter((t): t is Exclude<Task, Suite> => t.type !== "suite").map(getTestResult),
  };
};
