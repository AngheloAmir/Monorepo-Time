import fs from "fs-extra";
import path from "path";
import fg from "fast-glob";
import { Request, Response, Router } from "express";
import { WorkspaceInfo } from "types";

const START_DIR = process.cwd();

function findMonorepoRoot(startDir: string): string {
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

const IGNORE = [
  "**/node_modules/**",
  "**/.git/**",
  "**/.turbo/**",
  "**/.next/**",
  "**/.vercel/**",
  "**/.cache/**",
  "**/dist/**",
  "**/build/**",
  "**/out/**",
  "**/coverage/**",
];

/**
 * Safe JSON reader
 */
export async function readJSON(file: string) {
  try {
    return await fs.readJSON(file);
  } catch {
    return null;
  }
}

/**
 * Checks if folder has package.json with dev or start
 */
async function isRunnableProject(dir: string) {
  const pkgPath = path.join(dir, "package.json");
  if (!(await fs.pathExists(pkgPath))) return false;

  const pkg = await readJSON(pkgPath);
  if (!pkg?.scripts) return false;

  //even if the dev script or start script is empty as long it exist
  //it is considred as runnable
  if( pkg.scripts.dev != typeof null || pkg.scripts.start != typeof null){
    return true;
  }

  return false;
}

/**
 * Expand workspace globs like "apps/*"
 */
async function resolveWorkspaceDirs(workspaces: string[]) {
  return fg(workspaces.map(w => w.replace(/\/$/, "") + "/"), {
    cwd: ROOT,
    onlyDirectories: true,
    absolute: true,
    ignore: IGNORE,
  });
}

/**
 * Scan workspaces
 */
export async function scanWorkspaces(rootPkg: any) {
  let patterns: string[] = [];

  if (Array.isArray(rootPkg.workspaces)) {
    patterns = rootPkg.workspaces;
  } else if (rootPkg.workspaces?.packages) {
    patterns = rootPkg.workspaces.packages;
  }

  if (!patterns.length) return [];

  const dirs = await resolveWorkspaceDirs(patterns);
  const results = new Set<string>();

  for (const dir of dirs) {
    if (await isRunnableProject(dir)) {
      results.add(path.resolve(dir));
    }
  }

  return [...results];
}

/**
 * Deep scan fallback
 */
export async function scanRecursively() {
  const pkgFiles = await fg("**/package.json", {
    cwd: ROOT,
    absolute: true,
    ignore: IGNORE,
  });

  const results = new Set<string>();

  for (const pkgFile of pkgFiles) {
    const dir = path.dirname(pkgFile);
    if (await isRunnableProject(dir)) {
      results.add(path.resolve(dir));
    }
  }

  return [...results];
}

/**
 * Route
 */
route.get("/", async (req: Request, res: Response) => {
  res.header("Access-Control-Allow-Origin", "*");

  try {
    const rootPkgPath = path.join(ROOT, "package.json");
    const rootPkg = await readJSON(rootPkgPath);

    let projects: string[] = [];

    if (rootPkg?.workspaces) {
      projects = await scanWorkspaces(rootPkg);
    } else {
      projects = await scanRecursively();
    }

    const projectInfos = (await Promise.all(projects.map(async (p) => {
      const pkgPath = path.join(p, "package.json");
      const pkg = await readJSON(pkgPath);
      if (!pkg) return null;

      return {
        name: pkg.name || path.basename(p),
        path: p,
        fontawesomeIcon: (pkg.fontawesomeIcon != typeof null)  ? pkg.fontawesomeIcon : null,
        description:     (pkg.description != typeof null)      ? pkg.description : null,
        devCommand:      (pkg.scripts.dev != typeof null)      ? pkg.scripts.dev : null,
        startCommand:    (pkg.scripts.start != typeof null)    ? pkg.scripts.start : null,
        stopCommand:     (pkg.scripts.stop != typeof null)     ? pkg.scripts.stop : null,
        buildCommand:    (pkg.scripts.build != typeof null)    ? pkg.scripts.build : null,
        cleanCommand:    (pkg.scripts.clean != typeof null)    ? pkg.scripts.clean : null,
        lintCommand:     (pkg.scripts.lint != typeof null)     ? pkg.scripts.lint : null,
        testCommand:     (pkg.scripts.test != typeof null)     ? pkg.scripts.test : null,
        appType:         (pkg.appType != typeof null)          ? pkg.appType : null,
      } as WorkspaceInfo;
    }))).filter(Boolean); // Filter out any failed reads

    res.json({
      root:      ROOT,
      count:     projectInfos.length,
      workspace: projectInfos,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default route;
