import fs from "fs-extra";
import path from "path";
import { ROOT } from "../rootPath";
import CreateWorkSpaceDirsIfNotExist from "./createWorkSpaceDirsIfNotExist";

const packageJsonPath = path.join(ROOT, "package.json");

export default async function SetupWorkspacesIfNotExist() {
    if (!fs.existsSync(packageJsonPath)) return;
    
    const pkg = await fs.readJson(packageJsonPath);

    // If workspaces already exist and are not empty, skip
    if (pkg.workspaces && Array.isArray(pkg.workspaces) && pkg.workspaces.length > 0) {
        return;
    }

    // List directories in ROOT
    const entries = await fs.readdir(ROOT, { withFileTypes: true });
    
    // Filter for directories and ignore common system/build folders
    const ignoredDirs = new Set(['node_modules', '.git', '.vscode', '.idea', 'dist', 'build', 'coverage', '.next', '.turbo', '.changeset']);
    const directories = entries
        .filter(dirent => dirent.isDirectory() && !ignoredDirs.has(dirent.name))
        .map(dirent => dirent.name);

    if (directories.length === 0) {
        // Scenario 1: No other folders (new repo)
        console.log("[scafoldrepo] No existing directories found. Setting up default workspaces.");
        pkg.workspaces = ["apps/*", "packages/*"];
        await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
        await CreateWorkSpaceDirsIfNotExist();
    } else {
        // Scenario 2: Existing folders found
        const foundWorkspaces: string[] = [];

        console.log(`[scafoldrepo] Found existing directories: ${directories.join(", ")}. Scanning for packages...`);

        for (const dir of directories) {
            const dirPackageJsonPath = path.join(ROOT, dir, "package.json");
            if (fs.existsSync(dirPackageJsonPath)) {
                try {
                    const dirPkg = await fs.readJson(dirPackageJsonPath);
                    // Check if dev or start scripts exist
                    if (dirPkg.scripts && (dirPkg.scripts.dev || dirPkg.scripts.start)) {
                        foundWorkspaces.push(dir);
                    }
                } catch (e) {
                    // Ignore invalid JSON
                }
            }
        }

        if (foundWorkspaces.length > 0) {
            console.log(`[scafoldrepo] Detected packages with dev/start scripts: ${foundWorkspaces.join(", ")}`);
            pkg.workspaces = foundWorkspaces;
            await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
        } else {
            console.log("[scafoldrepo] No suitable packages found in existing directories. Skipping workspace setup.");
        }
    }
}
