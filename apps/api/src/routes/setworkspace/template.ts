import MonorepoTemplates from 'template';
import path from 'path';
import { ensureDirectory, writeFile } from './utils';
import { runCommand, preprocessCommand } from './command';

/**
 * Finds a template by name across all categories.
 */
export function findTemplate(templatename: string) {
    const categories = ['project', 'database', 'services', 'demo'] as const;
    for (const cat of categories) {
        const list = MonorepoTemplates[cat];
        if (Array.isArray(list)) {
            const match = list.find(t => t.name === templatename);
            if (match) {
                return match;
            }
        }
    }
    return null;
}

/**
 * Execute template steps.
 */
export async function executeTemplate(
    template: ReturnType<typeof findTemplate>,
    workspacePath: string,
    onProgress?: (message: string) => void
): Promise<void> {
    if (!template) {
        throw new Error('Template not found');
    }

    // Ensure the workspace directory exists before starting
    await ensureDirectory(workspacePath);

    const progress = onProgress || ((msg: string) => console.log(`[Template] ${msg}`));

    for (const step of template.templating) {
        if (step.action === 'command' && step.cmd) {
            const cmd = step.cmd;
            let args = step.args || [];

            // Construct raw command for preprocessing
            const rawFullCmd = args.length > 0 ? `${cmd} ${args.join(' ')}` : cmd;
            const processedCmd = preprocessCommand(rawFullCmd, workspacePath);

            // Determine if we need to run in shell mode
            let finalCmd = cmd;
            let finalArgs = args;
            let useShell = false;

            if (processedCmd !== rawFullCmd || (cmd.includes(' ') && args.length === 0)) {
                finalCmd = processedCmd;
                finalArgs = [];
                useShell = true;
            } else {
                // Standard mode: manually apply substitutions just in case
                const dirName = path.basename(workspacePath);
                finalArgs = finalArgs.map(arg => arg.replace(/\$\(basename \$PWD\)/g, dirName));
            }

            progress(`Running: ${finalCmd} ${finalArgs.join(' ')}`);

            try {
                const result = await runCommand(finalCmd, finalArgs, workspacePath, useShell);
                if (result.stdout.trim()) {
                    const truncated = result.stdout.trim().slice(0, 200);
                    progress(`Output: ${truncated}${result.stdout.length > 200 ? '...' : ''}`);
                }
            } catch (cmdErr: any) {
                console.error(`Command failed: ${finalCmd}`, cmdErr);
                throw new Error(`Command failed: ${finalCmd}\n${cmdErr.message}`);
            }
        } else if (step.action === 'file' && step.file && step.filecontent !== undefined) {
            progress(`Creating file: ${step.file}`);
            const filePath = path.join(workspacePath, step.file);
            await writeFile(filePath, step.filecontent);
        }
    }
}
