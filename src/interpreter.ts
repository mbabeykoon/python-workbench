import * as vscode from "vscode";
import { PythonExtension } from "@vscode/python-extension";

import type { PythonInterpreter } from "./runner";

export async function getInterpreter(
  resource?: vscode.Uri,
): Promise<PythonInterpreter> {
  try {
    const pythonApi = await PythonExtension.api();

    const activeEnvironmentPath =
      pythonApi.environments.getActiveEnvironmentPath(resource);

    if (activeEnvironmentPath) {
      const environment = await pythonApi.environments.resolveEnvironment(
        activeEnvironmentPath,
      );

      const executablePath = environment?.executable.uri?.fsPath;

      if (executablePath) {
        return {
          command: executablePath,
          label: executablePath,
        };
      }
    }
  } catch (error) {
    console.warn(
      "Python Workbench could not resolve the active VS Code Python environment.",
      error,
    );
  }

  if (process.platform === "win32") {
    return {
      command: "python",
      label: "Python from PATH",
    };
  }

  return {
    command: "python3",
    label: "Python from PATH",
  };
}
