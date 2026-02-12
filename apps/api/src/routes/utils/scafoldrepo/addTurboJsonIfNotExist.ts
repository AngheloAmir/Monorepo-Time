import fs from "fs-extra";
import path from "path";
import { ROOT } from "../rootPath";

const turboJsonPath = path.join(ROOT, "turbo.json");
const SCAFFOLD_DIR = path.join(__dirname, '../scaffold');

export default async function AddTurboJsonIfNotExist() {
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
