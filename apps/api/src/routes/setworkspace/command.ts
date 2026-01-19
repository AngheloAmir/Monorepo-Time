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
        processedCommand = processedCommand.replace(/\$\(basename \$PWD\)/g, dirName);
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
export async function runCommand(command: string, args: string[], cwd: string, useShell = false): Promise<{ stdout: string; stderr: string }> {
    try {
        let cmd = command;
        if (!useShell && process.platform === 'win32' && (command === 'npm' || command === 'npx')) {
            cmd = `${command}.cmd`;
        }

        const result = await execa(cmd, args, {
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

        return {
            stdout: result.stdout ?? '',
            stderr: result.stderr ?? '',
        };

    } catch (error) {
        const execaError = error as ExecaError & { code?: string };
        throw new Error(
            `Command failed: ${command} ${args.join(' ')}\n` +
            `Error code: ${execaError.code || 'N/A'}\n` +
            `Exit code: ${execaError.exitCode}\n` +
            `stderr: ${execaError.stderr || 'N/A'}\n` +
            `stdout: ${execaError.stdout || 'N/A'}`
        );
    }
}
