import {
    spawn,
    spawnSync,
    ChildProcessWithoutNullStreams
} from 'child_process';

import {
    existsSync
} from 'fs';

import {
    join
} from 'path';


export type PythonBackend =
    | 'venv'
    | 'uv'
    | 'python';


export interface RunResult {
    backend: PythonBackend;
    child: ChildProcessWithoutNullStreams;
}


interface PythonCommand {
    backend: PythonBackend;
    command: string;
    args: string[];
}


function findVenvPython(
    cwd: string
): string | undefined {

    const environmentNames = [
        '.venv',
        'venv'
    ];

    for (const environmentName of environmentNames) {

        const pythonPath =
            process.platform === 'win32'
                ? join(
                    cwd,
                    environmentName,
                    'Scripts',
                    'python.exe'
                )
                : join(
                    cwd,
                    environmentName,
                    'bin',
                    'python'
                );

        if (existsSync(pythonPath)) {
            return pythonPath;
        }
    }

    return undefined;
}


function commandIsAvailable(
    command: string,
    args: string[]
): boolean {

    const result = spawnSync(
        command,
        args,
        {
            stdio: 'ignore',
            timeout: 3000
        }
    );

    return result.status === 0;
}


function isUvProject(
    cwd: string
): boolean {

    return existsSync(
        join(cwd, 'uv.lock')
    );
}


function uvIsAvailable(): boolean {

    return commandIsAvailable(
        'uv',
        ['--version']
    );
}


function findSystemPython():
    { command: string; args: string[] } | undefined {

    if (process.platform === 'win32') {

        if (
            commandIsAvailable(
                'py',
                ['-3', '--version']
            )
        ) {
            return {
                command: 'py',
                args: ['-3']
            };
        }

        if (
            commandIsAvailable(
                'python',
                ['--version']
            )
        ) {
            return {
                command: 'python',
                args: []
            };
        }

    } else {

        if (
            commandIsAvailable(
                'python3',
                ['--version']
            )
        ) {
            return {
                command: 'python3',
                args: []
            };
        }

        if (
            commandIsAvailable(
                'python',
                ['--version']
            )
        ) {
            return {
                command: 'python',
                args: []
            };
        }
    }

    return undefined;
}


function resolvePython(
    cwd: string
): PythonCommand {

    const venvPython =
        findVenvPython(cwd);

    if (venvPython) {
        return {
            backend: 'venv',
            command: venvPython,
            args: []
        };
    }

    if (
        isUvProject(cwd)
        && uvIsAvailable()
    ) {
        return {
            backend: 'uv',
            command: 'uv',
            args: [
                'run',
                'python'
            ]
        };
    }

    const systemPython =
        findSystemPython();

    if (systemPython) {
        return {
            backend: 'python',
            command: systemPython.command,
            args: systemPython.args
        };
    }

    throw new Error(
        'No Python interpreter could be found.'
    );
}


export function runCode(
    cwd: string
): RunResult {

    const resolved =
        resolvePython(cwd);

    const args = [
        ...resolved.args,
        '-'
    ];

    const child = spawn(
        resolved.command,
        args,
        {
            cwd,
            shell: false,

            env: {
                ...process.env,

                PYTHONIOENCODING:
                    'utf-8',

                PYTHONUNBUFFERED:
                    '1'
            }
        }
    );

    return {
        backend:
            resolved.backend,

        child
    };
}