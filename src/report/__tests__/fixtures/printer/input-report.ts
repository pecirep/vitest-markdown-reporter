import type { Report, TestFile } from "../../../types.js";
import { testDuration, testStartTime } from "../../helpers/datetime.js";

const testFiles: TestFile[] = [
  {
    filePath: "src/__tests__/sample-1.test.ts",
    numPassingTests: 11,
    numFailingTests: 1,
    numSkippedTests: 4,
    numTodoTests: 2,
    duration: 5,
    name: "sample-1.test.ts",
    state: "fail",
    suites: [
      {
        name: "describe depth 1",
        state: "fail",
        suites: [
          {
            name: "describe depth 2",
            state: "pass",
            suites: [
              {
                name: "describe depth 3",
                state: "pass",
                suites: [],
                tests: [
                  {
                    name: "test 1",
                    state: "pass",
                  },
                  {
                    name: "test 2",
                    state: "pass",
                  },
                ],
              },
            ],
            tests: [
              {
                name: "test 1",
                state: "pass",
              },
              {
                name: "test 2",
                state: "pass",
              },
            ],
          },
          {
            name: "describe depth 2-2",
            state: "pass",
            suites: [],
            tests: [
              {
                name: "test 1",
                state: "pass",
              },
              {
                name: "test 2",
                state: "todo",
              },
            ],
          },
        ],
        tests: [
          {
            name: "test 1",
            state: "fail",
          },
          {
            name: "test 2",
            state: "pass",
          },
          {
            name: "test 3",
            state: "skip",
          },
          {
            name: "test 4",
            state: "pass",
          },
        ],
      },
      {
        name: "describe depth 1-2",
        state: "pass",
        suites: [],
        tests: [
          {
            name: "parametarized: 1",
            state: "pass",
          },
          {
            name: "parametarized: 2",
            state: "pass",
          },
          {
            name: "parametarized: 1",
            state: "pass",
          },
          {
            name: "parametarized: 2",
            state: "pass",
          },
        ],
      },
      {
        name: "describe depth 1-3",
        state: "skip",
        suites: [],
        tests: [
          {
            name: "test 1",
            state: "skip",
          },
          {
            name: "test 2",
            state: "skip",
          },
        ],
      },
      {
        name: "describe depth 1-4",
        state: "todo",
        suites: [],
        tests: [],
      },
      {
        name: "describe depth 1-5",
        state: "skip",
        suites: [],
        tests: [
          {
            name: "test 1",
            state: "todo",
          },
          {
            name: "test 2",
            state: "skip",
          },
        ],
      },
    ],
    tests: [],
  },
  {
    filePath: "src/__tests__/sample-2.test.ts",
    numPassingTests: 4,
    numFailingTests: 0,
    numSkippedTests: 0,
    numTodoTests: 0,
    duration: 4,
    name: "sample-2.test.ts",
    state: "pass",
    suites: [
      {
        name: "describe depth 1",
        state: "pass",
        suites: [],
        tests: [
          {
            name: "test 1",
            state: "pass",
          },
          {
            name: "test 2",
            state: "pass",
          },
          {
            name: "test 3",
            state: "pass",
          },
          {
            name: "test 4",
            state: "pass",
          },
        ],
      },
    ],
    tests: [],
  },
];

export const report: Report = {
  title: "My Report",
  summary: {
    numPassedTests: 67,
    numFailedTests: 43,
    numTodoTests: 13,
    numSkippedTests: 3,
    numTotalTests: 45,
    numPassedTestSuites: 38,
    numFailedTestSuites: 7,
    numTodoTestSuites: 2,
    numSkippedTestSuites: 1,
    numTotalTestSuites: 123,
    startTime: testStartTime.getTime(),
    totalRunTime: testDuration,
  },
  testFiles: testFiles,
};
