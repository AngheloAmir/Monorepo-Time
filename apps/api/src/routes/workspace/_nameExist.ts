import path from 'path';
import { ROOT, readJSON, scanWorkspaces, scanRecursively } from './scanworkspace';

/**
 * Checks if a workspace name already exists in the monorepo.
 * Checks against both the folder name and the package.json name.
 * 
 * @param name The name to check.
 * @param excludePath Optional absolute path of a workspace to exclude from the check (for updates).
 * @returns true if the name exists, false otherwise.
 */
export async function checkNameExists(name: string, excludePath?: string): Promise<boolean> {
    const rootPkgPath = path.join(ROOT, "package.json");
    const rootPkg = await readJSON(rootPkgPath);

    let projects: { path: string; workspace: string }[] = [];

    if (rootPkg?.workspaces) {
      projects = await scanWorkspaces(rootPkg);
    } else {
      projects = await scanRecursively();
    }

    for (const project of projects) {
        const projectPath = project.path;
        // Skip the excluded workspace if provided
        if (excludePath && path.resolve(projectPath) === path.resolve(excludePath)) {
            continue;
        }

        // Check folder name
        const folderName = path.basename(projectPath);
        if (folderName === name) {
            return true;
        }

        // Check package.json name
        const pkgPath = path.join(projectPath, "package.json");
        const pkg = await readJSON(pkgPath);
        if (pkg && pkg.name === name) {
            return true;
        }
    }

    return false;
}

