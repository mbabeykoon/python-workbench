import { spawn, ChildProcessWithoutNullStreams } from "child_process";

export interface PythonInterpreter {
  command: string;
  args?: string[];
  label?: string;
}

export interface RunOptions {
  cwd: string;
  interpreter: PythonInterpreter;
}

export interface RunResult {
  interpreter: PythonInterpreter;
  child: ChildProcessWithoutNullStreams;
}

export function runCode(options: RunOptions): RunResult {
  const { cwd, interpreter } = options;

  const args = [...(interpreter.args ?? []), "-"];

  const child = spawn(interpreter.command, args, {
    cwd,
    shell: false,

    env: {
      ...process.env,

      PYTHONIOENCODING: "utf-8",

      PYTHONUNBUFFERED: "1",
    },
  });

  return {
    interpreter,
    child,
  };
}
