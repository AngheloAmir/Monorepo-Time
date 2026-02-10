import path from 'path';
import { execa, ExecaError } from 'execa';
import { isWindows } from './utils';

/**
 * Preprocesses a command to make it cross-platform compatible.
 */
export function preprocessCommand(command: string, cwd: string): string {
    let processedCommand = command;

    // Replace $(basename $PWD) with the actual directory name
    if (processedCommand.includes('$(basename $PWD)')) {
        const dirName = path.basename(cwd);
        processedCommand = processedCommand.replace(/\$\(basename \$PWD\)/g, `"${dirName}"`);
    }

    // Handle cleanup commands
    if (processedCommand.match(/rm\s+-rf\s+\.\/\*\s+\.\/\.\[!\.\]\*.*$/)) {
        if (isWindows) {
            processedCommand = 'powershell -Command "Get-ChildItem -Force | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue"';
        } else {
            processedCommand = 'rm -rf ./* ./.[!.]* 2>/dev/null || true';
        }
    }

    // Replace python3 with python on Windows
    if (isWindows && processedCommand.includes('python3')) {
        processedCommand = processedCommand.replace(/\bpython3\b/g, 'python');
    }

    return processedCommand;
}

/**
 * Execute a command using execa.
 */
export async function runCommand(command: string, args: string[], cwd: string, useShell = false, onData?: (data: string) => void): Promise<{ stdout: string; stderr: string }> {
    try {
        let cmd = command;
        if (!useShell && process.platform === 'win32' && (command === 'npm' || command === 'npx')) {
            cmd = `${command}.cmd`;
        }

        const subprocess = execa(cmd, args, {
            cwd,
            // Detach from parent's stdio to avoid IDE terminal conflicts
            stdin: 'ignore',
            shell: useShell,
            // Set non-interactive environment
            env: {
                ...process.env,
                CI: 'true',
                npm_config_yes: 'true',
                FORCE_COLOR: '0',
                DEBIAN_FRONTEND: 'noninteractive',
            },
            // Don't throw on non-zero exit (we handle it ourselves)
            reject: true,
            // Kill the whole process tree on abort
            killSignal: 'SIGTERM',
            // Timeout after 5 minutes (for npm install which can be slow)
            timeout: 300000,
        });

        if (onData) {
            subprocess.stdout?.on('data', (chunk) => onData(stripAnsi(chunk.toString())));
            subprocess.stderr?.on('data', (chunk) => onData(stripAnsi(chunk.toString())));
        }

        const result = await subprocess;

        return {
            stdout: stripAnsi(result.stdout ?? ''),
            stderr: stripAnsi(result.stderr ?? ''),
        };

    } catch (error) {
        const execaError = error as ExecaError & { code?: string };
        throw new Error(
            `Command failed: ${command} ${args.join(' ')}\n` +
            `Error code: ${execaError.code || 'N/A'}\n` +
            `Exit code: ${execaError.exitCode}\n` +
            `stderr: ${stripAnsi(execaError.stderr || 'N/A')}\n` +
            `stdout: ${stripAnsi(execaError.stdout || 'N/A')}`
        );
    }
}

function stripAnsi(input: unknown): string {
    if (typeof input !== 'string') {
        return String(input);
    }
    // eslint-disable-next-line no-control-regex
    return input.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}
