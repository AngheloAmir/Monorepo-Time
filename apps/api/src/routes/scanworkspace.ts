import fs from "fs-extra";
import path from "path";
import fg from "fast-glob";
import { Request, Response, Router } from "express";

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

const ROOT = findMonorepoRoot(START_DIR);
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
async function readJSON(file: string) {
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

  return Boolean(pkg.scripts.dev || pkg.scripts.start);
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
async function scanWorkspaces(rootPkg: any) {
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
async function scanRecursively() {
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
        serviceType: pkg.serviceType || null,
        fontawesomeIcon: pkg.fontawesomeIcon || null,
        localUrl: pkg.localUrl || null,
        prodUrl: pkg.prodUrl || null,
        description: pkg.description || null,
        devCommand: pkg.scripts?.dev || null,
        startCommand: pkg.scripts?.start || null,
        stopCommand: pkg.scripts?.stop || null,
        buildCommand: pkg.scripts?.build || null,
        cleanCommand: pkg.scripts?.clean || null,
        lintCommand: pkg.scripts?.lint || null,
        testCommand: pkg.scripts?.test || null,
      };
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
