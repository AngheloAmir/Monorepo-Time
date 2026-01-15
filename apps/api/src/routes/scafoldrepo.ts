import { Request, Response, Router } from "express";
import fs from "fs-extra";
import path from "path";
import { exec } from "child_process";
import { ROOT } from "./rootPath";

const router = Router();
const packageJsonPath = path.join(ROOT, "package.json");
const turboJsonPath = path.join(ROOT, "turbo.json");
const SCAFFOLD_DIR = path.join(__dirname, 'scaffold');

router.get("/", async (req: Request, res: Response) => {
    try {
        await CreatePackageJsonIfNotExist();
        await AddWorkspaceToPackageJsonIfNotExist();
        await InstallTurborepoIfNotYet();
        await AddTurboJsonIfNotExist();
        await CreateWorkSpaceDirsIfNotExist();
        await InitializeGitIfNotExist();

        res.json({ success: true, message: "Scaffolding complete" });
    } catch (error) {
        console.error("Scaffolding error:", error);
        res.status(500).json({
            error: "Failed to scaffold",
            details: error instanceof Error ? error.message : String(error)
        });
    }
});

async function CreatePackageJsonIfNotExist() {
    if (!fs.existsSync(packageJsonPath)) {
        const rootDirName = path.basename(ROOT);
        const pkgName = rootDirName.toLowerCase().replace(/\s+/g, '-');

        const defaultPkg = {
            name: pkgName,
            version: "1.0.0",
            private: true,
            scripts: {
                "build": "turbo run build",
                "dev": "monorepotime",
                "lint": "turbo run lint"
            },
            devDependencies: {
                "monorepotime": "*"
            },
            workspaces: []
        };
        await fs.writeJson(packageJsonPath, defaultPkg, { spaces: 2 });
        console.log("[scafoldrepo] Created package.json");
    }
}

async function AddWorkspaceToPackageJsonIfNotExist() {
    const pkg = await fs.readJson(packageJsonPath);
    let changed = false;

    if (!pkg.workspaces || (Array.isArray(pkg.workspaces) && pkg.workspaces.length === 0)) {
        pkg.workspaces = ["apps/*", "packages/*"];
        changed = true;
    }

    if (changed) {
        await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
        console.log("[scafoldrepo] Updated package.json workspaces");
    }
}

async function InstallTurborepoIfNotYet() {
    const pkg = await fs.readJson(packageJsonPath);
    const hasTurbo = pkg.devDependencies && pkg.devDependencies.turbo;

    if (!hasTurbo) {
        await runCommand("npm install turbo -D", ROOT);
    } else {
        await runCommand("npm install", ROOT);
    }
}

async function AddTurboJsonIfNotExist() {
    if (!fs.existsSync(turboJsonPath)) {
        try {
            const scaffoldTurboPath = path.join(SCAFFOLD_DIR, "turbo.json");
            let turboContent;

            if (fs.existsSync(scaffoldTurboPath)) {
                turboContent = await fs.readJson(scaffoldTurboPath);
            } else {
                console.warn("[scafoldrepo] scaffold/turbo.json not found, using default.");
                turboContent = {
                    "$schema": "https://turbo.build/schema.json",
                    "tasks": {
                        "build": {
                            "dependsOn": ["^build"],
                            "outputs": ["dist/**", ".next/**", "build/**", ".vercel/output/**"]
                        },
                        "lint": {
                            "dependsOn": ["^lint"]
                        },
                        "test": {
                            "dependsOn": ["^test"]
                        },
                        "clean": {
                            "cache": false,
                            "persistent": true
                        }
                    }
                };
            }

            await fs.writeJson(turboJsonPath, turboContent, { spaces: 2 });
            console.log("[scafoldrepo] Created turbo.json");
        } catch (error) {
            console.error("Error creating turbo.json:", error);
        }
    }
}

async function CreateWorkSpaceDirsIfNotExist() {
    if (!fs.existsSync(packageJsonPath)) return;

    const pkg = await fs.readJson(packageJsonPath);
    const workspaces = Array.isArray(pkg.workspaces) ? pkg.workspaces : [];

    // Check configuration to determine if folders should be created
    const shouldCreateApps = workspaces.some((w: string) => w.startsWith("apps/") || w === "apps");
    const shouldCreatePackages = workspaces.some((w: string) => w.startsWith("packages/") || w === "packages");

    if (shouldCreateApps) {
        await fs.ensureDir(path.join(ROOT, 'apps'));
    }

    if (shouldCreatePackages) {
        await fs.ensureDir(path.join(ROOT, 'packages'));

        // Create types package only if packages directory is valid/created
        const typesPackagePath = path.join(ROOT, "packages", "types");
        if (!fs.existsSync(typesPackagePath)) {
            await fs.ensureDir(typesPackagePath);
            
            try {
                // Try to use scaffold files if available
                if (fs.existsSync(path.join(SCAFFOLD_DIR, 'index.ts'))) {
                    const indexContent = await fs.readFile(path.join(SCAFFOLD_DIR, 'index.ts'), 'utf-8');
                    await fs.writeFile(path.join(typesPackagePath, "index.ts"), indexContent);
                } else {
                    await fs.writeFile(path.join(typesPackagePath, "index.ts"), "export type {};");
                }

                if (fs.existsSync(path.join(SCAFFOLD_DIR, 'package.json'))) {
                    const pkgContent = await fs.readJson(path.join(SCAFFOLD_DIR, 'package.json'));
                    await fs.writeJson(path.join(typesPackagePath, "package.json"), pkgContent, { spaces: 4 });
                } else {
                    await fs.writeJson(path.join(typesPackagePath, "package.json"), {
                        name: "types",
                        version: "0.0.0",
                        private: true,
                        main: "./index.ts",
                        types: "./index.ts"
                    }, { spaces: 4 });
                }
                console.log("[scafoldrepo] Created packages/types");
            } catch (err) {
                console.error("Error creating types package:", err);
            }
        }
    }
}

async function InitializeGitIfNotExist() {
    // Check if git is installed in the environment
    try {
        await runCommand("git --version", ROOT);
    } catch (e) {
        console.warn("Git is not installed or not in PATH. Skipping git initialization.");
        return;
    }

    const gitPath = path.join(ROOT, ".git");
    if (!fs.existsSync(gitPath)) {
        try {
            console.log("[scafoldrepo] Initializing git repository...");
            await runCommand("git init", ROOT);
            await runCommand("git branch -M master", ROOT);
            await runCommand("git add .", ROOT);
            await runCommand('git commit -m "init"', ROOT);
            console.log("[scafoldrepo] Git initialized successfully");
        } catch (gitError) {
            console.error("Failed to initialize git:", gitError);
        }
    }
}

function runCommand(cmd: string, cwd: string): Promise<void> {
    console.log(`Running: ${cmd} in ${cwd}`);
    return new Promise((resolve, reject) => {
        exec(cmd, { cwd }, (error, stdout, stderr) => {
            if (error) {
                console.error("Exec error:", stderr);
                reject(error);
            } else {
                console.log(stdout);
                resolve();
            }
        });
    });
}

export default router;
