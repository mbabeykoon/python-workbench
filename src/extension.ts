import * as vscode from 'vscode';
import { runCode } from './runner';

let outputChannel: vscode.OutputChannel;


function executeCode(
    code: string,
    cwd: string
): void {

    const result = runCode(cwd);

    const backend = result.backend;
    const child = result.child;

    outputChannel.clear();
    outputChannel.show(true);

    outputChannel.appendLine(
        'Python Workbench'
    );

    outputChannel.appendLine(
        `Backend: ${backend}`
    );

    outputChannel.appendLine(
        '----------------------------------------'
    );

    child.stdout.on(
        'data',
        (data) => {
            outputChannel.append(
                data.toString()
            );
        }
    );

    child.stderr.on(
        'data',
        (data) => {
            outputChannel.append(
                data.toString()
            );
        }
    );

    child.on(
        'error',
        (error) => {

            outputChannel.appendLine('');

            outputChannel.appendLine(
                `Failed to start ${backend}: ${error.message}`
            );

            vscode.window.showErrorMessage(
                `Python Workbench could not start the ${backend} backend.`
            );
        }
    );

    child.on(
        'close',
        (exitCode) => {

            outputChannel.appendLine('');

            outputChannel.appendLine(
                '----------------------------------------'
            );

            outputChannel.appendLine(
                `Process exited with code ${exitCode}`
            );
        }
    );

    child.stdin.write(code);
    child.stdin.end();
}


export function activate(
    context: vscode.ExtensionContext
): void {

    outputChannel =
        vscode.window.createOutputChannel(
            'Python Workbench'
        );


    const runSelection =
        vscode.commands.registerCommand(
            'python-workbench.runSelection',
            () => {

                const editor =
                    vscode.window.activeTextEditor;

                if (!editor) {

                    vscode.window.showErrorMessage(
                        'No active editor.'
                    );

                    return;
                }

                const selection =
                    editor.selection;

                if (selection.isEmpty) {

                    vscode.window.showWarningMessage(
                        'Select some Python code first.'
                    );

                    return;
                }

                const code =
                    editor.document.getText(
                        selection
                    );

                const workspaceFolder =
                    vscode.workspace.getWorkspaceFolder(
                        editor.document.uri
                    );

                const cwd =
                    workspaceFolder?.uri.fsPath
                    ?? process.cwd();

                executeCode(
                    code,
                    cwd
                );
            }
        );


    const openScratch =
        vscode.commands.registerCommand(
            'python-workbench.openScratch',
            async () => {

                const document =
                    await vscode.workspace.openTextDocument({
                        language: 'python',
                        content: ''
                    });

                await vscode.window.showTextDocument(
                    document
                );
            }
        );


    const runScratch =
        vscode.commands.registerCommand(
            'python-workbench.runScratch',
            () => {

                const editor =
                    vscode.window.activeTextEditor;

                if (!editor) {

                    vscode.window.showErrorMessage(
                        'No active editor.'
                    );

                    return;
                }

                const code =
                    editor.document.getText();

                if (!code.trim()) {

                    vscode.window.showWarningMessage(
                        'Scratch editor is empty.'
                    );

                    return;
                }

                const workspaceFolder =
                    vscode.workspace.getWorkspaceFolder(
                        editor.document.uri
                    )
                    ?? vscode.workspace.workspaceFolders?.[0];

                const cwd =
                    workspaceFolder?.uri.fsPath
                    ?? process.cwd();

                executeCode(
                    code,
                    cwd
                );
            }
        );


    context.subscriptions.push(
        runSelection,
        openScratch,
        runScratch,
        outputChannel
    );
}


export function deactivate(): void {}