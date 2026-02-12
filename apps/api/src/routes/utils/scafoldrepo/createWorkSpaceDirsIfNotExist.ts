import fs from "fs-extra";
import path from "path";
import { ROOT } from "../rootPath";

const packageJsonPath = path.join(ROOT, "package.json");
const SCAFFOLD_DIR = path.join(__dirname, '../scaffold');

export default async function CreateWorkSpaceDirsIfNotExist() {
    if (!fs.existsSync(packageJsonPath)) return;

    const pkg = await fs.readJson(packageJsonPath);
    const workspaces = Array.isArray(pkg.workspaces) ? pkg.workspaces : [];
    const shouldCreateApps = workspaces.some((w: string) => w.startsWith("apps/") || w === "apps");
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
