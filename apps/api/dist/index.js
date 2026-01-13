#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  app: () => app,
  default: () => index_default,
  httpServer: () => httpServer,
  io: () => io
});
module.exports = __toCommonJS(index_exports);
var import_express17 = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_path13 = __toESM(require("path"));

// ../../packages/api/index.ts
var apiRoute = {
  /** Scan a workspace 
   * get request returns  workspace: WorkspaceInfo[]
  */
  scanWorkspace: "scanworkspace",
  /** Run a command in the interactive terminal 
   * request body: { workspace: WorkspaceInfo; runas: 'dev' | 'start'; }
  */
  runCmdDev: "runcmddev",
  /** Stop a process 
   * request body: { workspace: WorkspaceInfo }
  */
  stopProcess: "stopprocess",
  /** List all workspaces in the workspace directory 
   * It is a get request
   * returns: [{ label: string, path: string }]
  */
  listWorkspacesDir: "listworkspacedirs",
  /** Create a new workspace 
   * request body: { workspace: WorkspaceInfo }
  */
  newWorkspace: "newworkspace",
  /** Run a command in the interactive terminal 
   * request body: { path: string, cmd: string }
  */
  interactvTerminal: "interactvterminal",
  stopInteractiveTerminal: "stopinteractiveterminal",
  /** Hide or show a file or folder in your IDE (VS Code and variant)
   * it a get request, return true / false
  */
  hideShowFileFolder: "hideshowfilefolder",
  /** Update a workspace 
   * request body: { workspace: WorkspaceInfo }
  */
  updateWorkspace: "updateworkspace",
  /** Get the root path of the project
   * It is a get request
   * returns: { path: string }
  */
  getRootPath: "getrootpath",
  /** Scaffold a new repo 
   * get request returns { success: boolean }
  */
  scaffoldRepo: "scaffoldrepo",
  /** Check if a turbo repo exists in the rootdir 
   * get return { exists: boolean }
  */
  turborepoExist: "turborepoexist",
  /** Check if it is the first run
   * get return { isFirstTime: boolean }
  */
  firstRun: "firstrun",
  /** Get/Set notes
   * get returns { notes: string }
   * post body { notes: string } returns { success: boolean }
  */
  notes: "notes",
  /** Get/Set crudtest
   * get returns { crudtest: any[] }
   * post body { crudtest: any[] } returns { success: boolean }
  */
  crudTest: "crudtest",
  /** Git Control
   * get history
   * get current branch
   * post revert
   * post push
   */
  gitControl: "gitcontrol"
};
var api_default = apiRoute;

// ../../packages/config/index.ts
var config = {
  apiPort: 3e3
};
var config_default = config;

// src/index.ts
var import_http = require("http");
var import_socket = require("socket.io");

// src/routes/tester.ts
var import_express = require("express");
var router = (0, import_express.Router)();
router.get("/ping", async (req, res) => {
  res.json({
    message: "pong"
  });
});
router.post("/post", async (req, res) => {
  const body = req.body;
  const header = req.headers;
  const query = req.query;
  const params = req.params;
  res.json({
    body,
    header,
    query,
    params
  });
});
router.get("/stream", async (req, res) => {
  const poem1 = `[I Wandered Lonely as a Cloud]

I wandered lonely as a cloud
That floats on high o'er vales and hills,
When all at once I saw a crowd,
A host, of golden daffodils;
Beside the lake, beneath the trees,
Fluttering and dancing in the breeze.

Continuous as the stars that shine
And twinkle on the milky way,
They stretched in never-ending line
Along the margin of a bay:
Ten thousand saw I at a glance,
Tossing their heads in sprightly dance.

The waves beside them danced; but they
Out-did the sparkling waves in glee:
A poet could not but be gay,
In such a jocund company:
I gazed\u2014and gazed\u2014but little thought
What wealth the show to me had brought:
 
For oft, when on my couch I lie
In vacant or in pensive mood,
They flash upon that inward eye
Which is the bliss of solitude;
And then my heart with pleasure fills,
And dances with the daffodils.
`;
  const poem2 = `[The Sun Has Long Been Set]

The sun has long been set,
The stars are out by twos and threes,
The little birds are piping yet
Among the bushes and trees;
There's a cuckoo, and one or two thrushes,
And a far-off wind that rushes,
And a sound of water that gushes,
And the cuckoo's sovereign cry
Fills all the hollow of the sky.
Who would "go parading"
In London, "and masquerading,"
On such a night of June
With that beautiful soft half-moon,
And all these innocent blisses?
On such a night as this is!
`;
  res.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8",
    "Transfer-Encoding": "chunked",
    "X-Content-Type-Options": "nosniff"
  });
  const whichPoem = req.query.poem;
  let poem;
  if (whichPoem === "I Wandered Lonely as a Cloud") {
    poem = poem1;
  } else if (whichPoem === "The Sun Has Long Been Set") {
    poem = poem2;
  } else {
    poem = "No poem provided or unknown title. Try ?poem=... with the exact title.";
  }
  const words = poem.split(" ");
  for (const word of words) {
    res.write(word + " ");
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  res.end();
});
var tester_default = router;

// src/routes/scanworkspace.ts
var import_fs_extra = __toESM(require("fs-extra"));
var import_path = __toESM(require("path"));
var import_fast_glob = __toESM(require("fast-glob"));
var import_express2 = require("express");
var START_DIR = process.cwd();
function findMonorepoRoot(startDir) {
  let dir = startDir;
  while (dir !== import_path.default.dirname(dir)) {
    const pkgPath = import_path.default.join(dir, "package.json");
    if (import_fs_extra.default.existsSync(pkgPath)) {
      try {
        const pkg = import_fs_extra.default.readJsonSync(pkgPath);
        if (pkg.workspaces) {
          return dir;
        }
      } catch (e) {
      }
    }
    dir = import_path.default.dirname(dir);
  }
  return startDir;
}
var ROOT = findMonorepoRoot(START_DIR);
var route = (0, import_express2.Router)();
var IGNORE = [
  "**/node_modules/**",
  "**/.git/**",
  "**/.turbo/**",
  "**/.next/**",
  "**/.vercel/**",
  "**/.cache/**",
  "**/dist/**",
  "**/build/**",
  "**/out/**",
  "**/coverage/**"
];
async function readJSON(file) {
  try {
    return await import_fs_extra.default.readJSON(file);
  } catch {
    return null;
  }
}
async function isRunnableProject(dir) {
  const pkgPath = import_path.default.join(dir, "package.json");
  if (!await import_fs_extra.default.pathExists(pkgPath)) return false;
  const pkg = await readJSON(pkgPath);
  if (!(pkg == null ? void 0 : pkg.scripts)) return false;
  if (pkg.scripts.dev != "object" || pkg.scripts.start != "object") {
    return true;
  }
  return false;
}
async function resolveWorkspaceDirs(workspaces) {
  return (0, import_fast_glob.default)(workspaces.map((w) => w.replace(/\/$/, "") + "/"), {
    cwd: ROOT,
    onlyDirectories: true,
    absolute: true,
    ignore: IGNORE
  });
}
async function scanWorkspaces(rootPkg) {
  var _a;
  let patterns = [];
  if (Array.isArray(rootPkg.workspaces)) {
    patterns = rootPkg.workspaces;
  } else if ((_a = rootPkg.workspaces) == null ? void 0 : _a.packages) {
    patterns = rootPkg.workspaces.packages;
  }
  if (!patterns.length) return [];
  const dirs = await resolveWorkspaceDirs(patterns);
  const results = /* @__PURE__ */ new Set();
  for (const dir of dirs) {
    if (await isRunnableProject(dir)) {
      results.add(import_path.default.resolve(dir));
    }
  }
  return [...results];
}
async function scanRecursively() {
  const pkgFiles = await (0, import_fast_glob.default)("**/package.json", {
    cwd: ROOT,
    absolute: true,
    ignore: IGNORE
  });
  const results = /* @__PURE__ */ new Set();
  for (const pkgFile of pkgFiles) {
    const dir = import_path.default.dirname(pkgFile);
    if (await isRunnableProject(dir)) {
      results.add(import_path.default.resolve(dir));
    }
  }
  return [...results];
}
route.get("/", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const rootPkgPath = import_path.default.join(ROOT, "package.json");
    const rootPkg = await readJSON(rootPkgPath);
    let projects = [];
    if (rootPkg == null ? void 0 : rootPkg.workspaces) {
      projects = await scanWorkspaces(rootPkg);
    } else {
      projects = await scanRecursively();
    }
    const projectInfos = (await Promise.all(projects.map(async (p) => {
      const pkgPath = import_path.default.join(p, "package.json");
      const pkg = await readJSON(pkgPath);
      if (!pkg) return null;
      return {
        name: pkg.name || import_path.default.basename(p),
        path: p,
        fontawesomeIcon: pkg.fontawesomeIcon != "object" ? pkg.fontawesomeIcon : null,
        description: pkg.description != "object" ? pkg.description : null,
        devCommand: pkg.scripts.dev != "object" ? pkg.scripts.dev : null,
        startCommand: pkg.scripts.start != "object" ? pkg.scripts.start : null,
        stopCommand: pkg.scripts.stop != "object" ? pkg.scripts.stop : null,
        buildCommand: pkg.scripts.build != "object" ? pkg.scripts.build : null,
        cleanCommand: pkg.scripts.clean != "object" ? pkg.scripts.clean : null,
        lintCommand: pkg.scripts.lint != "object" ? pkg.scripts.lint : null,
        testCommand: pkg.scripts.test != "object" ? pkg.scripts.test : null
      };
    }))).filter(Boolean);
    res.json({
      root: ROOT,
      count: projectInfos.length,
      workspace: projectInfos
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
var scanworkspace_default = route;

// src/routes/runcmddev.ts
var import_child_process = require("child_process");
var import_chalk = __toESM(require("chalk"));
var activeProcesses = /* @__PURE__ */ new Map();
var sockets = /* @__PURE__ */ new Map();
function runCmdDevSocket(io2) {
  io2.on("connection", (socket) => {
    socket.on("run", (data) => {
      sockets.set(data.workspace.name, socket);
      try {
        handleOnRun(socket, data);
      } catch (error) {
        socket.emit("error", {
          message: error
        });
      }
    });
  });
}
async function handleOnRun(socket, data) {
  const { workspace, runas } = data;
  if (activeProcesses.has(workspace.name))
    return socket.emit("log", "Attached to already running process...");
  const commandToRun = runas === "dev" ? workspace.devCommand : workspace.startCommand;
  if (!commandToRun) throw new Error("No command to run");
  const baseCMD = commandToRun.split(" ")[0];
  const args = commandToRun.split(" ").slice(1);
  socket.emit("log", import_chalk.default.green(`${data.workspace.path}: ${commandToRun}`));
  const child = (0, import_child_process.spawn)(baseCMD, args, {
    cwd: workspace.path,
    env: {
      ...process.env,
      TERM: "dumb",
      FORCE_COLOR: "1"
    },
    stdio: ["ignore", "pipe", "pipe"],
    shell: true,
    detached: process.platform !== "win32"
  });
  activeProcesses.set(workspace.name, child);
  child.on("error", (error) => {
    socket.emit("error", error.message);
  });
  child.stdout.on("data", (data2) => {
    socket.emit("log", data2.toString());
  });
  child.stderr.on("data", (data2) => {
    socket.emit("error", data2.toString());
  });
  child.on("exit", (code) => {
    socket.emit("exit", `Process exited with code ${code}`);
  });
}

// src/routes/stopcmd.ts
var import_express3 = require("express");
var import_child_process2 = require("child_process");
var import_util = require("util");
var import_chalk2 = __toESM(require("chalk"));
var router2 = (0, import_express3.Router)();
router2.post("/", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const body = req.body;
    const workspace = body.workspace;
    if (!workspace) {
      return res.status(400).json({ error: "No workspace provided" });
    }
    const currentSocket = sockets.get(workspace.name);
    const currentProcess = activeProcesses.get(workspace.name);
    if (currentProcess) {
      currentSocket == null ? void 0 : currentSocket.emit("log", import_chalk2.default.yellow("Stopping active process..."));
      if (currentProcess.pid) {
        if (process.platform !== "win32") {
          await cleanupProcessPorts(currentProcess.pid, currentSocket);
        }
      }
      await new Promise((resolve) => {
        let resolved = false;
        const safeResolve = () => {
          if (!resolved) {
            resolved = true;
            resolve();
          }
        };
        const timer = setTimeout(() => {
          console.log(`Process stop timed out for ${workspace.name}`);
          safeResolve();
        }, 5e3);
        currentProcess.once("exit", () => {
          clearTimeout(timer);
          safeResolve();
        });
        if (currentProcess.pid) {
          try {
            if (process.platform !== "win32") {
              process.kill(-currentProcess.pid, "SIGINT");
            } else {
              currentProcess.kill();
            }
          } catch (error) {
            if (error.code === "ESRCH") {
              clearTimeout(timer);
              safeResolve();
            } else {
              console.error(`Failed to kill process: ${error.message}`);
            }
          }
        } else {
          safeResolve();
        }
      });
      activeProcesses.delete(workspace.name);
    } else {
      currentSocket == null ? void 0 : currentSocket.emit("log", import_chalk2.default.yellow("No active process found to stop."));
    }
    const commandToRun = workspace.stopCommand;
    if (commandToRun) {
      currentSocket == null ? void 0 : currentSocket.emit("log", import_chalk2.default.green(`Running stop command: ${commandToRun}`));
      const baseCMD = commandToRun.split(" ")[0];
      const args = commandToRun.split(" ").slice(1);
      const child = (0, import_child_process2.spawn)(baseCMD, args, {
        cwd: workspace.path,
        env: {
          ...process.env,
          TERM: "dumb",
          FORCE_COLOR: "1"
        },
        stdio: ["ignore", "pipe", "pipe"],
        shell: true,
        detached: process.platform !== "win32"
      });
      child.stdout.on("data", (data) => {
        currentSocket == null ? void 0 : currentSocket.emit("log", data.toString());
      });
      child.stderr.on("data", (data) => {
        currentSocket == null ? void 0 : currentSocket.emit("error", data.toString());
      });
      child.on("close", (code) => {
        currentSocket == null ? void 0 : currentSocket.emit("log", import_chalk2.default.green(`Stop command finished with code ${code}`));
        currentSocket == null ? void 0 : currentSocket.emit("exit", "Process stopped");
      });
    } else {
      currentSocket == null ? void 0 : currentSocket.emit("log", "Process stopped (no stop command defined).");
      currentSocket == null ? void 0 : currentSocket.emit("exit", "Process stopped");
    }
    await new Promise((resolve) => setTimeout(resolve, 1e3));
    res.end();
  } catch (e) {
    console.error("Error in stopcmd:", e);
    res.status(500).json({ error: e.message });
  }
});
var stopcmd_default = router2;
var execAsync = (0, import_util.promisify)(import_child_process2.exec);
async function getProcessTreePids(rootPid) {
  var _a;
  try {
    const { stdout } = await execAsync("ps -e -o pid,ppid --no-headers");
    const pids = /* @__PURE__ */ new Set();
    pids.add(rootPid);
    const tree = /* @__PURE__ */ new Map();
    const lines = stdout.trim().split("\n");
    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 2) {
        const pid = parseInt(parts[0], 10);
        const ppid = parseInt(parts[1], 10);
        if (!tree.has(ppid)) tree.set(ppid, []);
        (_a = tree.get(ppid)) == null ? void 0 : _a.push(pid);
      }
    }
    const queue = [rootPid];
    while (queue.length > 0) {
      const current = queue.shift();
      const children = tree.get(current);
      if (children) {
        for (const child of children) {
          pids.add(child);
          queue.push(child);
        }
      }
    }
    return Array.from(pids);
  } catch (e) {
    console.error("Error building process tree:", e);
    return [rootPid];
  }
}
async function cleanupProcessPorts(rootPid, socket) {
  var _a;
  try {
    const pids = await getProcessTreePids(rootPid);
    const { stdout } = await execAsync("lsof -P -n -iTCP -sTCP:LISTEN -F pn");
    const lines = stdout.trim().split("\n");
    let currentPid = -1;
    const pidPorts = /* @__PURE__ */ new Map();
    for (const line of lines) {
      const type = line[0];
      const content = line.substring(1);
      if (type === "p") {
        currentPid = parseInt(content, 10);
      } else if (type === "n" && currentPid !== -1) {
        const match = content.match(/:(\d+)$/);
        if (match) {
          const port2 = match[1];
          if (!pidPorts.has(currentPid)) pidPorts.set(currentPid, []);
          (_a = pidPorts.get(currentPid)) == null ? void 0 : _a.push(port2);
        }
      }
    }
    for (const pid of pids) {
      if (pidPorts.has(pid)) {
        const ports = pidPorts.get(pid);
        if (ports) {
          for (const port2 of ports) {
            socket == null ? void 0 : socket.emit("log", import_chalk2.default.yellow(`Detected active port ${port2} on PID ${pid}. Killing port...`));
            try {
              await execAsync(`npx -y kill-port ${port2}`);
            } catch (err) {
              socket == null ? void 0 : socket.emit("log", import_chalk2.default.red(`Failed to kill port ${port2}: ${err.message}`));
            }
          }
        }
      }
    }
  } catch (e) {
  }
}

// src/routes/listworkspacedirs.ts
var import_express4 = require("express");
var import_fs_extra2 = __toESM(require("fs-extra"));
var import_path2 = __toESM(require("path"));
var router3 = (0, import_express4.Router)();
var START_DIR2 = process.cwd();
var findRoot = async (dir) => {
  const pkgPath = import_path2.default.join(dir, "package.json");
  if (await import_fs_extra2.default.pathExists(pkgPath)) {
    try {
      const pkg = await import_fs_extra2.default.readJSON(pkgPath);
      if (pkg.workspaces) {
        return dir;
      }
    } catch {
    }
  }
  const parent = import_path2.default.dirname(dir);
  if (parent === dir) return START_DIR2;
  return findRoot(parent);
};
router3.get("/", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const rootPath = await findRoot(START_DIR2);
    const pkgPath = import_path2.default.join(rootPath, "package.json");
    let workspaceDirs = [];
    let foundWorkspaces = false;
    if (await import_fs_extra2.default.pathExists(pkgPath)) {
      const pkg = await import_fs_extra2.default.readJSON(pkgPath);
      let globs = [];
      if (pkg.workspaces) {
        if (Array.isArray(pkg.workspaces)) {
          globs = pkg.workspaces;
        } else if (pkg.workspaces.packages && Array.isArray(pkg.workspaces.packages)) {
          globs = pkg.workspaces.packages;
        }
      }
      if (globs.length > 0) {
        foundWorkspaces = true;
        const uniqueDirs = /* @__PURE__ */ new Set();
        for (const pattern of globs) {
          const parts = pattern.split("/");
          if (parts.length > 0) {
            const topLevel = parts[0];
            if (topLevel && topLevel !== "*") {
              uniqueDirs.add(topLevel);
            }
          }
        }
        for (const dirName of uniqueDirs) {
          const fullPath = import_path2.default.join(rootPath, dirName);
          if (await import_fs_extra2.default.pathExists(fullPath)) {
            workspaceDirs.push({
              label: dirName,
              path: fullPath
            });
          }
        }
      }
    }
    if (!foundWorkspaces) {
      const items = await import_fs_extra2.default.readdir(rootPath, { withFileTypes: true });
      workspaceDirs = items.filter((item) => item.isDirectory()).filter((item) => {
        const name = item.name;
        if (name === "node_modules") return false;
        if (name.startsWith(".")) return false;
        if (name.startsWith("_")) return false;
        return true;
      }).map((item) => ({
        label: item.name,
        path: import_path2.default.join(rootPath, item.name)
      }));
    }
    return res.json(workspaceDirs);
  } catch (e) {
    console.error("Error listing workspaces:", e);
    res.status(500).json({ error: e.message });
  }
});
var listworkspacedirs_default = router3;

// src/routes/newworkspace.ts
var import_express5 = require("express");
var import_fs_extra3 = __toESM(require("fs-extra"));
var import_path4 = __toESM(require("path"));

// src/routes/_nameExist.ts
var import_path3 = __toESM(require("path"));
async function checkNameExists(name, excludePath) {
  const rootPkgPath = import_path3.default.join(ROOT, "package.json");
  const rootPkg = await readJSON(rootPkgPath);
  let projects = [];
  if (rootPkg == null ? void 0 : rootPkg.workspaces) {
    projects = await scanWorkspaces(rootPkg);
  } else {
    projects = await scanRecursively();
  }
  for (const projectPath of projects) {
    if (excludePath && import_path3.default.resolve(projectPath) === import_path3.default.resolve(excludePath)) {
      continue;
    }
    const folderName = import_path3.default.basename(projectPath);
    if (folderName === name) {
      return true;
    }
    const pkgPath = import_path3.default.join(projectPath, "package.json");
    const pkg = await readJSON(pkgPath);
    if (pkg && pkg.name === name) {
      return true;
    }
  }
  return false;
}

// src/routes/newworkspace.ts
var router4 = (0, import_express5.Router)();
router4.post("/", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const reqBody = req.body;
    const targetPath = reqBody.path;
    if (!targetPath) {
      return res.status(400).json({ error: "Path is required" });
    }
    const nameToCheck = reqBody.name || import_path4.default.basename(targetPath);
    if (await checkNameExists(nameToCheck)) {
      return res.status(409).json({ error: `Workspace with name "${nameToCheck}" already exists.` });
    }
    await import_fs_extra3.default.ensureDir(targetPath);
    const packageJson = {
      name: reqBody.name || import_path4.default.basename(targetPath),
      version: "1.0.0",
      description: reqBody.description || "",
      fontawesomeIcon: reqBody.fontawesomeIcon || "",
      scripts: {
        dev: reqBody.devCommand || "",
        start: reqBody.startCommand || void 0,
        stop: reqBody.stopCommand || void 0,
        build: reqBody.buildCommand || void 0,
        clean: reqBody.cleanCommand || void 0,
        lint: reqBody.lintCommand || void 0,
        test: reqBody.testCommand || void 0
      }
    };
    Object.keys(packageJson.scripts).forEach(
      (key) => packageJson.scripts[key] === void 0 && delete packageJson.scripts[key]
    );
    await import_fs_extra3.default.writeJSON(import_path4.default.join(targetPath, "package.json"), packageJson, { spaces: 2 });
    res.json({ message: "Workspace created successfully", path: targetPath });
  } catch (e) {
    console.error("Error creating workspace:", e);
    res.status(500).json({ error: e.message });
  }
});
var newworkspace_default = router4;

// src/routes/interactiveTerminal.ts
var import_express6 = require("express");
var import_child_process3 = require("child_process");
var router5 = (0, import_express6.Router)();
router5.get("/", async (req, res) => {
  res.send("Interactive Terminal Route");
});
var interactiveTerminal_default = router5;
var activeTerminals = /* @__PURE__ */ new Map();
function stopTerminalProcess(socketId) {
  var _a, _b;
  const session = activeTerminals.get(socketId);
  if (session) {
    const { child } = session;
    child.removeAllListeners();
    (_a = child.stdout) == null ? void 0 : _a.removeAllListeners();
    (_b = child.stderr) == null ? void 0 : _b.removeAllListeners();
    child.kill();
    activeTerminals.delete(socketId);
    return true;
  }
  return false;
}
function stopTerminalProcessByName(workspaceName) {
  for (const [socketId, session] of activeTerminals.entries()) {
    if (session.workspaceName === workspaceName) {
      return stopTerminalProcess(socketId);
    }
  }
  return false;
}
function interactiveTerminalSocket(io2) {
  io2.on("connection", (socket) => {
    socket.on("terminal:start", (data) => {
      var _a, _b;
      const { path: path14, command, workspaceName } = data;
      stopTerminalProcess(socket.id);
      try {
        const env = { ...process.env };
        delete env.CI;
        env.TERM = "xterm-256color";
        env.FORCE_COLOR = "1";
        env.PROMPT_COMMAND = 'export PS1="\\[\\033[34m\\][PATH] \\[\\033[32m\\]\\w\\[\\033[0m\\]\\n$ ";';
        let child;
        if (process.platform === "win32") {
          socket.emit("terminal:log", "\x1B[33m[System] Windows detected. Running in compatible mode (limited interactivity).\x1B[0m\r\n");
          const baseCMD = command.split(" ")[0];
          const args = command.split(" ").slice(1);
          child = (0, import_child_process3.spawn)(baseCMD, args, {
            cwd: path14,
            env,
            shell: true,
            stdio: ["pipe", "pipe", "pipe"]
          });
        } else {
          env.CMD = command;
          const pythonScript = `
import pty, sys, os

try:
    cmd = os.environ.get('CMD')
    if not cmd:
        sys.exit(1)

    # pty.spawn(argv) executes argv and connects stdin/stdout to pty
    status = pty.spawn(['/bin/bash', '-c', 'stty cols 80 rows 24; ' + cmd])

    if os.WIFEXITED(status):
        sys.exit(os.WEXITSTATUS(status))
    else:
        sys.exit(1)
except ImportError:
    sys.exit(127) # Return special code if pty module missing (unlikely on unix)
except Exception as e:
    sys.exit(1)
`;
          child = (0, import_child_process3.spawn)("python3", ["-u", "-c", pythonScript], {
            cwd: path14,
            env,
            stdio: ["pipe", "pipe", "pipe"]
          });
        }
        activeTerminals.set(socket.id, { child, workspaceName });
        (_a = child.stdout) == null ? void 0 : _a.on("data", (chunk) => {
          socket.emit("terminal:log", chunk.toString());
        });
        (_b = child.stderr) == null ? void 0 : _b.on("data", (chunk) => {
          socket.emit("terminal:log", chunk.toString());
        });
        child.on("error", (err) => {
          if (err.code === "ENOENT" && process.platform !== "win32") {
            socket.emit("terminal:error", "\r\n\x1B[31mError: Python3 is required for interactive mode on Linux/Mac but was not found.\x1B[0m");
          } else {
            socket.emit("terminal:error", `Failed to start command: ${err.message}`);
          }
          cleanup(socket.id);
        });
        child.on("exit", (code) => {
          if (code === 127 && process.platform !== "win32") {
            socket.emit("terminal:error", "\r\n\x1B[31mError: Python PTY module issue.\x1B[0m");
          } else if (code !== 0) {
            socket.emit("terminal:error", `\r
Process exited with code ${code}`);
          } else {
          }
          socket.emit("terminal:exit", code);
          cleanup(socket.id);
        });
      } catch (error) {
        socket.emit("terminal:error", `Error handling command: ${error.message}`);
        cleanup(socket.id);
      }
    });
    socket.on("terminal:input", (input) => {
      const session = activeTerminals.get(socket.id);
      if (session && session.child.stdin) {
        session.child.stdin.write(input);
      }
    });
    socket.on("disconnect", () => {
      stopTerminalProcess(socket.id);
    });
    function cleanup(socketId) {
      activeTerminals.delete(socketId);
    }
  });
}

// src/routes/stopInteractiveTerminal.ts
var import_express7 = require("express");
var router6 = (0, import_express7.Router)();
router6.post("/", async (req, res) => {
  const { socketId, workspace } = req.body;
  if (workspace && workspace.name) {
    const stopped = stopTerminalProcessByName(workspace.name);
    if (stopped) {
      res.json({ success: true, message: `Terminated process for workspace ${workspace.name}` });
    } else {
      res.json({ success: true, message: `No active terminal process found for workspace ${workspace.name} (already stopped)` });
    }
    return;
  }
  if (socketId) {
    const stopped = stopTerminalProcess(socketId);
    if (stopped) {
      res.json({ success: true, message: `Terminated process for socket ${socketId}` });
    } else {
      res.json({ success: true, message: `No active terminal process found for socket ${socketId} (already stopped)` });
    }
    return;
  }
  res.status(400).json({ message: "Missing socketId or workspace.name" });
});
var stopInteractiveTerminal_default = router6;

// src/routes/updateworkspace.ts
var import_express8 = require("express");
var import_fs_extra4 = __toESM(require("fs-extra"));
var import_path5 = __toESM(require("path"));
var router7 = (0, import_express8.Router)();
router7.post("/", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const workspace = req.body;
    if (!workspace || !workspace.path) {
      res.status(400).send({ error: "Invalid workspace data" });
      return;
    }
    if (workspace.name && await checkNameExists(workspace.name, workspace.path)) {
      res.status(409).send({ error: `Workspace with name "${workspace.name}" already exists.` });
      return;
    }
    const packageJsonPath = import_path5.default.join(workspace.path, "package.json");
    if (!import_fs_extra4.default.existsSync(packageJsonPath)) {
      res.status(404).send({ error: "package.json not found in workspace path" });
      return;
    }
    const packageJson = await import_fs_extra4.default.readJson(packageJsonPath);
    if (workspace.name) packageJson.name = workspace.name;
    if (workspace.fontawesomeIcon) packageJson.fontawesomeIcon = workspace.fontawesomeIcon;
    if (workspace.description != "object") packageJson.description = workspace.description;
    if (workspace.devCommand != "object") packageJson.scripts.dev = workspace.devCommand;
    if (workspace.startCommand != "object") packageJson.scripts.start = workspace.startCommand;
    if (workspace.buildCommand != "object") packageJson.scripts.build = workspace.buildCommand;
    if (workspace.testCommand != "object") packageJson.scripts.test = workspace.testCommand;
    if (workspace.lintCommand != "object") packageJson.scripts.lint = workspace.lintCommand;
    if (workspace.stopCommand != "object") packageJson.scripts.stop = workspace.stopCommand;
    if (workspace.cleanCommand != "object") packageJson.scripts.clean = workspace.cleanCommand;
    await import_fs_extra4.default.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    res.send({ success: true, message: "Workspace updated successfully" });
  } catch (error) {
    console.error("Update workspace error:", error);
    res.status(500).send({ error: error.message });
  }
});
var updateworkspace_default = router7;

// src/routes/vscodeHideShow.ts
var import_express9 = require("express");
var import_fs_extra5 = __toESM(require("fs-extra"));
var import_path6 = __toESM(require("path"));
var router8 = (0, import_express9.Router)();
var EXCLUDE_PATTERNS = {
  "**/node_modules": true,
  "**/.git": true,
  "**/.gitignore": true,
  "**/.turbo": true,
  "**/dist": true,
  "**/_tool": true,
  "**/package-lock.json": true,
  "**/Dockerfile": true,
  "**/docker-compose.yml": true,
  "**/.dockerignore": true,
  "**/turbo.json": true,
  "**/nodemon.json": true,
  "**/temp.md": true,
  "**/*postcss*": true,
  "**/*tailwind*": true,
  "**/*tsconfig*": true,
  "**/*eslint*": true,
  "**/*prettier*": true,
  "**/*vite*": true,
  "_temp": true,
  ".gitignore": true,
  ".vscode": true,
  "package.json": true,
  "README.md": true,
  ".github": true,
  ".buildkite": true,
  ".circleci": true,
  ".gitlab-ci.yml": true,
  ".travis.yml": true,
  "out": true
};
var EXCLUDE_PATTERNS_DEFAULT = {
  "**/.git": true,
  ".vscode": true,
  ".turbo": true
};
var START_DIR3 = process.cwd();
function findMonorepoRoot2(startDir) {
  let dir = startDir;
  while (dir !== import_path6.default.dirname(dir)) {
    const pkgPath = import_path6.default.join(dir, "package.json");
    if (import_fs_extra5.default.existsSync(pkgPath)) {
      try {
        const pkg = import_fs_extra5.default.readJsonSync(pkgPath);
        if (pkg.workspaces) {
          return dir;
        }
      } catch (e) {
      }
    }
    if (import_fs_extra5.default.existsSync(import_path6.default.join(dir, ".vscode"))) {
      return dir;
    }
    dir = import_path6.default.dirname(dir);
  }
  return startDir;
}
var ROOT2 = findMonorepoRoot2(START_DIR3);
var getSettingsPath = () => {
  return import_path6.default.join(ROOT2, ".vscode/settings.json");
};
var ensureSettingsFile = async () => {
  const settingsPath = getSettingsPath();
  const dir = import_path6.default.dirname(settingsPath);
  await import_fs_extra5.default.ensureDir(dir);
  if (!await import_fs_extra5.default.pathExists(settingsPath)) {
    await import_fs_extra5.default.writeJson(settingsPath, { "files.exclude": {} }, { spaces: 4 });
  }
};
router8.post("/", async (req, res) => {
  try {
    const { hide, pathInclude } = req.body;
    await ensureSettingsFile();
    const settingsPath = getSettingsPath();
    const settings = await import_fs_extra5.default.readJson(settingsPath);
    const newExcludes = { ...EXCLUDE_PATTERNS_DEFAULT };
    if (hide) {
      Object.assign(newExcludes, EXCLUDE_PATTERNS);
      if (Array.isArray(pathInclude)) {
        pathInclude.forEach((p) => {
          const relativePath = import_path6.default.relative(ROOT2, p);
          if (relativePath && !relativePath.startsWith("..") && !import_path6.default.isAbsolute(relativePath)) {
            newExcludes[relativePath] = true;
          }
        });
      }
    }
    settings["files.exclude"] = newExcludes;
    await import_fs_extra5.default.writeJson(settingsPath, settings, { spaces: 4 });
    res.json({ success: true, isHidden: hide });
  } catch (error) {
    console.error("Error updating VSCode settings:", error);
    res.status(500).json({ error: "Failed to update VSCode settings" });
  }
});
var vscodeHideShow_default = router8;

// src/routes/rootPath.ts
var import_fs_extra6 = __toESM(require("fs-extra"));
var import_path7 = __toESM(require("path"));
var import_express10 = require("express");
var START_DIR4 = process.cwd();
function findMonorepoRoot3(startDir) {
  let dir = startDir;
  while (dir !== import_path7.default.dirname(dir)) {
    const pkgPath = import_path7.default.join(dir, "package.json");
    if (import_fs_extra6.default.existsSync(pkgPath)) {
      try {
        const pkg = import_fs_extra6.default.readJsonSync(pkgPath);
        if (pkg.workspaces) {
          return dir;
        }
      } catch (e) {
      }
    }
    dir = import_path7.default.dirname(dir);
  }
  return startDir;
}
var ROOT3 = findMonorepoRoot3(START_DIR4);
var route2 = (0, import_express10.Router)();
route2.get("/", async (req, res) => {
  res.json({ path: ROOT3 });
});
var rootPath_default = route2;

// src/routes/scafoldrepo.ts
var import_express11 = require("express");
var import_fs_extra7 = __toESM(require("fs-extra"));
var import_path8 = __toESM(require("path"));
var import_child_process4 = require("child_process");
var router9 = (0, import_express11.Router)();
router9.get("/", async (req, res) => {
  var _a;
  try {
    const packageJsonPath = import_path8.default.join(ROOT3, "package.json");
    const turboJsonPath = import_path8.default.join(ROOT3, "turbo.json");
    if (!import_fs_extra7.default.existsSync(packageJsonPath)) {
      res.status(400).json({ error: "package.json not found in root" });
      return;
    }
    const pkg = import_fs_extra7.default.readJsonSync(packageJsonPath);
    let pkgChanged = false;
    if (!pkg.workspaces) {
      pkg.workspaces = ["apps/*", "packages/*"];
      pkgChanged = true;
    }
    if (pkgChanged) {
      import_fs_extra7.default.writeJsonSync(packageJsonPath, pkg, { spaces: 2 });
    }
    await import_fs_extra7.default.ensureDir(import_path8.default.join(ROOT3, "apps"));
    await import_fs_extra7.default.ensureDir(import_path8.default.join(ROOT3, "packages"));
    const SCAFFOLD_DIR = import_path8.default.join(__dirname, "scaffold");
    const typesPackagePath = import_path8.default.join(ROOT3, "packages", "types");
    if (!import_fs_extra7.default.existsSync(typesPackagePath)) {
      await import_fs_extra7.default.ensureDir(typesPackagePath);
      try {
        const indexContent = await import_fs_extra7.default.readFile(import_path8.default.join(SCAFFOLD_DIR, "index.ts"), "utf-8");
        const packageJsonContent = await import_fs_extra7.default.readJson(import_path8.default.join(SCAFFOLD_DIR, "package.json"));
        await import_fs_extra7.default.writeFile(import_path8.default.join(typesPackagePath, "index.ts"), indexContent);
        await import_fs_extra7.default.writeJson(import_path8.default.join(typesPackagePath, "package.json"), packageJsonContent, { spaces: 4 });
      } catch (err) {
        console.error("Error reading scaffold files for types package:", err);
      }
    }
    const monorepoTimePath3 = import_path8.default.join(ROOT3, "monorepotime.json");
    if (!import_fs_extra7.default.existsSync(monorepoTimePath3)) {
      try {
        const defaultMonorepoTime = await import_fs_extra7.default.readJson(import_path8.default.join(SCAFFOLD_DIR, "monorepotime.json"));
        import_fs_extra7.default.writeJsonSync(monorepoTimePath3, defaultMonorepoTime, { spaces: 4 });
      } catch (err) {
        console.error("Error reading scaffold file for monorepotime.json:", err);
      }
    }
    if (!import_fs_extra7.default.existsSync(turboJsonPath) || !((_a = pkg.devDependencies) == null ? void 0 : _a.turbo)) {
      if (!import_fs_extra7.default.existsSync(turboJsonPath)) {
        const defaultTurbo = {
          "$schema": "https://turbo.build/schema.json",
          "pipeline": {
            "build": {
              "outputs": ["dist/**", ".next/**"]
            },
            "lint": {}
          }
        };
        import_fs_extra7.default.writeJsonSync(turboJsonPath, defaultTurbo, { spaces: 2 });
      }
      const hasTurbo = pkg.devDependencies && pkg.devDependencies.turbo;
      if (!hasTurbo) {
        await runCommand("npm install turbo -D", ROOT3);
      } else {
        await runCommand("npm install", ROOT3);
      }
    } else {
      if (pkgChanged) {
        await runCommand("npm install", ROOT3);
      }
    }
    res.json({ success: true, message: "Scaffolding complete" });
  } catch (error) {
    console.error("Scaffolding error:", error);
    res.status(500).json({
      error: "Failed to scaffold",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});
function runCommand(cmd, cwd) {
  console.log(`Running: ${cmd} in ${cwd}`);
  return new Promise((resolve, reject) => {
    (0, import_child_process4.exec)(cmd, { cwd }, (error, stdout, stderr) => {
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
var scafoldrepo_default = router9;

// src/routes/turborepoexist.ts
var import_express12 = require("express");
var import_fs = __toESM(require("fs"));
var import_path9 = __toESM(require("path"));
var router10 = (0, import_express12.Router)();
router10.get("/", async (req, res) => {
  try {
    let isExist = true;
    const turboJsonPath = import_path9.default.join(ROOT3, "turbo.json");
    const turboExists = import_fs.default.existsSync(turboJsonPath);
    if (!turboExists) {
      isExist = false;
    }
    const monorepoJsonPath = import_path9.default.join(ROOT3, "monorepotime.json");
    const monorepoExists = import_fs.default.existsSync(monorepoJsonPath);
    if (!monorepoExists) {
      isExist = false;
    }
    res.json({ exists: isExist });
  } catch (error) {
    console.error("Error checking turbo.json:", error);
    res.status(500).json({ error: "Internal server error", exists: false });
  }
});
var turborepoexist_default = router10;

// src/routes/firstrun.ts
var import_express13 = require("express");
var import_fs_extra8 = __toESM(require("fs-extra"));
var import_path10 = __toESM(require("path"));
var import_child_process5 = require("child_process");
var import_util2 = require("util");
var execAsync2 = (0, import_util2.promisify)(import_child_process5.exec);
var router11 = (0, import_express13.Router)();
router11.get("/", async (req, res) => {
  try {
    const monorepoTimePath3 = import_path10.default.join(ROOT3, "monorepotime.json");
    const exists = import_fs_extra8.default.existsSync(monorepoTimePath3);
    if (!exists) {
      try {
        const scaffoldPath = import_path10.default.join(__dirname, "scaffold", "monorepotime.json");
        const defaultContent = await import_fs_extra8.default.readJson(scaffoldPath);
        import_fs_extra8.default.writeJsonSync(monorepoTimePath3, defaultContent, { spaces: 4 });
      } catch (err) {
        console.error("Error reading scaffold file for firstrun:", err);
        import_fs_extra8.default.writeJsonSync(monorepoTimePath3, { notes: "", crudtest: [] }, { spaces: 4 });
      }
      const gitIgnorePath = import_path10.default.join(ROOT3, ".gitignore");
      if (!import_fs_extra8.default.existsSync(gitIgnorePath)) {
        const gitIgnoreContent = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

package-lock.json
out
.turbo`;
        try {
          import_fs_extra8.default.writeFileSync(gitIgnorePath, gitIgnoreContent);
          console.log("Created .gitignore");
        } catch (err) {
          console.error("Failed to create .gitignore:", err);
        }
      }
      const gitPath = import_path10.default.join(ROOT3, ".git");
      if (!import_fs_extra8.default.existsSync(gitPath)) {
        try {
          console.log("Initializing git repository...");
          await execAsync2("git init", { cwd: ROOT3 });
          await execAsync2("git add .", { cwd: ROOT3 });
          await execAsync2("git branch -M master", { cwd: ROOT3 });
          await execAsync2('git commit -m "init"', { cwd: ROOT3 });
          console.log("Git initialized successfully");
        } catch (gitError) {
          console.error("Failed to initialize git:", gitError);
        }
      }
      res.json({ isFirstTime: true });
    } else {
      res.json({ isFirstTime: false });
    }
  } catch (error) {
    console.error("First run check error:", error);
    res.status(500).json({
      error: "Failed to check first run status",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});
var firstrun_default = router11;

// src/routes/notes.ts
var import_express14 = require("express");
var import_fs_extra9 = __toESM(require("fs-extra"));
var import_path11 = __toESM(require("path"));
var router12 = (0, import_express14.Router)();
var monorepoTimePath = import_path11.default.join(ROOT3, "monorepotime.json");
var ensureFile = async () => {
  if (!import_fs_extra9.default.existsSync(monorepoTimePath)) {
    await import_fs_extra9.default.writeJson(monorepoTimePath, { notes: "", crudtest: [] }, { spaces: 4 });
  }
};
router12.get("/", async (req, res) => {
  try {
    await ensureFile();
    const data = await import_fs_extra9.default.readJson(monorepoTimePath);
    res.json({ notes: data.notes || "" });
  } catch (error) {
    console.error("Error reading notes:", error);
    res.status(500).json({ error: "Failed to read notes" });
  }
});
router12.post("/", async (req, res) => {
  try {
    const { notes } = req.body;
    if (typeof notes !== "string") {
      res.status(400).json({ error: "Invalid notes format" });
      return;
    }
    await ensureFile();
    const data = await import_fs_extra9.default.readJson(monorepoTimePath);
    data.notes = notes;
    await import_fs_extra9.default.writeJson(monorepoTimePath, data, { spaces: 4 });
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving notes:", error);
    res.status(500).json({ error: "Failed to save notes" });
  }
});
var notes_default = router12;

// src/routes/crudtest.ts
var import_express15 = require("express");
var import_fs_extra10 = __toESM(require("fs-extra"));
var import_path12 = __toESM(require("path"));
var router13 = (0, import_express15.Router)();
var monorepoTimePath2 = import_path12.default.join(ROOT3, "monorepotime.json");
var ensureFile2 = async () => {
  if (!import_fs_extra10.default.existsSync(monorepoTimePath2)) {
    await import_fs_extra10.default.writeJson(monorepoTimePath2, { notes: "", crudtest: [] }, { spaces: 4 });
  }
};
router13.get("/", async (req, res) => {
  try {
    await ensureFile2();
    const data = await import_fs_extra10.default.readJson(monorepoTimePath2);
    res.json({ crudtest: data.crudtest || [] });
  } catch (error) {
    console.error("Error reading crudtest:", error);
    res.status(500).json({ error: "Failed to read crudtest" });
  }
});
router13.post("/", async (req, res) => {
  try {
    const { crudtest } = req.body;
    if (!Array.isArray(crudtest)) {
      res.status(400).json({ error: "Invalid crudtest format, must be an array" });
      return;
    }
    await ensureFile2();
    const data = await import_fs_extra10.default.readJson(monorepoTimePath2);
    data.crudtest = crudtest;
    await import_fs_extra10.default.writeJson(monorepoTimePath2, data, { spaces: 4 });
    res.json({ success: true });
  } catch (error) {
    console.error("Error saving crudtest:", error);
    res.status(500).json({ error: "Failed to save crudtest" });
  }
});
var crudtest_default = router13;

// src/routes/gitControlHelper.ts
var import_express16 = require("express");
var import_child_process6 = require("child_process");
var import_util3 = require("util");
var execAsync3 = (0, import_util3.promisify)(import_child_process6.exec);
var router14 = (0, import_express16.Router)();
async function runGit(command) {
  const { stdout, stderr } = await execAsync3(command, { cwd: ROOT3 });
  if (stderr) {
    console.log("Git Output (stderr):", stderr);
  }
  return stdout.trim();
}
router14.get("/history", async (req, res) => {
  try {
    const output = await runGit('git log -n 10 --pretty=format:"%h|%s|%ar"');
    const history = output.split("\n").filter(Boolean).map((line) => {
      const parts = line.split("|");
      return {
        hash: parts[0],
        message: parts[1],
        date: parts[2]
      };
    });
    res.json({ history });
  } catch (error) {
    console.error("Git History Error:", error);
    res.status(500).json({ error: error.message });
  }
});
router14.get("/branch", async (req, res) => {
  try {
    const branch = await runGit("git branch --show-current");
    res.json({ branch });
  } catch (error) {
    console.error("Git Branch Error:", error);
    res.status(500).json({ error: error.message });
  }
});
router14.post("/revert", async (req, res) => {
  try {
    const { hash } = req.body;
    if (!hash) {
      res.status(400).json({ error: "Hash is required" });
      return;
    }
    const currentHead = await runGit("git rev-parse HEAD");
    const newCommitHash = await runGit(`git commit-tree ${hash}^{tree} -p ${currentHead} -m "Reverted to ${hash}"`);
    await runGit(`git reset --hard ${newCommitHash}`);
    res.json({ success: true, message: `Reverted to ${hash}` });
  } catch (error) {
    console.error("Git Revert Error:", error);
    res.status(500).json({ error: error.message });
  }
});
router14.post("/push", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }
    try {
      await runGit("git add .");
      const safeMessage = message.replace(/"/g, '\\"');
      await runGit(`git commit -m "${safeMessage}"`);
    } catch (e) {
      if (e.stdout && e.stdout.includes("nothing to commit")) {
      } else if (e.message && e.message.includes("nothing to commit")) {
      } else {
        throw e;
      }
    }
    await runGit("git push");
    res.json({ success: true });
  } catch (error) {
    console.error("Git Push Error:", error);
    res.status(500).json({ error: error.message });
  }
});
var gitControlHelper_default = router14;

// src/index.ts
var app = (0, import_express17.default)();
var port = config_default.apiPort;
app.use((0, import_cors.default)({
  origin: true,
  credentials: true
}));
app.use(import_express17.default.static("public"));
app.use(import_express17.default.json());
app.use("/", tester_default);
app.use("/" + api_default.scanWorkspace, scanworkspace_default);
app.use("/" + api_default.stopProcess, stopcmd_default);
app.use("/" + api_default.listWorkspacesDir, listworkspacedirs_default);
app.use("/" + api_default.newWorkspace, newworkspace_default);
app.use("/" + api_default.interactvTerminal, interactiveTerminal_default);
app.use("/" + api_default.stopInteractiveTerminal, stopInteractiveTerminal_default);
app.use("/" + api_default.updateWorkspace, updateworkspace_default);
app.use("/" + api_default.hideShowFileFolder, vscodeHideShow_default);
app.use("/" + api_default.getRootPath, rootPath_default);
app.use("/" + api_default.scaffoldRepo, scafoldrepo_default);
app.use("/" + api_default.turborepoExist, turborepoexist_default);
app.use("/" + api_default.firstRun, firstrun_default);
app.use("/" + api_default.notes, notes_default);
app.use("/" + api_default.crudTest, crudtest_default);
app.use("/" + api_default.gitControl, gitControlHelper_default);
var frontendPath = import_path13.default.join(__dirname, "../public");
app.use(import_express17.default.static(frontendPath));
app.get("*", (req, res) => {
  res.sendFile(import_path13.default.join(frontendPath, "index.html"));
});
var httpServer = (0, import_http.createServer)(app);
var io = new import_socket.Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ["websocket", "polling"]
});
runCmdDevSocket(io);
interactiveTerminalSocket(io);
httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
var index_default = app;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app,
  httpServer,
  io
});
