import child_process from "child_process";
import os from "os";

export const runVitest = (configPath: string, env?: object) => {
  const vitestCommand = `vitest${os.platform() === "win32" ? ".cmd" : ""}`;
  return child_process.spawnSync(vitestCommand, ["run", `--config=${configPath}`], {
    env: {
      ...process.env,
      ...(env
        ? env
        : {
            GITHUB_ACTIONS: undefined,
            GITHUB_SERVER_URL: undefined,
            GITHUB_REPOSITORY: undefined,
            GITHUB_SHA: undefined,
            GITHUB_WORKSPACE: undefined,
          }),
    },
  });
};
