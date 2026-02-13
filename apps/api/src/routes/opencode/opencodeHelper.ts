import { Router } from "express";
import fs from "fs-extra";
import path from "path";
import { execa } from "execa";
import { ROOT }  from "../utils/rootPath";
//import opencodeJson from "./opencodeJson";

const router = Router();








// router.get("/check", async (req, res) => {
//     try {
//         const packageJsonPath  = path.join(ROOT, "package.json");
//         const opencodeJsonPath = path.join(ROOT, "opencode.json");

//         let isInstalled = false;

//         if (await fs.pathExists(packageJsonPath)) {
//             const packageJson = await fs.readJson(packageJsonPath);
//             const devDeps     = packageJson.devDependencies || {};
//             const deps        = packageJson.dependencies || {};

//             if (devDeps["opencode-ai"] || deps["opencode-ai"]) {
//                 isInstalled = true;
//             }
//         }

//         if (!isInstalled) {
//             try {
//                 await execa('opencode', ['--version']);
//                 isInstalled = true;
//             } catch (error) {}
//         }

//         const hasConfig = await fs.pathExists(opencodeJsonPath);

//         if (isInstalled && hasConfig) {
//             res.json({ status: "local" });
//             return;
//         }

//         res.json({ status: "none" });
//     } catch (error: any) {
//         console.error("Error checking opencode:", error);
//         res.status(500).json({ error: error.message });
//     }
// });

// router.get("/install", async (req, res) => {
//     try {
//         const opencodeJsonPath = path.join(ROOT, "opencode.json");

//         // 1. Check if opencode is already installed (skip npm install if so)
//         let isInstalled = false;
//         try {
//             await execa('opencode', ['--version']);
//             isInstalled = true;
//         } catch (error) {
//             // Check local deps too
//             const packageJsonPath = path.join(ROOT, "package.json");
//             if (await fs.pathExists(packageJsonPath)) {
//                 const packageJson = await fs.readJson(packageJsonPath);
//                 const devDeps     = packageJson.devDependencies || {};
//                 const deps        = packageJson.dependencies || {};
//                 if (devDeps["opencode-ai"] || deps["opencode-ai"]) {
//                     isInstalled = true;
//                 }
//             }
//         }

//         if (!isInstalled) {
//             try {
//                 await execa('npm', ['install', '-g', 'opencode-ai']);
//             } catch (error: any) {
//                 // Check for common permission errors
//                 if (error.message.includes('EACCES') || error.message.includes('permission denied') || error.stderr?.includes('EACCES')) {
//                      throw new Error("Installation requires administrative permissions. Please run 'npm install -g opencode-ai' manually in your terminal.");
//                 }
//                 throw error;
//             }
//         }

//         // 2. Create opencode.json if it doesn't already exist
//         if (!(await fs.pathExists(opencodeJsonPath))) {
//             await fs.writeFile(opencodeJsonPath, opencodeJson.trim(), 'utf-8');
//         }

//         res.json({ success: true });
//     } catch (error: any) {
//         console.error("Error installing opencode:", error);
//         res.status(500).json({ error: error.message });
//     }
// });

// router.get("/version", async (req, res) => {
//     try {
//         // Get currently installed version
//         let currentVersion = null;
//         try {
//             const { stdout } = await execa('opencode', ['--version']);
//             currentVersion = stdout.trim();
//         } catch (error) {}

//         // Get latest version from npm
//         let latestVersion = null;
//         try {
//             const { stdout } = await execa('npm', ['view', 'opencode-ai', 'version']);
//             latestVersion = stdout.trim();
//         } catch (error) {}

//         const updateAvailable = currentVersion && latestVersion && currentVersion !== latestVersion;

//         res.json({
//             current:         currentVersion,
//             latest:          latestVersion,
//             updateAvailable: !!updateAvailable,
//         });
//     } catch (error: any) {
//         console.error("Error checking opencode version:", error);
//         res.status(500).json({ error: error.message });
//     }
// });

// router.get("/update", async (req, res) => {
//     try {
//         await execa('npm', ['install', '-g', 'opencode-ai@latest']);
        
//         // Return the newly installed version
//         let newVersion = null;
//         try {
//             const { stdout } = await execa('opencode', ['--version']);
//             newVersion = stdout.trim();
//         } catch (error) {}

//         res.json({ success: true, version: newVersion });
//     } catch (error: any) {
//         console.error("Error updating opencode:", error);
//         res.status(500).json({ error: error.message });
//     }
// });

export default router;
