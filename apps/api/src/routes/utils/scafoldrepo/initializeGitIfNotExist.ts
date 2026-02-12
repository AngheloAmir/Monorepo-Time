import fs from "fs-extra";
import path from "path";
import { ROOT } from "../rootPath";
import runCommand from "./runCommand";

export default async function InitializeGitIfNotExist() {
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
