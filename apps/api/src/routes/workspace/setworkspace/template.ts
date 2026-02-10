import MonorepoTemplates from 'template';
import path from 'path';
import { ensureDirectory, writeFile, findMonorepoRoot } from './utils';
import { runCommand, preprocessCommand } from './command';
import { TemplateCategories } from 'types';

/**
 * Finds a template by name across all categories.
 */
export function findTemplate(templatename: string) {
    for (const cat of TemplateCategories) {
        const list = MonorepoTemplates[cat];
        if (Array.isArray(list)) {
            const match = list.find(t => t.name === templatename);
            if (match) return match;
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
        if ((step.action === 'command' || step.action === 'root-command') && step.cmd) {
            const cmd = step.cmd;
            let args = step.args || [];

            // Determine CWD based on action type
            let cwd = workspacePath;
            if (step.action === 'root-command') {
                cwd = await findMonorepoRoot(workspacePath);
            }

            // Calculate relative path (useful for root commands targeting the workspace)
            // If cwd is root, this gives e.g. "apps/my-app". Special handling for dot.
            let relativePath = path.relative(cwd, workspacePath);
            if (relativePath === '') relativePath = '.';

            // Construct raw command for preprocessing
            const rawFullCmd = args.length > 0 ? `${cmd} ${args.join(' ')}` : cmd;
            const processedCmd = preprocessCommand(rawFullCmd, cwd);

            // Determine if we need to run in shell mode
            let finalCmd = cmd;
            let finalArgs = args;
            let useShell = false;

            if (processedCmd !== rawFullCmd || (cmd.includes(' ') && args.length === 0)) {
                finalCmd = processedCmd;
                finalArgs = [];
                useShell = true;
                // Note: manual substitution for shell string not fully implemented here for args array, 
                // but preprocessCommand typically handles static replacements if needed.
                // If we need {{RELATIVE_PATH}} in shell string, we'd need to replace it in processedCmd.
                finalCmd = finalCmd.replace(/\{\{RELATIVE_PATH\}\}/g, relativePath);
            } else {
                // Standard mode: manually apply substitutions just in case
                const dirName = path.basename(cwd);
                finalArgs = finalArgs.map(arg => arg
                    .replace(/\$\(basename \$PWD\)/g, dirName)
                    .replace(/\{\{RELATIVE_PATH\}\}/g, relativePath)
                );
            }

            progress(`Running in ${step.action === 'root-command' ? 'Root' : 'Workspace'}: ${finalCmd} ${finalArgs.join(' ')}`);

            try {
                const result = await runCommand(finalCmd, finalArgs, cwd, useShell, (data) => {
                    const trimmed = data.trim();
                    if (trimmed) progress(trimmed);
                });
                if (result.stdout.trim()) {
                    // Start of output already streamed via progress
                    // progress(`Final Output: ...`);
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
