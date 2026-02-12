import { Request, Response, Router } from "express";
import fs from "fs-extra";
import path from "path";
import { exec } from "child_process";
import { ROOT } from "./rootPath";

const router = Router();
const packageJsonPath = path.join(ROOT, "package.json");
const turboJsonPath   = path.join(ROOT, "turbo.json");
const SCAFFOLD_DIR    = path.join(__dirname, 'scaffold');


// if (!packageJson.packageManager) {
//       // Get version of the package manager
//       try {
//         const { stdout } = await execa(pm, ['--version'], { shell: true });
//         const version = stdout.trim();
//         packageJson.packageManager = `${pm}@${version}`;
//         console.log(chalk.green(`Added "packageManager": "${pm}@${version}" to package.json`));
//       } catch (e) {
//         // If version check fails, default to generic latest or skip
//         packageJson.packageManager = `${pm}@latest`;
//         console.log(chalk.yellow(`Could not detect ${pm} version, defaulting to "latest"`));
//       }
//     }

router.get("/", async (req: Request, res: Response) => {
    try {
        await AddWorkspaceToPackageJsonIfNotExist();
        await InstallTurborepoIfNotYet();
        await AddTurboJsonIfNotExist();
        await CreateWorkSpaceDirsIfNotExist(); //this creates apps*, packages*, opensource
        await CreateGitIgnoreIfNotExist();
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

async function AddWorkspaceToPackageJsonIfNotExist() {
    let pkg: any = {};
    let save = false;

    if (fs.existsSync(packageJsonPath)) {
        pkg = await fs.readJson(packageJsonPath);
    } else {
        const rootDirName = path.basename(ROOT).replace(/\s+/g, '-');
        pkg = {
            name: rootDirName,
            private: true,
            scripts: {
                "build": "turbo run build",
                "dev": "turbo run dev",
                "lint": "turbo run lint",
                "format": "prettier --write \"**/*.{ts,tsx,md}\""
            }
        };
        save = true;
        console.log("[scafoldrepo] Creating package.json");
    }

    if (!pkg.workspaces || (Array.isArray(pkg.workspaces) && pkg.workspaces.length === 0)) {
        pkg.workspaces = ["apps/*", "packages/*"];
        save = true;
    }

    if (!pkg.packageManager) {
        const getVersion = async (cmd: string) => {
            return new Promise<string | null>((resolve) => {
                exec(`${cmd} --version`, (err, stdout) => {
                    if (err) resolve(null);
                    else resolve(stdout.trim());
                });
            });
        };

        const pnpmv = await getVersion('pnpm');
        const yarnv = await getVersion('yarn');
        const bunv = await getVersion('bun');
        const npmv = await getVersion('npm');

        if (pnpmv) {
            pkg.packageManager = `pnpm@${pnpmv}`;
        } else if (yarnv) {
             pkg.packageManager = `yarn@${yarnv}`;
        } else if (bunv) {
             pkg.packageManager = `bun@${bunv}`;
        } else if (npmv) {
             pkg.packageManager = `npm@${npmv}`;
        } else {
            pkg.packageManager = "npm@latest";
        }
        save = true;
    }

    if (save) {
        await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
        console.log("[scafoldrepo] Updated package.json");
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

    const pkg                  = await fs.readJson(packageJsonPath);
    const workspaces           = Array.isArray(pkg.workspaces) ? pkg.workspaces : [];
    const shouldCreateApps     = workspaces.some((w: string) => w.startsWith("apps/") || w === "apps");
    const shouldCreatePackages = workspaces.some((w: string) => w.startsWith("packages/") || w === "packages");

    if (shouldCreateApps) {
        await fs.ensureDir(path.join(ROOT, 'apps'));
    }

    if (shouldCreatePackages) {
        await fs.ensureDir(path.join(ROOT, 'packages'));
        const typesPackagePath = path.join(ROOT, "packages", "types");
        if (!fs.existsSync(typesPackagePath)) {
            await fs.ensureDir(typesPackagePath);
            try {
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

    await fs.ensureDir(path.join(ROOT, 'opensource'));
}

async function CreateGitIgnoreIfNotExist() {
    const gitIgnorePath = path.join(ROOT, ".gitignore");
    if (!fs.existsSync(gitIgnorePath)) {
        const ignoreContent = [
            "# Dependencies",
            "node_modules",
            ".pnpm-store",
            "",
            "# Build Outputs",
            "dist",
            "build",
            ".next",
            ".output",
            ".vercel",
            "out",
            "",
            "# Turborepo",
            ".turbo",
            "",
            "# Runtime Configs",
            ".runtime.json",
            ".env",
            ".env.*",
            "!.env.example",
            "",
            "# System",
            ".DS_Store",
            "Thumbs.db",
            "",
            "# Logs",
            "npm-debug.log*",
            "yarn-debug.log*",
            "yarn-error.log*",
            "pnpm-debug.log*",
            "",
            "# IDEs",
            ".idea",
            ".vscode",
            "!.vscode/extensions.json",
            "!.vscode/settings.json",
            ".agent",
            ""
        ].join("\n");
        await fs.writeFile(gitIgnorePath, ignoreContent);
        console.log("[scafoldrepo] Created .gitignore");
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
