import fs from "fs-extra";
import path from "path";
import { ROOT } from "../rootPath";
import runCommand from "./runCommand";

const packageJsonPath = path.join(ROOT, "package.json");

export default async function InstallTurborepoIfNotYet() {
    const pkg = await fs.readJson(packageJsonPath);
    const hasTurbo = pkg.devDependencies && pkg.devDependencies.turbo;

    if (!hasTurbo) {
        await runCommand("npm install turbo -D", ROOT);
    } else {
        await runCommand("npm install", ROOT);
    }
}
