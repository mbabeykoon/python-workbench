import * as vscode from "vscode";

import { runCode } from "./runner";

import { getInterpreter } from "./interpreter";

let outputChannel: vscode.OutputChannel;

async function executeCode(
  code: string,
  cwd: string,
  resource?: vscode.Uri,
): Promise<void> {
  let interpreter;

  try {
    interpreter = await getInterpreter(resource);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    vscode.window.showErrorMessage(
      `Python Workbench could not resolve a Python interpreter: ${message}`,
    );

    return;
  }

  const result = runCode({
    cwd,
    interpreter,
  });

  const child = result.child;

  outputChannel.clear();

  outputChannel.show(true);

  outputChannel.appendLine("Python Workbench");

  outputChannel.appendLine(
    `Interpreter: ${interpreter.label ?? interpreter.command}`,
  );

  outputChannel.appendLine("----------------------------------------");

  child.stdout.on("data", (data) => {
    outputChannel.append(data.toString());
  });

  child.stderr.on("data", (data) => {
    outputChannel.append(data.toString());
  });

  child.on("error", (error) => {
    outputChannel.appendLine("");

    outputChannel.appendLine(`Failed to start Python: ${error.message}`);

    vscode.window.showErrorMessage(
      "Python Workbench could not start the selected Python interpreter.",
    );
  });

  child.on("close", (exitCode) => {
    outputChannel.appendLine("");

    outputChannel.appendLine("----------------------------------------");

    outputChannel.appendLine(`Process exited with code ${exitCode}`);
  });

  child.stdin.write(code);

  child.stdin.end();
}

export function activate(context: vscode.ExtensionContext): void {
  outputChannel = vscode.window.createOutputChannel("Python Workbench");

  const runSelection = vscode.commands.registerCommand(
    "python-workbench.runSelection",

    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage("No active editor.");

        return;
      }

      const selection = editor.selection;

      if (selection.isEmpty) {
        vscode.window.showWarningMessage("Select some Python code first.");

        return;
      }

      const code = editor.document.getText(selection);

      const workspaceFolder = vscode.workspace.getWorkspaceFolder(
        editor.document.uri,
      );

      const cwd = workspaceFolder?.uri.fsPath ?? process.cwd();

      await executeCode(code, cwd, editor.document.uri);
    },
  );

  const openScratch = vscode.commands.registerCommand(
    "python-workbench.openScratch",

    async () => {
      const document = await vscode.workspace.openTextDocument({
        language: "python",
        content: "",
      });

      await vscode.window.showTextDocument(document);
    },
  );

  const runScratch = vscode.commands.registerCommand(
    "python-workbench.runScratch",

    async () => {
      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage("No active editor.");

        return;
      }

      if (
        editor.document.uri.scheme !== "untitled" ||
        editor.document.languageId !== "python"
      ) {
        vscode.window.showWarningMessage(
          "Run Scratch is only available for an untitled Python document.",
        );

        return;
      }

      const code = editor.document.getText();

      if (!code.trim()) {
        vscode.window.showWarningMessage("Scratch editor is empty.");

        return;
      }

      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

      const cwd = workspaceFolder?.uri.fsPath ?? process.cwd();

      /*
       * For an untitled scratch buffer, use the
       * workspace folder URI as the resource context.
       *
       * This allows the Python extension to return
       * the interpreter selected for that workspace.
       */
      const resource = workspaceFolder?.uri;

      await executeCode(code, cwd, resource);
    },
  );

  context.subscriptions.push(
    runSelection,
    openScratch,
    runScratch,
    outputChannel,
  );
}

export function deactivate(): void {}
