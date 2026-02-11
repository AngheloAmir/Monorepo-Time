import fs from "fs-extra";
import path from "path";
import { Request, Response, Router } from "express";

const START_DIR = process.cwd();

export function findMonorepoRoot(startDir: string): string {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    const pkgPath = path.join(dir, "package.json");
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = fs.readJsonSync(pkgPath);
        if (pkg.workspaces) {
          return dir;
        }
      } catch (e) {
        // Ignore errors
      }
    }
    dir = path.dirname(dir);
  }
  return startDir;
}

export const ROOT = findMonorepoRoot(START_DIR);
const route = Router();

route.get("/", async (req: Request, res: Response) => {
    res.json({ path: ROOT });
});

export default route;
 