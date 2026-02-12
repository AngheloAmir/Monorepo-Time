import path from "path";
import fs from "fs-extra";
import { exec } from "child_process";
import { ROOT } from "../rootPath";

const packageJsonPath = path.join(ROOT, "package.json");

export default async function AddPackageJsonIfNotExist() {
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
            console.log(`[scafoldrepo] Using pnpm as default packageManager for Turborepo`);
        } else if (yarnv) {
            pkg.packageManager = `yarn@${yarnv}`;
            console.log(`[scafoldrepo] Using yarn as default packageManager for Turborepo`);
        } else if (bunv) {
            pkg.packageManager = `bun@${bunv}`;
            console.log(`[scafoldrepo] Using bun as default packageManager for Turborepo`);
        } else if (npmv) {
            pkg.packageManager = `npm@${npmv}`;
            console.log(`[scafoldrepo] Using npm as default packageManager for Turborepo`);
        } else {
            pkg.packageManager = "npm@latest";
            console.log(`[scafoldrepo] Using npm as default packageManager for Turborepo`);
        }
        save = true;
    }

    if (save) {
        await fs.writeJson(packageJsonPath, pkg, { spaces: 2 });
        console.log("[scafoldrepo] Updated package.json");
    }
}
