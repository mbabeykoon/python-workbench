import * as vscode from 'vscode';
import { spawn } from 'child_process';

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {

    vscode.window.showInformationMessage(
        'UV Python Runner command started'
    );

    outputChannel = vscode.window.createOutputChannel(
        'UV Python Runner'
    );

    const runSelection = vscode.commands.registerCommand(
        'uv-python-runner.runSelection',
        () => {

            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                vscode.window.showErrorMessage(
                    'No active editor.'
                );
                return;
            }

            const selection = editor.selection;

            if (selection.isEmpty) {
                vscode.window.showWarningMessage(
                    'Select some Python code first.'
                );
                return;
            }

            const code = editor.document.getText(selection);

            const workspaceFolder =
                vscode.workspace.getWorkspaceFolder(
                    editor.document.uri
                );

            const cwd =
                workspaceFolder?.uri.fsPath ??
                process.cwd();

            outputChannel.clear();
            outputChannel.show(true);

            outputChannel.appendLine(
                `Running with uv in: ${cwd}`
            );

            outputChannel.appendLine(
                '----------------------------------------'
            );

            outputChannel.show(true);

            outputChannel.appendLine(
                `Selected code:\n${code}`
            );

            outputChannel.appendLine(
                `Working directory: ${cwd}`
            );

            outputChannel.appendLine(
                'Starting: uv run python -'
            );

            const child = spawn(
                'uv',
                ['run', 'python', '-'],
                {
                    cwd,
                    shell: false
                }
            );

            child.stdout.on('data', (data) => {
                outputChannel.append(
                    data.toString()
                );
            });

            child.stderr.on('data', (data) => {
                outputChannel.append(
                    data.toString()
                );
            });

            child.on('error', (error) => {

                outputChannel.appendLine('');
                outputChannel.appendLine(
                    `Failed to start uv: ${error.message}`
                );

                vscode.window.showErrorMessage(
                    'Could not run uv. Make sure uv is installed and available in PATH.'
                );
            });

            child.on('close', (code) => {

                outputChannel.appendLine('');
                outputChannel.appendLine(
                    '----------------------------------------'
                );

                outputChannel.appendLine(
                    `Process exited with code ${code}`
                );
            });

            child.stdin.write(code);
            child.stdin.end();
        }
    );

    context.subscriptions.push(
        runSelection,
        outputChannel
    );
}

export function deactivate() {}