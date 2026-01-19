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
var import_express24 = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_path16 = __toESM(require("path"));

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
  stopTerminalWorkspace: "stopTerminalWorkspace",
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
  gitControl: "gitcontrol",
  /** Initialize monorepotime.json
   * get request returns { success: boolean }
   */
  initMonorepoTime: "initmtime",
  /** Process tree and dockers memory usage */
  processTree: "processtree",
  /** Docker API */
  docker: "docker",
  availabletemplates: "availabletemplates",
  setWorkspaceTemplate: "setworkspacetemplate"
};
var api_default = apiRoute;

// ../../packages/config/index.ts
var isDev = process.env.NODE_ENV === "development";
var port = 4793;
var config = {
  apiPort: port,
  serverPath: isDev ? `http://localhost:${port}/` : "/",
  useDemo: false
};
var config_default = config;

// src/index.ts
var import_open = __toESM(require("open"));
var import_http = require("http");
var import_socket = require("socket.io");
var import_net = __toESM(require("net"));

// src/routes/_tester.ts
var import_express = require("express");
var router = (0, import_express.Router)();
router.get("/ping", async (req, res) => {
  res.json({
    message: "pong",
    time: Date.now()
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
var import_chalk2 = __toESM(require("chalk"));
var import_child_process2 = require("child_process");
var router2 = (0, import_express3.Router)();
router2.post("/", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  try {
    const body = req.body;
    const workspace = body.workspace;
    if (!workspace || !workspace.name) {
      return res.status(400).json({ error: "No workspace provided" });
    }
    const currentProcess = activeProcesses.get(workspace.name);
    const currentSocket = sockets.get(workspace.name);
    if (currentProcess) {
      currentSocket == null ? void 0 : currentSocket.emit("log", import_chalk2.default.yellow("Stopping process tree..."));
      if (currentProcess.pid) {
        if (process.platform === "win32") {
          (0, import_child_process2.exec)(`taskkill /pid ${currentProcess.pid} /T /F`, (err) => {
            if (err) {
              currentProcess.kill();
            }
          });
        } else {
          try {
            process.kill(-currentProcess.pid, "SIGKILL");
          } catch (e) {
            currentProcess.kill("SIGKILL");
          }
        }
      } else {
        currentProcess.kill();
      }
      activeProcesses.delete(workspace.name);
      currentSocket == null ? void 0 : currentSocket.emit("exit", "Process stopped by user");
      res.json({ success: true, message: `Process for ${workspace.name} stopped` });
    } else {
      res.json({ success: true, message: "No active process to stop" });
    }
  } catch (e) {
    console.error("Error in stopcmd:", e);
    res.status(500).json({ error: e.message });
  }
});
var stopcmd_default = router2;

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
    let targetPath = reqBody.path;
    if (targetPath) {
      const dir = import_path4.default.dirname(targetPath);
      const specificName = import_path4.default.basename(targetPath);
      targetPath = import_path4.default.join(dir, specificName.replace(/\s+/g, "-"));
    }
    if (!targetPath) {
      return res.status(400).json({ error: "Path is required" });
    }
    const nameToCheck = reqBody.name || import_path4.default.basename(targetPath);
    if (await checkNameExists(nameToCheck)) {
      return res.status(409).json({ error: `Workspace with name "${nameToCheck}" already exists.` });
    }
    await import_fs_extra3.default.ensureDir(targetPath);
    const packageJson = {
      name: (reqBody.name || import_path4.default.basename(targetPath)).toLowerCase().replace(/\s+/g, "-"),
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
    const { child, socket } = session;
    if (socket.connected) {
      socket.emit("terminal:log", "\r\n\x1B[33m[System] Stopping interactive terminal process...\x1B[0m\r\n");
    }
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
      const { path: path17, command, workspaceName } = data;
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
            cwd: path17,
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
            cwd: path17,
            env,
            stdio: ["pipe", "pipe", "pipe"]
          });
        }
        activeTerminals.set(socket.id, { child, workspaceName, socket });
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
    const packageJsonPath2 = import_path5.default.join(workspace.path, "package.json");
    if (!import_fs_extra4.default.existsSync(packageJsonPath2)) {
      res.status(404).send({ error: "package.json not found in workspace path" });
      return;
    }
    const packageJson = await import_fs_extra4.default.readJson(packageJsonPath2);
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
    await import_fs_extra4.default.writeJson(packageJsonPath2, packageJson, { spaces: 2 });
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
var packageJsonPath = import_path8.default.join(ROOT3, "package.json");
var turboJsonPath = import_path8.default.join(ROOT3, "turbo.json");
var SCAFFOLD_DIR = import_path8.default.join(__dirname, "scaffold");
router9.get("/", async (req, res) => {
  try {
    await CreatePackageJsonIfNotExist();
    await AddWorkspaceToPackageJsonIfNotExist();
    await InstallTurborepoIfNotYet();
    await AddTurboJsonIfNotExist();
    await CreateWorkSpaceDirsIfNotExist();
    await CreateGitIgnoreIfNotExist();
    await InitializeGitIfNotExist();
    res.json({ success: true, message: "Scaffolding complete" });
  } catch (error) {
    console.error("Scaffolding error:", error);
    res.status(500).json({
      error: "Failed to scaffold",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});
async function CreatePackageJsonIfNotExist() {
  if (!import_fs_extra7.default.existsSync(packageJsonPath)) {
    const rootDirName = import_path8.default.basename(ROOT3);
    const pkgName = rootDirName.toLowerCase().replace(/\s+/g, "-");
    const defaultPkg = {
      name: pkgName,
      version: "1.0.0",
      private: true,
      scripts: {
        "build": "turbo run build",
        "dev": "monorepotime",
        "lint": "turbo run lint"
      },
      devDependencies: {
        "monorepotime": "*"
      },
      workspaces: []
    };
    await import_fs_extra7.default.writeJson(packageJsonPath, defaultPkg, { spaces: 2 });
    console.log("[scafoldrepo] Created package.json");
  }
}
async function AddWorkspaceToPackageJsonIfNotExist() {
  const pkg = await import_fs_extra7.default.readJson(packageJsonPath);
  let changed = false;
  if (!pkg.workspaces || Array.isArray(pkg.workspaces) && pkg.workspaces.length === 0) {
    pkg.workspaces = ["apps/*", "packages/*"];
    changed = true;
  }
  if (changed) {
    await import_fs_extra7.default.writeJson(packageJsonPath, pkg, { spaces: 2 });
    console.log("[scafoldrepo] Updated package.json workspaces");
  }
}
async function InstallTurborepoIfNotYet() {
  const pkg = await import_fs_extra7.default.readJson(packageJsonPath);
  const hasTurbo = pkg.devDependencies && pkg.devDependencies.turbo;
  if (!hasTurbo) {
    await runCommand("npm install turbo -D", ROOT3);
  } else {
    await runCommand("npm install", ROOT3);
  }
}
async function AddTurboJsonIfNotExist() {
  if (!import_fs_extra7.default.existsSync(turboJsonPath)) {
    try {
      const scaffoldTurboPath = import_path8.default.join(SCAFFOLD_DIR, "turbo.json");
      let turboContent;
      if (import_fs_extra7.default.existsSync(scaffoldTurboPath)) {
        turboContent = await import_fs_extra7.default.readJson(scaffoldTurboPath);
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
      await import_fs_extra7.default.writeJson(turboJsonPath, turboContent, { spaces: 2 });
      console.log("[scafoldrepo] Created turbo.json");
    } catch (error) {
      console.error("Error creating turbo.json:", error);
    }
  }
}
async function CreateWorkSpaceDirsIfNotExist() {
  if (!import_fs_extra7.default.existsSync(packageJsonPath)) return;
  const pkg = await import_fs_extra7.default.readJson(packageJsonPath);
  const workspaces = Array.isArray(pkg.workspaces) ? pkg.workspaces : [];
  const shouldCreateApps = workspaces.some((w) => w.startsWith("apps/") || w === "apps");
  const shouldCreatePackages = workspaces.some((w) => w.startsWith("packages/") || w === "packages");
  if (shouldCreateApps) {
    await import_fs_extra7.default.ensureDir(import_path8.default.join(ROOT3, "apps"));
  }
  if (shouldCreatePackages) {
    await import_fs_extra7.default.ensureDir(import_path8.default.join(ROOT3, "packages"));
    const typesPackagePath = import_path8.default.join(ROOT3, "packages", "types");
    if (!import_fs_extra7.default.existsSync(typesPackagePath)) {
      await import_fs_extra7.default.ensureDir(typesPackagePath);
      try {
        if (import_fs_extra7.default.existsSync(import_path8.default.join(SCAFFOLD_DIR, "index.ts"))) {
          const indexContent = await import_fs_extra7.default.readFile(import_path8.default.join(SCAFFOLD_DIR, "index.ts"), "utf-8");
          await import_fs_extra7.default.writeFile(import_path8.default.join(typesPackagePath, "index.ts"), indexContent);
        } else {
          await import_fs_extra7.default.writeFile(import_path8.default.join(typesPackagePath, "index.ts"), "export type {};");
        }
        if (import_fs_extra7.default.existsSync(import_path8.default.join(SCAFFOLD_DIR, "package.json"))) {
          const pkgContent = await import_fs_extra7.default.readJson(import_path8.default.join(SCAFFOLD_DIR, "package.json"));
          await import_fs_extra7.default.writeJson(import_path8.default.join(typesPackagePath, "package.json"), pkgContent, { spaces: 4 });
        } else {
          await import_fs_extra7.default.writeJson(import_path8.default.join(typesPackagePath, "package.json"), {
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
}
async function CreateGitIgnoreIfNotExist() {
  const gitIgnorePath = import_path8.default.join(ROOT3, ".gitignore");
  if (!import_fs_extra7.default.existsSync(gitIgnorePath)) {
    const ignoreContent = [
      "# Dependencies",
      "node_modules",
      ".pnpm-store",
      "",
      "# Build Outputs",
      "dist",
      "build",
      ".next",
      ".output",
      ".vercel",
      "out",
      "",
      "# Turborepo",
      ".turbo",
      "",
      "# Runtime Configs",
      ".runtime.json",
      ".env",
      ".env.*",
      "!.env.example",
      "",
      "# System",
      ".DS_Store",
      "Thumbs.db",
      "",
      "# Logs",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      "pnpm-debug.log*",
      "",
      "# IDEs",
      ".idea",
      ".vscode",
      "!.vscode/extensions.json",
      "!.vscode/settings.json"
    ].join("\n");
    await import_fs_extra7.default.writeFile(gitIgnorePath, ignoreContent);
    console.log("[scafoldrepo] Created .gitignore");
  }
}
async function InitializeGitIfNotExist() {
  try {
    await runCommand("git --version", ROOT3);
  } catch (e) {
    console.warn("Git is not installed or not in PATH. Skipping git initialization.");
    return;
  }
  const gitPath = import_path8.default.join(ROOT3, ".git");
  if (!import_fs_extra7.default.existsSync(gitPath)) {
    try {
      console.log("[scafoldrepo] Initializing git repository...");
      await runCommand("git init", ROOT3);
      await runCommand("git branch -M master", ROOT3);
      await runCommand("git add .", ROOT3);
      await runCommand('git commit -m "init"', ROOT3);
      console.log("[scafoldrepo] Git initialized successfully");
    } catch (gitError) {
      console.error("Failed to initialize git:", gitError);
    }
  }
}
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
    const turboJsonPath2 = import_path9.default.join(ROOT3, "turbo.json");
    const turboExists = import_fs.default.existsSync(turboJsonPath2);
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
var router11 = (0, import_express13.Router)();
router11.get("/", async (req, res) => {
  try {
    const turboJsonPath2 = import_path10.default.join(ROOT3, "turbo.json");
    const exists = import_fs_extra8.default.existsSync(turboJsonPath2);
    res.json({ isFirstTime: !exists });
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
router12.get("/", async (req, res) => {
  if (!import_fs_extra9.default.existsSync(monorepoTimePath)) {
    res.status(404).json({ error: "monorepotime.json not found" });
    return;
  }
  try {
    const data = await import_fs_extra9.default.readJson(monorepoTimePath);
    res.json({ notes: data.notes || "" });
  } catch (error) {
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
    const data = await import_fs_extra9.default.readJson(monorepoTimePath);
    data.notes = notes;
    await import_fs_extra9.default.writeJson(monorepoTimePath, data, { spaces: 4 });
    res.json({ success: true });
  } catch (error) {
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
router13.get("/", async (req, res) => {
  if (!import_fs_extra10.default.existsSync(monorepoTimePath2)) {
    res.status(404).json({ error: "monorepotime.json not found" });
    return;
  }
  try {
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
var import_child_process5 = require("child_process");
var import_util = require("util");
var execAsync = (0, import_util.promisify)(import_child_process5.exec);
var router14 = (0, import_express16.Router)();
async function runGit(command) {
  const { stdout, stderr } = await execAsync(command, { cwd: ROOT3 });
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

// src/routes/initmonorepotime.ts
var import_express17 = require("express");
var import_fs_extra11 = __toESM(require("fs-extra"));
var import_path13 = __toESM(require("path"));
var router15 = (0, import_express17.Router)();
router15.get("/", async (req, res) => {
  try {
    const sourcePath = import_path13.default.join(__dirname, "scaffold", "monorepotime.json");
    const destPath = import_path13.default.join(ROOT3, "monorepotime.json");
    if (import_fs_extra11.default.existsSync(destPath)) {
      res.status(400).json({ success: false, message: "monorepotime.json already exists" });
      return;
    }
    if (!import_fs_extra11.default.existsSync(sourcePath)) {
      await import_fs_extra11.default.writeJson(destPath, { notes: "", crudtest: [] }, { spaces: 4 });
      res.json({ success: true, message: "Created monorepotime.json with default content (scaffold missing)" });
      return;
    }
    await import_fs_extra11.default.copy(sourcePath, destPath);
    res.json({ success: true, message: "Successfully initialized monorepotime.json" });
  } catch (error) {
    console.error("Error initializing monorepotime.json:", error);
    res.status(500).json({
      success: false,
      error: "Failed to initialize monorepotime.json",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});
var initmonorepotime_default = router15;

// src/routes/processUsage.ts
var import_express18 = require("express");
var import_fs2 = __toESM(require("fs"));
var import_child_process6 = require("child_process");
var import_os = __toESM(require("os"));
var import_pidusage = __toESM(require("pidusage"));
var router16 = (0, import_express18.Router)();
var workSpaceData = {};
var getActiveJobs = () => /* @__PURE__ */ new Map();
var getDockerContainers = async () => ({ containers: [], totalMem: 0 });
var peakMemory = 0;
function getPSS(pid) {
  try {
    const data = import_fs2.default.readFileSync(`/proc/${pid}/smaps_rollup`, "utf8");
    const match = data.match(/^Pss:\s+(\d+)\s+kB/m);
    if (!match) return 0;
    return parseInt(match[1], 10) * 1024;
  } catch {
    return 0;
  }
}
function getProcessTree() {
  return new Promise((resolve) => {
    (0, import_child_process6.exec)("ps -A -o pid,ppid", (err, stdout) => {
      var _a;
      if (err) return resolve(/* @__PURE__ */ new Map());
      const parentMap = /* @__PURE__ */ new Map();
      const lines = stdout.trim().split("\n");
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].trim().split(/\s+/).map(Number);
        const pid = parts[0];
        const ppid = parts[1];
        if (!isNaN(pid) && !isNaN(ppid)) {
          if (!parentMap.has(ppid)) parentMap.set(ppid, []);
          (_a = parentMap.get(ppid)) == null ? void 0 : _a.push(pid);
        }
      }
      resolve(parentMap);
    });
  });
}
function getAllDescendants(rootPid, parentMap) {
  const results = [rootPid];
  const queue = [rootPid];
  while (queue.length) {
    const current = queue.shift();
    if (current === void 0) continue;
    const children = parentMap.get(current);
    if (children) {
      for (const child of children) {
        results.push(child);
        queue.push(child);
      }
    }
  }
  return results;
}
async function getStats() {
  let totalRepos = 0;
  Object.values(workSpaceData).forEach((list) => {
    if (Array.isArray(list)) totalRepos += list.length;
  });
  const activeJobMap = getActiveJobs();
  const parentMap = await getProcessTree();
  const dockerData = await getDockerContainers();
  const distinctPids = [];
  const serviceGroups = [];
  function addGroup(pid, name, type) {
    if (!pid) return;
    const children = getAllDescendants(pid, parentMap);
    children.forEach((p) => distinctPids.push(p));
    serviceGroups.push({
      name,
      type,
      rootPid: pid,
      pids: children
    });
  }
  activeProcesses.forEach((child, name) => {
    addGroup(child.pid, name, "Service");
  });
  activeTerminals.forEach((session, socketId) => {
    const name = session.workspaceName ? `Terminal (${session.workspaceName})` : `Terminal (${socketId})`;
    addGroup(session.child.pid, name, "Terminal");
  });
  activeJobMap.forEach((e) => {
    const pid = e.pid || (e.child ? e.child.pid : void 0);
    addGroup(pid, "Job", "Job");
  });
  const mainPid = process.pid;
  const mainChildren = getAllDescendants(mainPid, parentMap);
  mainChildren.forEach((p) => distinctPids.push(p));
  const processList = [];
  let mainToolMem = 0;
  if (distinctPids.length) {
    try {
      const uniquePids = [...new Set(distinctPids)];
      await (0, import_pidusage.default)(uniquePids).catch(() => {
      });
      for (const group of serviceGroups) {
        let total = 0;
        for (const pid of group.pids) {
          total += getPSS(pid);
        }
        processList.push({
          pid: group.rootPid,
          name: group.name,
          type: group.type,
          memory: total
        });
      }
      const knownServicePids = /* @__PURE__ */ new Set();
      serviceGroups.forEach((g) => g.pids.forEach((p) => knownServicePids.add(p)));
      const toolCorePids = mainChildren.filter((pid) => !knownServicePids.has(pid));
      for (const pid of toolCorePids) {
        mainToolMem += getPSS(pid);
      }
    } catch (e) {
      console.error("Pid scan error:", e.message);
    }
  }
  processList.push({
    pid: mainPid,
    name: "Tool Server (Core)",
    type: "System",
    memory: mainToolMem || process.memoryUsage().rss
  });
  const totalServerMem = processList.reduce((a, b) => a + b.memory, 0);
  if (totalServerMem > peakMemory) peakMemory = totalServerMem;
  return {
    systemTotalMem: import_os.default.totalmem(),
    serverUsedMem: totalServerMem,
    peakMem: peakMemory,
    cpus: import_os.default.cpus().length,
    uptime: import_os.default.uptime(),
    repoCount: totalRepos,
    activeCount: activeProcesses.size + activeJobMap.size,
    processes: processList,
    dockerContainers: dockerData.containers,
    dockerTotalMem: dockerData.totalMem
  };
}
function killPortFunc(port3) {
  return new Promise((resolve) => {
    (0, import_child_process6.exec)(`lsof -t -i:${port3}`, (err, stdout) => {
      if (err || !stdout.trim()) return resolve(false);
      (0, import_child_process6.exec)(`kill -9 ${stdout.trim().split("\n").join(" ")}`, () => {
        resolve(true);
      });
    });
  });
}
router16.post("/kill-port", async (req, res) => {
  try {
    const { port: port3 } = req.body;
    if (!port3) {
      res.status(400).json({ error: "Port is required" });
      return;
    }
    const killed = await killPortFunc(port3);
    res.json({ success: true, killed });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
router16.get("/stream", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*"
  });
  const send = async () => {
    try {
      const stats = await getStats();
      res.write(`data: ${JSON.stringify(stats)}

`);
    } catch (e) {
      console.error("Stream error", e);
    }
  };
  send();
  const interval = setInterval(send, 1e4);
  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
});
router16.get("/", async (req, res) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get stats" });
  }
});
var processUsage_default = router16;

// src/routes/apidocker.ts
var import_express19 = require("express");
var import_child_process7 = require("child_process");
var router17 = (0, import_express19.Router)();
function parseMemory(memStr) {
  const units = {
    "B": 1,
    "b": 1,
    "kB": 1e3,
    "KB": 1e3,
    "KiB": 1024,
    "mB": 1e3 * 1e3,
    "MB": 1e3 * 1e3,
    "MiB": 1024 * 1024,
    "gB": 1e3 * 1e3 * 1e3,
    "GB": 1e3 * 1e3 * 1e3,
    "GiB": 1024 * 1024 * 1024
  };
  const match = memStr.match(/^([0-9.]+)([a-zA-Z]+)$/);
  if (!match) return 0;
  const val = parseFloat(match[1]);
  const unit = match[2];
  return val * (units[unit] || 1);
}
function getDockerContainers2() {
  return new Promise((resolve) => {
    (0, import_child_process7.exec)('docker ps --format "{{.ID}}|{{.Image}}|{{.Status}}|{{.Names}}"', (err, stdout) => {
      if (err) return resolve({ containers: [], totalMem: 0 });
      const lines = stdout.trim().split("\n");
      if (lines.length === 0 || lines.length === 1 && lines[0] === "") {
        return resolve({ containers: [], totalMem: 0 });
      }
      const containers = lines.map((line) => {
        const parts = line.split("|");
        return {
          id: parts[0],
          image: parts[1],
          status: parts[2],
          name: parts[3],
          memoryStr: "0B",
          memoryBytes: 0
        };
      });
      (0, import_child_process7.exec)('docker stats --no-stream --format "{{.ID}}|{{.MemUsage}}"', (err2, stdout2) => {
        let totalMem = 0;
        if (!err2) {
          const statLines = stdout2.trim().split("\n");
          const statMap = {};
          statLines.forEach((l) => {
            const parts = l.split("|");
            if (parts.length >= 2) {
              const usageStr = parts[1].split("/")[0].trim();
              statMap[parts[0]] = usageStr;
            }
          });
          containers.forEach((c) => {
            if (statMap[c.id]) {
              c.memoryStr = statMap[c.id];
              c.memoryBytes = parseMemory(c.memoryStr);
              totalMem += c.memoryBytes;
            }
          });
        }
        resolve({ containers, totalMem });
      });
    });
  });
}
function stopContainer(id) {
  return new Promise((resolve) => {
    (0, import_child_process7.exec)(`docker stop ${id}`, (err) => {
      if (err) return resolve({ success: false, error: err.message });
      resolve({ success: true });
    });
  });
}
function stopAllContainers() {
  return new Promise((resolve) => {
    (0, import_child_process7.exec)("docker stop $(docker ps -q)", (err) => {
      if (err) {
        if (err.message.includes("requires at least 1 argument") || err.message.includes("Usage:")) {
          return resolve({ success: true, message: "No containers to stop" });
        }
        return resolve({ success: false, error: err.message });
      }
      resolve({ success: true });
    });
  });
}
router17.get("/", async (req, res) => {
  const data = await getDockerContainers2();
  res.json(data);
});
router17.post("/stop", async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      res.status(400).json({ error: "ID required" });
      return;
    }
    const result = await stopContainer(id);
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
router17.post("/stop-all", async (req, res) => {
  try {
    const result = await stopAllContainers();
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
var apidocker_default = router17;

// src/routes/availabletemplates.ts
var import_express21 = __toESM(require("express"));

// ../../packages/template/databases/mysql.ts
var MySQL = {
  name: "MySQL",
  description: "MySQL Database (Local)",
  notes: "Requires MySQL installed in your system.",
  templating: [
    {
      action: "command",
      command: "npm install open"
    },
    {
      action: "file",
      file: "server.js",
      filecontent: `const path = require('path');

// Configuration
const EDITOR_URL = 'http://localhost/phpmyadmin'; // Change this to your preferred editor URL

(async () => {
    console.log(\`Opening MySQL Editor at \${EDITOR_URL}...\`);
    try {
        const open = (await import('open')).default;
        await open(EDITOR_URL);
        console.log('Opened successfully.');
    } catch (err) {
        console.error('Failed to open browser:', err);
    }
})();`
    },
    {
      action: "command",
      command: 'npm pkg set scripts.start="node server.js"'
    },
    {
      action: "command",
      command: `npm pkg set scripts.stop="echo 'Note: MySQL is running as a system service. Please stop it manually.'"`
    },
    {
      action: "command",
      command: 'npm pkg set fontawesomeIcon="fa-solid fa-database"'
    }
  ]
};

// ../../packages/template/databases/postgres.ts
var PostgreSQL = {
  name: "PostgreSQL",
  description: "PostgreSQL Database (Docker Compose)",
  notes: "Requires Docker installed.",
  templating: [
    {
      action: "file",
      file: "docker-compose.yml",
      filecontent: `

services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydatabase
    ports:
      - "0:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d mydatabase"]
      interval: 5s
      timeout: 5s
      retries: 5

  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: root
    ports:
      - "0:80"
    depends_on:
      - postgres

volumes:
  postgres-data:`
    },
    {
      action: "file",
      file: "index.js",
      filecontent: `const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');
let containerId = null;

console.log('Starting PostgreSQL...');

// Start Docker Compose
const child = spawn('docker', ['compose', 'up'], { stdio: 'inherit' });

child.on('close', (code) => {
    process.exit(code || 0);
});



// Setup Control Server
const server = http.createServer((req, res) => {
    if (req.url === '/stop') {
        res.writeHead(200);
        res.end('Stopping...');
        cleanup();
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(0, () => {
    const port = server.address().port;
    // We update runtime file later when we get the container ID
});

// Info Loop
// Check status loop
// Check status loop
const checkStatus = () => {
    exec('docker compose port postgres 5432', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const port = stdout.trim().split(':')[1];
        if (!port) {
            setTimeout(checkStatus, 2000);
            return;
        }

        // Check pgAdmin port
        exec('docker compose port pgadmin 80', (err2, stdout2, stderr2) => {
            const pgAdminPort = (stdout2 && stdout2.trim()) ? stdout2.trim().split(':')[1] : null;
            if (!pgAdminPort) {
                setTimeout(checkStatus, 2000);
                return;
            }

            // Verify pgAdmin is actually responding to HTTP
            http.get(\`http://localhost:\${pgAdminPort}\`, (res) => {
                // Capture Container IDs
                exec('docker compose ps -q', (err3, stdout3) => {
                     const containerIds = stdout3 ? stdout3.trim().split('\\n') : [];
                     
                     try {
                        fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
                            port: server.address().port, 
                            pid: process.pid,
                            containerIds: containerIds
                        }));
                     } catch(e) {
                        console.error('Failed to write runtime file:', e);
                     }

                     console.clear();
                     console.log('\\n==================================================');
                     console.log('\u{1F680} PostgreSQL is running!');
                     console.log('--------------------------------------------------');
                     console.log(\`\u{1F50C} Connection String: postgres://user:password@localhost:\${port}/mydatabase\`);
                     console.log('\u{1F464} Username:          user');
                     console.log('\u{1F511} Password:          password');
                     console.log('\u{1F5C4}\uFE0F  Database:          mydatabase');
                     console.log(\`\u{1F310} Port:              \${port}\`);
                     console.log('--------------------------------------------------');
                     console.log('\u{1F418} pgAdmin 4 is running!');
                     console.log(\`\u{1F30D} URL:               http://localhost:\${pgAdminPort}\`);
                     console.log('\u{1F4E7} Email:             admin@admin.com');
                     console.log('\u{1F511} Password:          root');
                     console.log('==================================================\\n');
                });
            }).on('error', (e) => {
                // Connection failed (ECONNREFUSED usually), retry
                setTimeout(checkStatus, 2000);
            });
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping PostgreSQL...');
    try { 
        const runtime = JSON.parse(fs.readFileSync(RUNTIME_FILE));
        if (runtime.containerIds) {
             console.log(\`Stopping \${runtime.containerIds.length} containers...\`);
             runtime.containerIds.forEach(id => {
                exec(\`docker stop \${id}\`);
             });
        }
    } catch(e) {}
    try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
    
    exec('docker compose stop', () => {
        process.exit(0);
    });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`
    },
    {
      action: "command",
      command: "npm install"
    },
    {
      action: "command",
      command: 'npm pkg set scripts.start="node index.js"'
    },
    {
      action: "command",
      command: `npm pkg set scripts.stop="node -e 'const fs=require(\\"fs\\"); try{const p=JSON.parse(fs.readFileSync(\\".runtime.json\\")).port; fetch(\\"http://localhost:\\"+p+\\"/stop\\").catch(e=>{})}catch(e){}'"`
    },
    {
      action: "command",
      command: 'npm pkg set fontawesomeIcon="fa-solid fa-database"'
    }
  ]
};

// ../../packages/template/databases/supabase.ts
var Supabase = {
  name: "Supabase",
  description: "Supabase (Docker)",
  notes: "Requires Docker installed.",
  templating: [
    {
      action: "command",
      command: "npm install supabase --save-dev"
    },
    {
      action: "command",
      command: "npx supabase init"
    },
    {
      action: "command",
      command: 'npm pkg set scripts.start="npx supabase start"'
    },
    {
      action: "command",
      command: 'npm pkg set scripts.stop="npx supabase stop"'
    },
    {
      action: "command",
      command: 'npm pkg set fontawesomeIcon="fa-solid fa-database"'
    }
  ]
};

// ../../packages/template/databases/redis.ts
var Redis = {
  name: "Redis",
  description: "Redis (Docker Compose)",
  notes: "Requires Docker installed.",
  templating: [
    {
      action: "file",
      file: "docker-compose.yml",
      filecontent: `

services:
  redis:
    image: redis:7.2-alpine
    restart: unless-stopped
    ports:
      - "0:6379"
    volumes:
      - redis-data:/data
    command: >
      redis-server
      --appendonly yes
      --save 60 1
      --loglevel warning
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  redis-data:`
    },
    {
      action: "file",
      file: "index.js",
      filecontent: `const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');
let containerId = null;

console.log('Starting Redis...');

const child = spawn('docker', ['compose', 'up'], { stdio: 'inherit' });

child.on('close', (code) => {
    process.exit(code || 0);
});

// Setup Control Server
const server = http.createServer((req, res) => {
    if (req.url === '/stop') {
        res.writeHead(200);
        res.end('Stopping...');
        cleanup();
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(0, () => {
    const port = server.address().port;
    // We update runtime file later
});

// Give it time to start
// Check status loop
const checkStatus = () => {
    exec('docker compose port redis 6379', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const port = stdout.trim().split(':')[1];
        if (!port) {
            setTimeout(checkStatus, 2000);
            return;
        }

        exec('docker compose ps -q redis', (err2, stdout2) => {
            let containerIds = [];
            if (stdout2) containerIds = [stdout2.trim()];

            try {
                fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
                    port: server.address().port, 
                    pid: process.pid,
                    containerIds: containerIds 
                }));
            } catch(e) {}

            console.clear();
            console.log('\\n==================================================');
            console.log('\u{1F680} Redis is running!');
            console.log('--------------------------------------------------');
            console.log(\`\u{1F50C} Connection String: redis://localhost:\${port}\`);
            console.log(\`\u{1F310} Port:              \${port}\`);

            console.log('==================================================\\n');
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping Redis...');
    try { 
        const runtime = JSON.parse(fs.readFileSync(RUNTIME_FILE));
        if (runtime.containerIds) {
             console.log(\`Stopping \${runtime.containerIds.length} containers...\`);
             runtime.containerIds.forEach(id => {
                exec(\`docker stop \${id}\`);
             });
        }
    } catch(e) {}
    try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
    
    exec('docker compose stop', () => {
        process.exit(0);
    });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`
    },
    {
      action: "command",
      command: "npm install"
    },
    {
      action: "command",
      command: 'npm pkg set scripts.start="node index.js"'
    },
    {
      action: "command",
      command: `npm pkg set scripts.stop="node -e 'const fs=require(\\"fs\\"); try{const p=JSON.parse(fs.readFileSync(\\".runtime.json\\")).port; fetch(\\"http://localhost:\\"+p+\\"/stop\\").catch(e=>{})}catch(e){}'"`
    },
    {
      action: "command",
      command: 'npm pkg set fontawesomeIcon="fa-solid fa-database"'
    }
  ]
};

// ../../packages/template/databases/mongodb.ts
var MongoDB = {
  name: "MongoDB",
  description: "MongoDB (Docker Compose)",
  notes: "Requires Docker installed.",
  templating: [
    {
      action: "file",
      file: "docker-compose.yml",
      filecontent: `services:
  mongodb:
    image: mongo:7.0
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    ports:
      - "0:27017"
    volumes:
      - mongo-data:/data/db
    command: ["mongod", "--quiet"]
    logging:
      driver: "none"
    healthcheck:
      test: echo "db.runCommand('ping').ok" | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 10s
      retries: 5

volumes:
  mongo-data:`
    },
    {
      action: "file",
      file: "index.js",
      filecontent: `const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');
let containerId = null;

console.log('Starting MongoDB...');

const child = spawn('docker', ['compose', 'up'], { stdio: 'inherit' });

child.on('close', (code) => {
    process.exit(code || 0);
});



// Setup Control Server
const server = http.createServer((req, res) => {
    if (req.url === '/stop') {
        res.writeHead(200);
        res.end('Stopping...');
        cleanup();
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(0, () => {
    const port = server.address().port;
    // We update runtime file later
});

// Give it time to start, then print info
// Check status loop
const checkStatus = () => {
    exec('docker compose port mongodb 27017', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const port = stdout.trim().split(':')[1];
        if (!port) {
            setTimeout(checkStatus, 2000);
            return;
        }

        exec('docker compose ps -q mongodb', (err2, stdout2) => {
            let containerIds = [];
            if (stdout2) containerIds = [stdout2.trim()];

            try {
                fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
                    port: server.address().port, 
                    pid: process.pid,
                    containerIds: containerIds 
                }));
            } catch(e) {}

            console.clear();
            console.log('\\n==================================================');
            console.log('\u{1F680} MongoDB is running!');
            console.log('--------------------------------------------------');
            console.log(\`\u{1F50C} Connection String: mongodb://admin:password@localhost:\${port}\`);
            console.log('\u{1F464} Username:          admin');
            console.log('\u{1F511} Password:          password');
            console.log(\`\u{1F310} Port:              \${port}\`);

            console.log('==================================================\\n');
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping MongoDB...');
    try { 
        const runtime = JSON.parse(fs.readFileSync(RUNTIME_FILE));
        if (runtime.containerIds) {
             console.log(\`Stopping \${runtime.containerIds.length} containers...\`);
             runtime.containerIds.forEach(id => {
                exec(\`docker stop \${id}\`);
             });
        }
    } catch(e) {}
    try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
    
    exec('docker compose stop', () => {
        process.exit(0);
    });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`
    },
    {
      action: "command",
      command: "npm install"
    },
    {
      action: "command",
      command: 'npm pkg set scripts.start="node index.js"'
    },
    {
      action: "command",
      command: `npm pkg set scripts.stop="node -e 'const fs=require(\\"fs\\"); try{const p=JSON.parse(fs.readFileSync(\\".runtime.json\\")).port; fetch(\\"http://localhost:\\"+p+\\"/stop\\").catch(e=>{})}catch(e){}'"`
    },
    {
      action: "command",
      command: 'npm pkg set fontawesomeIcon="fa-solid fa-database"'
    }
  ]
};

// ../../packages/template/databases/meilisearch.ts
var Meilisearch = {
  name: "Meilisearch",
  description: "Meilisearch (Docker Compose)",
  notes: "Requires Docker installed. Fast, open-source search engine.",
  templating: [
    {
      action: "file",
      file: "docker-compose.yml",
      filecontent: `services:
  meilisearch:
    image: getmeili/meilisearch:v1.10
    restart: unless-stopped
    environment:
      - MEILI_MASTER_KEY=masterKey
      - MEILI_ENV=development
    ports:
      - "0:7700"
    volumes:
      - meili-data:/meili_data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:7700/health"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  meili-data:`
    },
    {
      action: "file",
      file: "index.js",
      filecontent: `const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');
let containerId = null;

console.log('Starting Meilisearch...');

// Spawn Docker Compose
const child = spawn('docker', ['compose', 'up'], { stdio: 'inherit' });

child.on('close', (code) => {
    process.exit(code || 0);
});

// Setup Control Server
const server = http.createServer((req, res) => {
    if (req.url === '/stop') {
        res.writeHead(200);
        res.end('Stopping...');
        cleanup();
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(0, () => {
    // We update runtime file later
});

// Check status loop
const checkStatus = () => {
    exec('docker compose port meilisearch 7700', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const port = stdout.trim().split(':')[1];
        if (!port) {
            setTimeout(checkStatus, 2000);
            return;
        }

        exec('docker compose ps -q meilisearch', (err2, stdout2) => {
            let containerIds = [];
            if (stdout2) containerIds = [stdout2.trim()];

            try {
                fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
                    port: server.address().port, 
                    pid: process.pid,
                    containerIds: containerIds 
                }));
            } catch(e) {}

            console.clear();
            console.log('\\n==================================================');
            console.log('\u{1F50D} Meilisearch is running!');
            console.log('--------------------------------------------------');
            console.log(\`\u{1F310} URL:               http://localhost:\${port}\`);
            console.log('\u{1F511} Master Key:        masterKey');
            console.log(\`\u{1F50C} API Port:          \${port}\`);
            console.log('--------------------------------------------------');
            console.log('\u{1F4DA} Docs: https://www.meilisearch.com/docs');
            console.log('==================================================\\n');
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping Meilisearch...');
    try { 
        const runtime = JSON.parse(fs.readFileSync(RUNTIME_FILE));
        if (runtime.containerIds) {
             console.log(\`Stopping \${runtime.containerIds.length} containers...\`);
             runtime.containerIds.forEach(id => {
                exec(\`docker stop \${id}\`);
             });
        }
    } catch(e) {}
    try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
    
    exec('docker compose stop', () => {
        process.exit(0);
    });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`
    },
    {
      action: "command",
      command: "npm install"
    },
    {
      action: "command",
      command: 'npm pkg set scripts.start="node index.js"'
    },
    {
      action: "command",
      command: `npm pkg set scripts.stop="node -e 'const fs=require(\\"fs\\"); try{const p=JSON.parse(fs.readFileSync(\\".runtime.json\\")).port; fetch(\\"http://localhost:\\"+p+\\"/stop\\").catch(e=>{})}catch(e){}'"`
    },
    {
      action: "command",
      command: 'npm pkg set fontawesomeIcon="fa-solid fa-magnifying-glass"'
    },
    {
      action: "command",
      command: 'npm pkg set name="$(basename $PWD)"'
    }
  ]
};

// ../../packages/template/databases/minio.ts
var MinIO = {
  name: "MinIO",
  description: "MinIO Object Storage (S3 Compatible)",
  notes: "Requires Docker installed. S3-compatible object storage.",
  templating: [
    {
      action: "file",
      file: "docker-compose.yml",
      filecontent: `services:
  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    restart: unless-stopped
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=minioadmin
    ports:
      - "0:9000"
      - "0:9001"
    volumes:
      - minio-data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

volumes:
  minio-data:`
    },
    {
      action: "file",
      file: "index.js",
      filecontent: `const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');
let containerId = null;

console.log('Starting MinIO...');

// Spawn Docker Compose
const child = spawn('docker', ['compose', 'up'], { stdio: 'inherit' });

child.on('close', (code) => {
    process.exit(code || 0);
});

// Setup Control Server
const server = http.createServer((req, res) => {
    if (req.url === '/stop') {
        res.writeHead(200);
        res.end('Stopping...');
        cleanup();
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(0, () => {
    // We update runtime file later
});

// Check status loop
const checkStatus = () => {
    // Check API Port
    exec('docker compose port minio 9000', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const apiPort = stdout.trim().split(':')[1];
        if (!apiPort) {
            setTimeout(checkStatus, 2000);
            return;
        }

        // Check Console Port
        exec('docker compose port minio 9001', (err2, stdout2, stderr2) => {
            if (err2 || stderr2 || !stdout2) {
                setTimeout(checkStatus, 2000);
                return;
            }
            const consolePort = stdout2.trim().split(':')[1];
             if (!consolePort) {
                setTimeout(checkStatus, 2000);
                return;
            }

            // Get Container ID
            exec('docker compose ps -q minio', (err3, stdout3) => {
                let containerIds = [];
                if (stdout3) containerIds = [stdout3.trim()];

                try {
                    fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
                        port: server.address().port, 
                        pid: process.pid,
                        containerIds: containerIds 
                    }));
                } catch(e) {}

                console.clear();
                console.log('\\n==================================================');
                console.log('\u{1FAA3}  MinIO Object Storage is running!');
                console.log('--------------------------------------------------');
                console.log(\`\u{1F310} Console URL:       http://localhost:\${consolePort}\`);
                console.log(\`\u{1F50C} API URL:           http://localhost:\${apiPort}\`);
                console.log('\u{1F464} Username:          minioadmin');
                console.log('\u{1F511} Password:          minioadmin');
                console.log('--------------------------------------------------');
                console.log('\u{1F4DA} Docs: https://min.io/docs/minio/linux/index.html');
                console.log('==================================================\\n');
            });
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping MinIO...');
    try { 
        const runtime = JSON.parse(fs.readFileSync(RUNTIME_FILE));
        if (runtime.containerIds) {
             console.log(\`Stopping \${runtime.containerIds.length} containers...\`);
             runtime.containerIds.forEach(id => {
                exec(\`docker stop \${id}\`);
             });
        }
    } catch(e) {}
    try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
    
    exec('docker compose stop', () => {
        process.exit(0);
    });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`
    },
    {
      action: "command",
      command: "npm install"
    },
    {
      action: "command",
      command: 'npm pkg set scripts.start="node index.js"'
    },
    {
      action: "command",
      command: `npm pkg set scripts.stop="node -e 'const fs=require(\\"fs\\"); try{const p=JSON.parse(fs.readFileSync(\\".runtime.json\\")).port; fetch(\\"http://localhost:\\"+p+\\"/stop\\").catch(e=>{})}catch(e){}'"`
    },
    {
      action: "command",
      command: 'npm pkg set fontawesomeIcon="fa-solid fa-bucket"'
    },
    {
      action: "command",
      command: 'npm pkg set name="$(basename $PWD)"'
    }
  ]
};

// ../../packages/template/database.ts
var templates = [
  MySQL,
  PostgreSQL,
  Supabase,
  Redis,
  MongoDB,
  Meilisearch,
  MinIO
];
var database_default = templates;

// ../../packages/template/demo/aichat/files/indexHtml.ts
var indexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FreshFruit - Premium Organic Fruits</title>
    <meta name="description" content="Fresh organic fruits delivered to your doorstep. Premium quality, farm-to-table freshness.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="header-content">
            <div class="logo">\u{1F34A} FreshFruit</div>
            <nav>
                <ul class="nav-links">
                    <li><a href="#products">Products</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <h1>Fresh Organic Fruits Delivered Daily</h1>
        <p>Experience the finest selection of farm-fresh fruits, handpicked and delivered straight to your doorstep. Taste the difference of truly organic produce.</p>
        <button class="cta-button">Shop Now</button>
    </section>

    <!-- Products Section -->
    <section class="products" id="products">
        <h2>Our Fresh Selection</h2>
        <div class="products-grid">
            <div class="product-card">
                <div class="product-image">\u{1F34E}</div>
                <div class="product-info">
                    <h3>Organic Apples</h3>
                    <p>Crisp and sweet, straight from our partner orchards</p>
                    <span class="product-price">$4.99/lb</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">\u{1F34A}</div>
                <div class="product-info">
                    <h3>Valencia Oranges</h3>
                    <p>Juicy and vitamin-packed, perfect for fresh juice</p>
                    <span class="product-price">$5.49/lb</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">\u{1F347}</div>
                <div class="product-info">
                    <h3>Premium Grapes</h3>
                    <p>Seedless and bursting with natural sweetness</p>
                    <span class="product-price">$6.99/lb</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">\u{1F96D}</div>
                <div class="product-info">
                    <h3>Alphonso Mangoes</h3>
                    <p>The king of fruits, rich and aromatic</p>
                    <span class="product-price">$8.99/lb</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">\u{1F353}</div>
                <div class="product-info">
                    <h3>Fresh Strawberries</h3>
                    <p>Hand-picked at peak ripeness for maximum flavor</p>
                    <span class="product-price">$7.49/lb</span>
                </div>
            </div>
            <div class="product-card">
                <div class="product-image">\u{1F34C}</div>
                <div class="product-info">
                    <h3>Organic Bananas</h3>
                    <p>Naturally ripened, perfect for smoothies</p>
                    <span class="product-price">$2.99/lb</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Chat Widget -->
    <div class="chat-widget">
        <div class="chat-window" id="chatWindow">
            <div class="chat-header">
                <div class="chat-header-avatar">\u{1F34A}</div>
                <div class="chat-header-info">
                    <h4>FreshFruit Support</h4>
                    <span>We typically reply instantly</span>
                </div>
            </div>
            <div class="chat-messages" id="chatMessages">
                <div class="message bot">
                    Hi! \u{1F44B} Welcome to FreshFruit! How can I help you today? I can answer questions about our products, delivery, or anything else!
                </div>
            </div>
            <div class="chat-input-container">
                <input type="text" class="chat-input" id="chatInput" placeholder="Type your message..." autocomplete="off">
                <button class="chat-send" id="chatSend">
                    <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>
        </div>
        <button class="chat-toggle" id="chatToggle">
            <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
        </button>
    </div>

    <script>
        // Chat Widget Functionality
        const chatToggle = document.getElementById('chatToggle');
        const chatWindow = document.getElementById('chatWindow');
        const chatInput = document.getElementById('chatInput');
        const chatSend = document.getElementById('chatSend');
        const chatMessages = document.getElementById('chatMessages');

        // Toggle chat window
        chatToggle.addEventListener('click', () => {
            chatWindow.classList.toggle('open');
            if (chatWindow.classList.contains('open')) {
                chatInput.focus();
            }
        });

        // Send message function
        async function sendMessage() {
            const message = chatInput.value.trim();
            if (!message) return;

            // Add user message
            addMessage(message, 'user');
            chatInput.value = '';

            // Show typing indicator
            const typingEl = showTyping();

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                });

                const data = await response.json();
                typingEl.remove();

                if (data.reply) {
                    addMessage(data.reply, 'bot');
                } else {
                    addMessage('Sorry, I encountered an error. Please try again.', 'bot');
                }
            } catch (error) {
                typingEl.remove();
                addMessage('Sorry, I\\'m having trouble connecting. Please try again later.', 'bot');
            }
        }

        // Add message to chat
        function addMessage(text, type) {
            const messageEl = document.createElement('div');
            messageEl.className = 'message ' + type;
            messageEl.textContent = text;
            chatMessages.appendChild(messageEl);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // Show typing indicator
        function showTyping() {
            const typingEl = document.createElement('div');
            typingEl.className = 'typing-indicator';
            typingEl.innerHTML = '<span></span><span></span><span></span>';
            chatMessages.appendChild(typingEl);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return typingEl;
        }

        // Event listeners
        chatSend.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    </script>
</body>
</html>
`;

// ../../packages/template/demo/aichat/files/adminHtml.ts
var adminHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - AI Chat Configuration</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <header class="header">
        <div class="header-content">
            <div class="logo">\u{1F34A} FreshFruit Admin</div>
            <nav>
                <ul class="nav-links">
                    <li><a href="/">View Store</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <div class="admin-container">
        <div class="admin-header">
            <h1>AI Chat Configuration</h1>
            <p>Configure your AI provider and embed FAQ knowledge for customer support</p>
        </div>

        <!-- AI Provider Configuration -->
        <div class="admin-card">
            <h2>\u{1F511} AI Provider Settings</h2>
            <form id="configForm">
                <div class="form-group">
                    <label for="apiKey">API Key</label>
                    <input type="password" class="form-input" id="apiKey" placeholder="sk-..." autocomplete="off">
                </div>
                <div class="form-group">
                    <label for="providerUrl">Chat Completions URL</label>
                    <input type="text" class="form-input" id="providerUrl" placeholder="https://api.openai.com/v1/chat/completions">
                </div>
                <div class="form-group">
                    <label for="embeddingsUrl">Embeddings URL</label>
                    <input type="text" class="form-input" id="embeddingsUrl" placeholder="https://api.openai.com/v1/embeddings">
                </div>
                <div class="form-group">
                    <label for="model">Chat Model</label>
                    <input type="text" class="form-input" id="model" placeholder="gpt-3.5-turbo">
                </div>
                <div class="form-group">
                    <label for="embeddingsModel">Embeddings Model</label>
                    <input type="text" class="form-input" id="embeddingsModel" placeholder="text-embedding-3-small">
                </div>
                <button type="submit" class="btn">\u{1F4BE} Save Configuration</button>
            </form>
        </div>

        <!-- Knowledge Base Embedding -->
        <div class="admin-card">
            <h2>\u{1F4DA} Knowledge Base</h2>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
                Enter your FAQ content below. Each paragraph will be embedded and used to answer customer questions.
            </p>
            <form id="embedForm">
                <div class="form-group">
                    <label for="faqContent">FAQ Content</label>
                    <textarea class="form-input" id="faqContent" placeholder="Enter your FAQ content here...

Example:
Q: What are your delivery hours?
A: We deliver from 8 AM to 8 PM, Monday through Saturday.

Q: How do I return a product?
A: You can return any product within 24 hours of delivery if you're not satisfied. Contact our support team.

Q: Do you offer organic certification?
A: Yes, all our products are certified organic by USDA."></textarea>
                </div>
                <button type="submit" class="btn" id="embedBtn">\u{1F52E} Embed Knowledge</button>
            </form>
            <div class="status-bar">
                <div class="status-item">
                    <div class="value" id="embeddingCount">0</div>
                    <div class="label">Embeddings</div>
                </div>
                <div class="status-item">
                    <div class="value" id="lastUpdated">Never</div>
                    <div class="label">Last Updated</div>
                </div>
                <div class="status-item">
                    <div class="value" id="configStatus">\u274C</div>
                    <div class="label">API Configured</div>
                </div>
            </div>
        </div>

        <!-- Clear Data -->
        <div class="admin-card">
            <h2>\u{1F5D1}\uFE0F Data Management</h2>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
                Clear all embeddings to start fresh or to re-embed with new content.
            </p>
            <button class="btn btn-secondary" id="clearBtn">Clear All Embeddings</button>
        </div>
    </div>

    <div class="toast" id="toast"></div>

    <script>
        // Toast notification
        function showToast(message, duration = 3000) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), duration);
        }

        // Load configuration on page load
        async function loadConfig() {
            try {
                const response = await fetch('/api/config');
                const data = await response.json();
                
                if (data.config) {
                    document.getElementById('apiKey').value = data.config.apiKey || '';
                    document.getElementById('providerUrl').value = data.config.providerUrl || 'https://api.openai.com/v1/chat/completions';
                    document.getElementById('embeddingsUrl').value = data.config.embeddingsUrl || 'https://api.openai.com/v1/embeddings';
                    document.getElementById('model').value = data.config.model || 'gpt-3.5-turbo';
                    document.getElementById('embeddingsModel').value = data.config.embeddingsModel || 'text-embedding-3-small';
                }
                
                document.getElementById('embeddingCount').textContent = data.embeddingCount || 0;
                document.getElementById('lastUpdated').textContent = data.lastUpdated || 'Never';
                document.getElementById('configStatus').textContent = data.config?.apiKey ? '\u2705' : '\u274C';
            } catch (error) {
                console.error('Failed to load config:', error);
            }
        }

        // Save configuration
        document.getElementById('configForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const config = {
                apiKey: document.getElementById('apiKey').value,
                providerUrl: document.getElementById('providerUrl').value,
                embeddingsUrl: document.getElementById('embeddingsUrl').value,
                model: document.getElementById('model').value,
                embeddingsModel: document.getElementById('embeddingsModel').value
            };

            try {
                const response = await fetch('/api/config', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(config)
                });
                
                if (response.ok) {
                    showToast('\u2705 Configuration saved successfully!');
                    document.getElementById('configStatus').textContent = config.apiKey ? '\u2705' : '\u274C';
                } else {
                    showToast('\u274C Failed to save configuration');
                }
            } catch (error) {
                showToast('\u274C Error saving configuration');
            }
        });

        // Embed knowledge
        document.getElementById('embedForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const content = document.getElementById('faqContent').value.trim();
            if (!content) {
                showToast('\u26A0\uFE0F Please enter some content to embed');
                return;
            }

            const embedBtn = document.getElementById('embedBtn');
            embedBtn.disabled = true;
            embedBtn.textContent = '\u23F3 Embedding...';

            try {
                const response = await fetch('/api/embed', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    showToast('\u2705 ' + (data.message || 'Content embedded successfully!'));
                    document.getElementById('embeddingCount').textContent = data.count || 0;
                    document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
                    document.getElementById('faqContent').value = '';
                } else {
                    showToast('\u274C ' + (data.error || 'Failed to embed content'));
                }
            } catch (error) {
                showToast('\u274C Error embedding content');
            } finally {
                embedBtn.disabled = false;
                embedBtn.textContent = '\u{1F52E} Embed Knowledge';
            }
        });

        // Clear embeddings
        document.getElementById('clearBtn').addEventListener('click', async () => {
            if (!confirm('Are you sure you want to clear all embeddings?')) return;

            try {
                const response = await fetch('/api/embed', {
                    method: 'DELETE'
                });
                
                if (response.ok) {
                    showToast('\u2705 All embeddings cleared');
                    document.getElementById('embeddingCount').textContent = '0';
                } else {
                    showToast('\u274C Failed to clear embeddings');
                }
            } catch (error) {
                showToast('\u274C Error clearing embeddings');
            }
        });

        // Load config on page load
        loadConfig();
    </script>
</body>
</html>
`;

// ../../packages/template/demo/aichat/files/stylesTs.ts
var stylesCSS = `/* === CSS Variables === */
:root {
    --primary: #22c55e;
    --primary-dark: #16a34a;
    --secondary: #f97316;
    --bg-dark: #0f172a;
    --bg-card: rgba(255, 255, 255, 0.05);
    --text-light: #f8fafc;
    --text-muted: #94a3b8;
    --border-color: rgba(255, 255, 255, 0.1);
    --shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    --glass: rgba(255, 255, 255, 0.1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
    color: var(--text-light);
    min-height: 100vh;
    line-height: 1.6;
}

/* === Header === */
.header {
    background: var(--glass);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border-color);
    padding: 1rem 2rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.nav-links {
    display: flex;
    gap: 2rem;
    list-style: none;
}

.nav-links a {
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.3s;
}

.nav-links a:hover {
    color: var(--primary);
}

/* === Hero Section === */
.hero {
    padding: 8rem 2rem 4rem;
    text-align: center;
    max-width: 900px;
    margin: 0 auto;
}

.hero h1 {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #fff, var(--primary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero p {
    font-size: 1.25rem;
    color: var(--text-muted);
    margin-bottom: 2rem;
}

.cta-button {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: white;
    padding: 1rem 2.5rem;
    border: none;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3);
}

/* === Products Grid === */
.products {
    max-width: 1200px;
    margin: 0 auto;
    padding: 4rem 2rem;
}

.products h2 {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
}

.product-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    overflow: hidden;
    transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow);
}

.product-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
}

.product-info {
    padding: 1.5rem;
}

.product-info h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
}

.product-info p {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.product-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary);
}

/* === Chatbox Widget === */
.chat-widget {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}

.chat-toggle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 5px 30px rgba(34, 197, 94, 0.4);
    transition: transform 0.3s;
}

.chat-toggle:hover {
    transform: scale(1.1);
}

.chat-toggle svg {
    width: 28px;
    height: 28px;
    fill: white;
}

.chat-window {
    position: absolute;
    bottom: 80px;
    right: 0;
    width: 380px;
    height: 500px;
    background: var(--bg-dark);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    box-shadow: var(--shadow);
    display: none;
    flex-direction: column;
    overflow: hidden;
    animation: slideUp 0.3s ease;
}

.chat-window.open {
    display: flex;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.chat-header {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.chat-header-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
}

.chat-header-info h4 {
    font-size: 1rem;
    font-weight: 600;
}

.chat-header-info span {
    font-size: 0.75rem;
    opacity: 0.8;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.message {
    max-width: 80%;
    padding: 0.75rem 1rem;
    border-radius: 18px;
    font-size: 0.9rem;
    line-height: 1.4;
}

.message.bot {
    background: var(--glass);
    border: 1px solid var(--border-color);
    align-self: flex-start;
    border-bottom-left-radius: 4px;
}

.message.user {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    align-self: flex-end;
    border-bottom-right-radius: 4px;
}

.typing-indicator {
    display: flex;
    gap: 4px;
    padding: 0.75rem 1rem;
    background: var(--glass);
    border: 1px solid var(--border-color);
    border-radius: 18px;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
}

.typing-indicator span {
    width: 8px;
    height: 8px;
    background: var(--text-muted);
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
}

.chat-input-container {
    padding: 1rem;
    border-top: 1px solid var(--border-color);
    display: flex;
    gap: 0.5rem;
}

.chat-input {
    flex: 1;
    background: var(--glass);
    border: 1px solid var(--border-color);
    border-radius: 25px;
    padding: 0.75rem 1rem;
    color: var(--text-light);
    font-size: 0.9rem;
    outline: none;
}

.chat-input::placeholder {
    color: var(--text-muted);
}

.chat-send {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
}

.chat-send:hover {
    transform: scale(1.05);
}

.chat-send svg {
    width: 20px;
    height: 20px;
    fill: white;
}

/* === Admin Panel Styles === */
.admin-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 6rem 2rem 4rem;
}

.admin-header {
    text-align: center;
    margin-bottom: 3rem;
}

.admin-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
}

.admin-header p {
    color: var(--text-muted);
}

.admin-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 2rem;
    margin-bottom: 2rem;
}

.admin-card h2 {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 0.5rem;
}

.form-input {
    width: 100%;
    background: var(--glass);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 0.875rem 1rem;
    color: var(--text-light);
    font-size: 0.95rem;
    outline: none;
    transition: border-color 0.3s;
}

.form-input:focus {
    border-color: var(--primary);
}

.form-input::placeholder {
    color: var(--text-muted);
}

textarea.form-input {
    min-height: 200px;
    resize: vertical;
    font-family: inherit;
}

.btn {
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    color: white;
    padding: 0.875rem 2rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(34, 197, 94, 0.3);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.btn-secondary {
    background: var(--glass);
    border: 1px solid var(--border-color);
}

.status-bar {
    background: var(--glass);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
}

.status-item {
    text-align: center;
}

.status-item .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary);
}

.status-item .label {
    font-size: 0.8rem;
    color: var(--text-muted);
}

.toast {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--primary);
    color: white;
    padding: 1rem 2rem;
    border-radius: 10px;
    box-shadow: var(--shadow);
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 2000;
}

.toast.show {
    opacity: 1;
}

/* === Responsive === */
@media (max-width: 768px) {
    .hero h1 {
        font-size: 2.5rem;
    }
    
    .chat-window {
        width: calc(100vw - 40px);
        height: 60vh;
    }
    
    .nav-links {
        display: none;
    }
}
`;

// ../../packages/template/demo/aichat/files/serverTs.ts
var serverTs = `import express, { Request, Response } from 'express';
import path from 'path';
import chatRouter from './routes/chat';
import embedRouter from './routes/embed';
import configRouter from './routes/config';
import { loadEmbeddings } from './vectorStore';
import { loadConfig } from './aiClient';

const app = express();
const port = 3500;

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Load persisted data
loadEmbeddings();
loadConfig();

// API Routes
app.use('/api/chat', chatRouter);
app.use('/api/embed', embedRouter);
app.use('/api/config', configRouter);

// Serve main page
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(port, () => {
    console.log('');
    console.log('\u{1F34A} ====================================');
    console.log('   FreshFruit AI Chat Demo');
    console.log('====================================');
    console.log('');
    console.log('\u{1F4CD} Store:       http://localhost:' + port);
    console.log('\u{1F527} Admin Panel: http://localhost:' + port + '/admin.html');
    console.log('');
    console.log('\u{1F4DD} Quick Start:');
    console.log('   1. Open the Admin Panel');
    console.log('   2. Configure your OpenAI API key');
    console.log('   3. Add FAQ content and click "Embed"');
    console.log('   4. Open the Store and chat with the AI!');
    console.log('');
});
`;
var tsconfigJson = `{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}`;
var tsupConfig = `import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ['cjs'],
});`;

// ../../packages/template/demo/aichat/files/vectorStoreTs.ts
var vectorStoreTs = `import fs from 'fs';
import path from 'path';

const EMBEDDINGS_FILE = path.join(__dirname, '../embeddings.json');

interface EmbeddingEntry {
    id: string;
    text: string;
    embedding: number[];
    timestamp: number;
}

// In-memory vector database
let vectorStore: EmbeddingEntry[] = [];

// Load embeddings from file on startup
export function loadEmbeddings(): void {
    try {
        if (fs.existsSync(EMBEDDINGS_FILE)) {
            const data = fs.readFileSync(EMBEDDINGS_FILE, 'utf-8');
            vectorStore = JSON.parse(data);
            console.log('\u{1F4DA} Loaded ' + vectorStore.length + ' embeddings from file');
        }
    } catch (error) {
        console.error('Failed to load embeddings:', error);
        vectorStore = [];
    }
}

// Save embeddings to file
export function saveEmbeddings(): void {
    try {
        fs.writeFileSync(EMBEDDINGS_FILE, JSON.stringify(vectorStore, null, 2));
    } catch (error) {
        console.error('Failed to save embeddings:', error);
    }
}

// Add embedding to store
export function addEmbedding(text: string, embedding: number[]): void {
    const entry: EmbeddingEntry = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        text,
        embedding,
        timestamp: Date.now()
    };
    vectorStore.push(entry);
    saveEmbeddings();
}

// Clear all embeddings
export function clearEmbeddings(): void {
    vectorStore = [];
    saveEmbeddings();
}

// Get embedding count
export function getEmbeddingCount(): number {
    return vectorStore.length;
}

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Search for similar embeddings
export function searchSimilar(queryEmbedding: number[], topK: number = 3): { text: string; score: number }[] {
    const results = vectorStore
        .map(entry => ({
            text: entry.text,
            score: cosineSimilarity(queryEmbedding, entry.embedding)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
    
    return results;
}

// Get last update time
export function getLastUpdated(): string | null {
    if (vectorStore.length === 0) return null;
    const latest = Math.max(...vectorStore.map(e => e.timestamp));
    return new Date(latest).toLocaleString();
}
`;

// ../../packages/template/demo/aichat/files/aiClientTs.ts
var aiClientTs = `import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(__dirname, '../config.json');

export interface AIConfig {
    apiKey: string;
    providerUrl: string;
    embeddingsUrl: string;
    model: string;
    embeddingsModel: string;
}

// Default configuration
const defaultConfig: AIConfig = {
    apiKey: '',
    providerUrl: 'https://api.openai.com/v1/chat/completions',
    embeddingsUrl: 'https://api.openai.com/v1/embeddings',
    model: 'gpt-3.5-turbo',
    embeddingsModel: 'text-embedding-3-small'
};

let currentConfig: AIConfig = { ...defaultConfig };

// Load configuration from file
export function loadConfig(): void {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
            currentConfig = { ...defaultConfig, ...JSON.parse(data) };
            console.log('\u{1F511} Loaded AI configuration');
        }
    } catch (error) {
        console.error('Failed to load config:', error);
        currentConfig = { ...defaultConfig };
    }
}

// Save configuration to file
export function saveConfig(config: AIConfig): void {
    currentConfig = { ...config };
    try {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    } catch (error) {
        console.error('Failed to save config:', error);
    }
}

// Get current configuration
export function getConfig(): AIConfig {
    return currentConfig;
}

// Call embeddings API
export async function callEmbeddingsAPI(text: string): Promise<number[]> {
    const config = getConfig();
    
    if (!config.apiKey) {
        throw new Error('API key not configured');
    }

    const response = await fetch(config.embeddingsUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + config.apiKey
        },
        body: JSON.stringify({
            model: config.embeddingsModel,
            input: text
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error('Embeddings API error: ' + error);
    }

    const data = await response.json();
    return data.data[0].embedding;
}

// Call chat completions API
export async function callChatAPI(systemPrompt: string, userMessage: string): Promise<string> {
    const config = getConfig();
    
    if (!config.apiKey) {
        throw new Error('API key not configured');
    }

    const response = await fetch(config.providerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + config.apiKey
        },
        body: JSON.stringify({
            model: config.model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            max_tokens: 500,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error('Chat API error: ' + error);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
`;

// ../../packages/template/demo/aichat/files/routesTs.ts
var chatRouteTs = `import { Router, Request, Response } from 'express';
import { searchSimilar } from '../vectorStore';
import { getConfig, callEmbeddingsAPI, callChatAPI } from '../aiClient';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const config = getConfig();
        if (!config.apiKey) {
            return res.json({ 
                reply: "I'm not configured yet. Please ask the admin to set up the AI provider in the admin panel." 
            });
        }

        // Get embedding for the user's message
        const queryEmbedding = await callEmbeddingsAPI(message);
        
        // Search for similar content in our knowledge base
        const similarDocs = searchSimilar(queryEmbedding, 3);
        
        // Build context from similar documents
        let context = '';
        if (similarDocs.length > 0 && similarDocs[0].score > 0.3) {
            context = 'Relevant information from our knowledge base:\\n' + 
                similarDocs
                    .filter(doc => doc.score > 0.3)
                    .map(doc => doc.text)
                    .join('\\n\\n');
        }

        // Create the chat prompt
        const systemPrompt = "You are a helpful customer support assistant for FreshFruit, " +
            "a premium organic fruit delivery service. Be friendly, helpful, and concise. " +
            "If you have relevant information from the knowledge base, use it to answer. " +
            "If you don't know something, say so politely and suggest contacting human support.\\n\\n" +
            (context ? 'Knowledge Base Context:\\n' + context : 'No specific knowledge base context available for this query.');

        // Call the chat API
        const reply = await callChatAPI(systemPrompt, message);
        
        res.json({ reply });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

export default router;
`;
var embedRouteTs = `import { Router, Request, Response } from 'express';
import { addEmbedding, clearEmbeddings, getEmbeddingCount } from '../vectorStore';
import { getConfig, callEmbeddingsAPI } from '../aiClient';

const router = Router();

// Embed new content
router.post('/', async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        
        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const config = getConfig();
        if (!config.apiKey) {
            return res.status(400).json({ error: 'API key not configured. Please configure in admin panel.' });
        }

        // Split content into chunks (by double newline or paragraph)
        const chunks = content
            .split(/\\n\\n+/)
            .map((chunk: string) => chunk.trim())
            .filter((chunk: string) => chunk.length > 10);

        if (chunks.length === 0) {
            return res.status(400).json({ error: 'No valid content chunks found' });
        }

        // Embed each chunk
        let embedded = 0;
        for (const chunk of chunks) {
            try {
                const embedding = await callEmbeddingsAPI(chunk);
                addEmbedding(chunk, embedding);
                embedded++;
            } catch (error) {
                console.error('Failed to embed chunk:', error);
            }
        }

        res.json({ 
            message: 'Successfully embedded ' + embedded + ' chunks',
            count: getEmbeddingCount()
        });
    } catch (error) {
        console.error('Embed error:', error);
        res.status(500).json({ error: 'Failed to embed content' });
    }
});

// Clear all embeddings
router.delete('/', (req: Request, res: Response) => {
    clearEmbeddings();
    res.json({ message: 'All embeddings cleared', count: 0 });
});

export default router;
`;
var configRouteTs = `import { Router, Request, Response } from 'express';
import { getConfig, saveConfig, AIConfig } from '../aiClient';
import { getEmbeddingCount, getLastUpdated } from '../vectorStore';

const router = Router();

// Get current config
router.get('/', (req: Request, res: Response) => {
    const config = getConfig();
    // Mask the API key for security
    const maskedConfig = {
        ...config,
        apiKey: config.apiKey ? '\u2022\u2022\u2022\u2022\u2022\u2022' + config.apiKey.slice(-4) : ''
    };
    
    res.json({
        config: maskedConfig,
        embeddingCount: getEmbeddingCount(),
        lastUpdated: getLastUpdated()
    });
});

// Update config
router.post('/', (req: Request, res: Response) => {
    try {
        const { apiKey, providerUrl, embeddingsUrl, model, embeddingsModel } = req.body;
        
        const newConfig: AIConfig = {
            apiKey: apiKey || '',
            providerUrl: providerUrl || 'https://api.openai.com/v1/chat/completions',
            embeddingsUrl: embeddingsUrl || 'https://api.openai.com/v1/embeddings',
            model: model || 'gpt-3.5-turbo',
            embeddingsModel: embeddingsModel || 'text-embedding-3-small'
        };
        
        saveConfig(newConfig);
        res.json({ message: 'Configuration saved' });
    } catch (error) {
        console.error('Config save error:', error);
        res.status(500).json({ error: 'Failed to save configuration' });
    }
});

export default router;
`;

// ../../packages/template/demo/aichat/index.ts
var AIChat = {
  name: "AI Chat",
  description: "Fullstack AI Customer Support Chat - Chat with your FAQ/Knowledge Base",
  notes: "Requires Node.js, NPM, and an OpenAI-compatible API key",
  templating: [
    // Install dependencies
    {
      action: "command",
      command: "npm install express"
    },
    {
      action: "command",
      command: "npm install -D nodemon typescript ts-node @types/node @types/express tsup"
    },
    // Public files
    {
      action: "file",
      file: "public/index.html",
      filecontent: indexHTML
    },
    {
      action: "file",
      file: "public/admin.html",
      filecontent: adminHTML
    },
    {
      action: "file",
      file: "public/styles.css",
      filecontent: stylesCSS
    },
    // Source files
    {
      action: "file",
      file: "src/index.ts",
      filecontent: serverTs
    },
    {
      action: "file",
      file: "src/vectorStore.ts",
      filecontent: vectorStoreTs
    },
    {
      action: "file",
      file: "src/aiClient.ts",
      filecontent: aiClientTs
    },
    {
      action: "file",
      file: "src/routes/chat.ts",
      filecontent: chatRouteTs
    },
    {
      action: "file",
      file: "src/routes/embed.ts",
      filecontent: embedRouteTs
    },
    {
      action: "file",
      file: "src/routes/config.ts",
      filecontent: configRouteTs
    },
    // Config files
    {
      action: "file",
      file: "tsconfig.json",
      filecontent: tsconfigJson
    },
    {
      action: "file",
      file: "tsup.config.ts",
      filecontent: tsupConfig
    },
    // NPM scripts
    {
      action: "command",
      command: `npm pkg set scripts.dev="nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/index.ts"`
    },
    {
      action: "command",
      command: 'npm pkg set scripts.build="tsup"'
    },
    {
      action: "command",
      command: 'npm pkg set scripts.start="node dist/index.js"'
    },
    {
      action: "command",
      command: 'npm pkg set scripts.stop="npx -y kill-port 3500"'
    },
    {
      action: "command",
      command: 'npm pkg set fontawesomeIcon="fa-solid fa-comments"'
    },
    {
      action: "command",
      command: 'npm pkg set name="$(basename $PWD)"'
    }
  ]
};

// ../../packages/template/demo.ts
var templates2 = [
  AIChat
];
var demo_default = templates2;

// ../../packages/template/projects/vite-react.ts
var ViteReact = {
  name: "Vite React TS",
  description: "Vite React TS template",
  notes: "Node.js and NPM must be installed.",
  templating: [
    {
      action: "command",
      command: "npx -y create-vite@latest --template react-ts --no-interactive ."
    },
    {
      action: "command",
      command: "npm install"
    },
    {
      action: "command",
      command: "npm install -D tailwindcss @tailwindcss/postcss autoprefixer"
    },
    {
      action: "file",
      file: "postcss.config.js",
      filecontent: 'export default {\n  plugins: {\n    "@tailwindcss/postcss": {},\n    autoprefixer: {},\n  },\n}'
    },
    {
      action: "file",
      file: "src/index.css",
      filecontent: '@import "tailwindcss";'
    },
    {
      action: "command",
      command: 'npm pkg set name="$(basename $PWD)"'
    },
    {
      action: "command",
      command: 'npm pkg set scripts.stop="npx -y kill-port 5173"'
    },
    {
      action: "command",
      command: 'npm pkg set fontawesomeIcon="fa-solid fa-globe"'
    }
  ]
};

// ../../packages/template/projects/nextjs.ts
var NextJS = {
  name: "Next.js TS",
  description: "Next.js TS template",
  notes: "Node.js and NPM must be installed.",
  templating: [
    {
      action: "command",
      command: "rm -rf ./* ./.[!.]* 2>/dev/null || true"
    },
    {
      action: "command",
      command: "npx -y create-next-app@latest . --typescript --tailwind --eslint --app --yes --use-npm"
    },
    {
      action: "command",
      command: "npm install"
    },
    {
      action: "command",
      command: 'npm pkg set name="$(basename $PWD)"'
    },
    {
      action: "command",
      command: 'npm pkg set fontawesomeIcon="fa-solid fa-globe"'
    }
  ]
};

// ../../packages/template/projects/express.ts
var expressFile = `import express, { Request, Response } from "express";
import path from "path";
import helloRouter from "./routes/hello";

const app = express();
const port = 3500;

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

app.use("/hello", helloRouter);

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(port, () => {
    console.log("Server running at http://localhost:" + port);
});
`;
var helloRouterFile = `import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World" });
});

export default router;
`;
var htmlFile = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server Status</title>
    <style>
        body {
            background-color: black;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            font-family: sans-serif;
        }
    </style>
</head>
<body>
    <h1>Server running</h1>
</body>
</html>
`;
var ExpressTS = {
  name: "Express.js TS",
  description: "Express.js TS template",
  notes: "Node.js and NPM must be installed.",
  templating: [
    {
      action: "command",
      command: "npm install express"
    },
    {
      action: "command",
      command: "npm install -D nodemon typescript ts-node @types/node @types/express"
    },
    {
      action: "command",
      command: "npm install -D tsup"
    },
    {
      action: "file",
      file: "public/index.html",
      filecontent: htmlFile
    },
    {
      action: "file",
      file: "src/routes/hello.ts",
      filecontent: helloRouterFile
    },
    {
      action: "file",
      file: "src/index.ts",
      filecontent: expressFile
    },
    {
      action: "file",
      file: "tsup.config.ts",
      filecontent: "import { defineConfig } from 'tsup';\n\nexport default defineConfig({\n  entry: ['src/index.ts'],\n  splitting: false,\n  sourcemap: true,\n  clean: true,\n  format: ['cjs'],\n});"
    },
    {
      action: "file",
      file: "tsconfig.json",
      filecontent: '{\n  "compilerOptions": {\n    "target": "es2016",\n    "module": "commonjs",\n    "outDir": "./dist",\n    "esModuleInterop": true,\n    "forceConsistentCasingInFileNames": true,\n    "strict": true,\n    "skipLibCheck": true\n  }\n}'
    },
    {
      action: "command",
      command: `npm pkg set scripts.dev="nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/index.ts"`
    },
    {
      action: "command",
      command: 'npm pkg set scripts.build="tsup"'
    },
    {
      action: "command",
      command: 'npm pkg set scripts.start="node dist/index.js"'
    },
    {
      action: "command",
      command: 'npm pkg set scripts.stop="npx -y kill-port 3500"'
    },
    {
      action: "command",
      command: 'npm pkg set fontawesomeIcon="fa-solid fa-server"'
    }
  ]
};

// ../../packages/template/projects/php.ts
var PHP = {
  name: "PHP",
  description: "Simple PHP project template",
  notes: "PHP must be installed in your system.",
  templating: [
    {
      action: "file",
      file: "index.php",
      filecontent: '<?php\n\necho "Hello World! Monorepo Time!";\n'
    },
    {
      action: "command",
      command: 'npm pkg set scripts.dev="php -S localhost:3000"'
    },
    {
      action: "command",
      command: 'npm pkg set scripts.start="php -S localhost:3000"'
    },
    {
      action: "command",
      command: 'npm pkg set scripts.stop="npx kill-port 3000"'
    },
    {
      action: "command",
      command: 'npm pkg set fontawesomeIcon="fa-solid fa-server"'
    }
  ]
};

// ../../packages/template/projects/laravel.ts
var Laravel = {
  name: "Laravel",
  description: "Laravel PHP Framework template",
  notes: "Composer and PHP must be installed in your system.",
  templating: [
    {
      action: "command",
      command: "rm -rf ./* ./.[!.]* 2>/dev/null || true"
    },
    {
      action: "command",
      command: "composer create-project laravel/laravel . --no-interaction --no-progress"
    },
    {
      action: "command",
      command: 'npm pkg set name="$(basename $PWD)"'
    },
    {
      action: "command",
      command: 'npm pkg set scripts.dev="php artisan serve"'
    },
    {
      action: "command",
      command: 'npm pkg set scripts.start="php artisan serve"'
    },
    {
      action: "command",
      command: 'npm pkg set scripts.stop="npx -y kill-port 8000"'
    },
    {
      action: "command",
      command: 'npm pkg set fontawesomeIcon="fa-brands fa-laravel"'
    }
  ]
};

// ../../packages/template/projects/python.ts
var pythonFile = `print("Monorepo Time Console!")
name = input("Please enter your name: ")
print("Hello " + name)
`;
var PythonConsole = {
  name: "Python Console",
  description: "Simple Python Console Application",
  notes: "Python 3 must be installed in your system.",
  templating: [
    {
      action: "file",
      file: "main.py",
      filecontent: pythonFile
    },
    {
      action: "command",
      command: 'npm pkg set scripts.dev="python3 main.py"'
    },
    {
      action: "command",
      command: 'npm pkg set scripts.start="python3 main.py"'
    },
    {
      action: "command",
      command: 'npm pkg set fontawesomeIcon="fa-solid fa-terminal"'
    }
  ]
};

// ../../packages/template/projects/dotnet.ts
var netFile = `// See https://aka.ms/new-console-template for more information
Console.WriteLine("Monorepo Time Console!");
Console.Write("Please enter your name: ");
string? name = Console.ReadLine();
Console.WriteLine("Hello " + name);
`;
var DotNetConsole = {
  name: ".NET Console",
  description: "Simple .NET Console Application",
  notes: ".NET SDK must be installed in your system.",
  templating: [
    {
      action: "command",
      command: "dotnet new console"
    },
    {
      action: "file",
      file: "Program.cs",
      filecontent: netFile
    },
    {
      action: "command",
      command: 'npm pkg set scripts.dev="dotnet run"'
    },
    {
      action: "command",
      command: 'npm pkg set scripts.start="dotnet run"'
    },
    {
      action: "command",
      command: 'npm pkg set fontawesomeIcon="fa-solid fa-terminal"'
    }
  ]
};

// ../../packages/template/projecttemplate.ts
var templates3 = [
  ViteReact,
  NextJS,
  ExpressTS,
  PHP,
  Laravel,
  PythonConsole,
  DotNetConsole
];
var projecttemplate_default = templates3;

// ../../packages/template/services_list/n8n.ts
var N8NLocal = {
  name: "N8N Local",
  description: "N8N (Local)",
  notes: "Requires Node.js installed in your system.",
  templating: [
    {
      action: "command",
      command: "npm install n8n"
    },
    {
      action: "command",
      command: 'npm pkg set scripts.dev="npx n8n"'
    },
    {
      action: "command",
      command: 'npm pkg set scripts.start="npx n8n"'
    },
    {
      action: "command",
      command: 'npm pkg set scripts.stop="npx kill-port 5678"'
    },
    {
      action: "command",
      command: 'npm pkg set fontawesomeIcon="fa-solid fa-robot"'
    },
    {
      action: "command",
      command: 'npm pkg set name="$(basename $PWD)"'
    }
  ]
};

// ../../packages/template/services_list/aws/deploy.ts
var deployJs = `const path = require("path");
const { spawn } = require("child_process");

/* ======================================================
   CONFIG \u2014 YOU EDIT ONLY THIS
====================================================== */

const aws = {
  provider: "localstack",        // "localstack" | "aws"
  region: "us-east-1",
  accessKey: "test",
  secretKey: "test",
  endpoint: "http://localhost:4566"
};

const services = [
  {
    name: "foodmaker",
    type: "frontend",
    dir: "examples/frontend" 
  },
  {
    name: "nodeserver",
    type: "backend",
    dir: "examples/nodeserver",
    runtime: "nodejs18.x",
    handler: "index.handler",
    apiPath: "/api/{proxy+}"
  }
];

const dynamoTables = [
  { name: "Users", hashKey: "id" },
  { name: "Orders", hashKey: "orderId" }
];

/* ======================================================
   INTERNAL SETUP
====================================================== */

const colors = {
  reset: "\\x1b[0m",
  green: "\\x1b[32m",
  yellow: "\\x1b[33m",
  cyan: "\\x1b[36m",
  orange: "\\x1b[38;5;208m",
  red: "\\x1b[31m"
};

const ENDPOINT =
  aws.provider === "localstack" ? \`--endpoint-url=\${aws.endpoint}\` : "";

process.env.AWS_ACCESS_KEY_ID = aws.accessKey;
process.env.AWS_SECRET_ACCESS_KEY = aws.secretKey;
process.env.AWS_DEFAULT_REGION = aws.region;

module.exports = {
  runDeploy: async (req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked"
    });

    const log = (msg, c = colors.reset) =>
      res.write(\`\${c}\${msg}\${colors.reset}\\n\`);

    const run = (cmd, args, cwd) =>
      new Promise((resolve, reject) => {
        const p = spawn(cmd, args, { cwd, shell: true });
        let out = "";
        p.stdout.on("data", d => { out += d; res.write(d); });
        p.stderr.on("data", d => res.write(colors.yellow + d + colors.reset));
        p.on("close", c => c === 0 ? resolve(out) : reject(new Error(cmd + " failed")));
      });

    try {
      log("\\n\u{1F680} Deploying Polyglot Cloud", colors.orange);

      /* IAM */
      await run("aws", [ENDPOINT, "iam", "create-role", "--role-name", "lambda-role",
        "--assume-role-policy-document",
        \`'{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}'\`
      ]).catch(()=>{});

      /* DynamoDB */
      for (const t of dynamoTables) {
        await run("aws", [ENDPOINT, "dynamodb", "create-table",
          "--table-name", t.name,
          "--attribute-definitions", \`AttributeName=\${t.hashKey},AttributeType=S\`,
          "--key-schema", \`AttributeName=\${t.hashKey},KeyType=HASH\`,
          "--billing-mode", "PAY_PER_REQUEST"
        ]).catch(()=>{});
      }

      /* Services */
      for (const svc of services) {

        /* Frontend */
        if (svc.type === "frontend") {
          const bucket = \`\${svc.name}-frontend\`;
          await run("aws", [ENDPOINT, "s3", "mb", \`s3://\${bucket}\`]).catch(()=>{});
          // Ensure dir exists or just skip if missing to prevent error in demo
          try {
             await run("aws", [ENDPOINT, "s3", "sync", path.resolve(__dirname, svc.dir), \`s3://\${bucket}\`, "--acl", "public-read"]);
             svc.url = \`http://localhost:4566/\${bucket}/index.html\`;
          } catch (e) { log("Skipping upload: " + e.message); }
        }

        /* Backend (ZIP) */
        if (svc.type === "backend" && svc.runtime !== "docker") {
          const zip = \`/tmp/\${svc.name}.zip\`;
          const bucket = \`\${svc.name}-code\`;

          // Simple zip of the dir
          await run("zip", ["-r", zip, ".", "-x", "*/.git/*"], path.resolve(__dirname, svc.dir)).catch(e => log("Zip failed (is zip installed?): " + e.message));
          
          await run("aws", [ENDPOINT, "s3", "mb", \`s3://\${bucket}\`]).catch(()=>{});
          await run("aws", [ENDPOINT, "s3", "cp", zip, \`s3://\${bucket}/code.zip\`]);

          await run("aws", [ENDPOINT, "lambda", "delete-function", "--function-name", svc.name]).catch(()=>{});
          await run("aws", [ENDPOINT, "lambda", "create-function",
            "--function-name", svc.name,
            "--runtime", svc.runtime,
            "--handler", svc.handler,
            "--code", \`S3Bucket=\${bucket},S3Key=code.zip\`,
            "--role", "arn:aws:iam::000000000000:role/lambda-role"
          ]);
        }
        
        // ... (Skipped other types for brevity in template, can be added if needed based on original request)

        /* API Gateway */
        if (svc.type === "backend") {
          const api = await run("aws", [ENDPOINT, "apigatewayv2", "create-api", "--name", svc.name, "--protocol-type", "HTTP"]);
          const apiId = JSON.parse(api).ApiId;

          const integ = await run("aws", [ENDPOINT, "apigatewayv2", "create-integration",
            "--api-id", apiId,
            "--integration-type", "AWS_PROXY",
            "--integration-uri", \`arn:aws:lambda:us-east-1:000000000000:function:\${svc.name}\`,
            "--payload-format-version", "2.0"
          ]);

          const integId = JSON.parse(integ).IntegrationId;

          await run("aws", [ENDPOINT, "apigatewayv2", "create-route",
            "--api-id", apiId,
            "--route-key", \`ANY \${svc.apiPath}\`,
            "--target", \`integrations/\${integId}\`
          ]);

          await run("aws", [ENDPOINT, "apigatewayv2", "create-stage",
            "--api-id", apiId,
            "--stage-name", "prod",
            "--auto-deploy"
          ]);

          svc.url = \`http://localhost:4566/restapis/\${apiId}/prod/_user_request_\`;
        }
      }

      log("\\n\u{1F30D} URLs", colors.orange);
      services.forEach(s => log(\`\u2022 \${s.name}: \${s.url}\`, colors.cyan));
      
      log("\\nAdditional Tools:", colors.cyan);
      log("\u2022 DynamoDB Admin: http://localhost:8001", colors.cyan);
      log("\u2022 S3 Managed: http://localhost:8002", colors.cyan);

      log("\\n\u2705 Cloud Ready", colors.green);
    } catch (e) {
      log("\\n\u274C " + e.message, colors.red);
    }

    res.end();
  }
};`;

// ../../packages/template/services_list/aws/dockerCompose.ts
var dockerCompose = `services:
  localstack:
    image: localstack/localstack
    ports:
      - "127.0.0.1:4566:4566"            # LocalStack Gateway
      - "127.0.0.1:4510-4559:4510-4559"  # External services port range
    environment:
      - DEBUG=\${DEBUG-}
      - SERVICES=s3,lambda,dynamodb,apigateway,sqs,sns,logs,cloudwatch
      - DOCKER_HOST=unix:///var/run/docker.sock
      - AWS_DEFAULT_REGION=us-east-1
    volumes:
      - localstack-data:/var/lib/localstack
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - cloud-net

  dynamodb-admin:
    image: aaronshaf/dynamodb-admin
    ports:
      - "8001:8001"
    environment:
      - DYNAMO_ENDPOINT=http://localstack:4566
      - AWS_REGION=us-east-1
      - AWS_ACCESS_KEY_ID=test
      - AWS_SECRET_ACCESS_KEY=test
    depends_on:
      - localstack
    networks:
      - cloud-net

  s3-manager:
    image: cloudlena/s3manager
    ports:
      - "8002:8080"
    environment:
      - ACCESS_KEY_ID=test
      - SECRET_ACCESS_KEY=test
      - REGION=us-east-1
      - ENDPOINT=localstack:4566
      - USE_SSL=false
    depends_on:
      - localstack
    networks:
      - cloud-net

volumes:
  localstack-data: {}

networks:
  cloud-net:
    driver: bridge`;

// ../../packages/template/services_list/aws/indexHtml.ts
var indexHtml = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AWS Local Manager</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        dark: {
                            900: '#1a1a1a',
                            800: '#2d2d2d',
                            700: '#404040',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        .ansi-green { color: #4ade80; }
        .ansi-yellow { color: #facc15; }
        .ansi-red { color: #f87171; }
        .ansi-cyan { color: #22d3ee; }
        .ansi-orange { color: #fb923c; }
    </style>
</head>
<body class="bg-dark-900 text-white h-screen flex flex-col font-sans">
    <div class="container mx-auto p-8 flex-1 flex flex-col">
        <header class="mb-8">
            <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">AWS Local Manager</h1>
            <p class="text-gray-400 mt-2">Manage your LocalStack environment and deployments</p>
        </header>

        <!-- Tabs -->
        <div class="flex border-b border-dark-700 mb-6">
            <button onclick="switchTab('deploy')" id="tab-deploy" class="tab-btn px-6 py-3 text-blue-400 border-b-2 border-blue-400 font-medium">Deploy</button>
            <button onclick="switchTab('upload')" id="tab-upload" class="tab-btn px-6 py-3 text-gray-400 hover:text-white font-medium">Upload Example</button>
            <button onclick="switchTab('node')" id="tab-node" class="tab-btn px-6 py-3 text-gray-400 hover:text-white font-medium">Node App App</button>
        </div>

        <!-- Tab Content: Deploy -->
        <div id="content-deploy" class="tab-content flex-1 flex flex-col gap-6">
            <div class="grid grid-cols-2 gap-6">
                <div class="bg-dark-800 p-6 rounded-lg border border-dark-700">
                    <h2 class="text-xl font-semibold mb-4">Credentials</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm text-gray-400 mb-1">Access Key ID</label>
                            <input type="text" value="test" class="w-full bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" readonly>
                        </div>
                        <div>
                            <label class="block text-sm text-gray-400 mb-1">Secret Access Key</label>
                            <input type="password" value="test" class="w-full bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" readonly>
                        </div>
                         <div>
                            <label class="block text-sm text-gray-400 mb-1">Region</label>
                            <input type="text" value="us-east-1" class="w-full bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" readonly>
                        </div>
                    </div>
                </div>
                
                <div class="bg-dark-800 p-6 rounded-lg border border-dark-700 flex flex-col justify-center items-center">
                    <button onclick="startDeploy()" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        Deploy to LocalStack
                    </button>
                </div>
            </div>

            <div class="flex-1 bg-black rounded-lg border border-dark-700 p-4 font-mono text-sm overflow-auto" id="console-output">
                <div class="text-gray-500">// Console output will appear here...</div>
            </div>
        </div>

        <!-- Tab Content: Upload -->
        <div id="content-upload" class="hidden tab-content">
            <div class="bg-dark-800 p-6 rounded-lg border border-dark-700">
                <h2 class="text-xl font-semibold mb-4">Upload to S3 Example</h2>
                <p class="text-gray-400 mb-4">Code example for uploading files to LocalStack S3.</p>
                <div class="bg-black p-4 rounded overflow-x-auto text-green-400 font-mono text-sm">
const AWS = require('aws-sdk');
const fs = require('fs');

const s3 = new AWS.S3({
    endpoint: 'http://localhost:4566',
    s3ForcePathStyle: true,
    region: 'us-east-1',
    accessKeyId: 'test',
    secretAccessKey: 'test'
});

const uploadFile = (fileName) => {
    const fileContent = fs.readFileSync(fileName);
    const params = {
        Bucket: 'my-bucket',
        Key: fileName,
        Body: fileContent
    };

    s3.upload(params, function(err, data) {
        if (err) { throw err; }
        console.log(\`File uploaded successfully. \${data.Location}\`);
    });
};
                </div>
            </div>
        </div>

        <!-- Tab Content: Node App -->
        <div id="content-node" class="hidden tab-content">
            <div class="bg-dark-800 p-6 rounded-lg border border-dark-700">
                <h2 class="text-xl font-semibold mb-4">Node.js AWS App Example</h2>
                <div class="bg-black p-4 rounded overflow-x-auto text-blue-400 font-mono text-sm">
const AWS = require('aws-sdk');

AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:4566"
});

const dynamodb = new AWS.DynamoDB();

const params = {
    TableName : "Movies",
    KeySchema: [       
        { AttributeName: "year", KeyType: "HASH"},  //Partition key
        { AttributeName: "title", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "year", AttributeType: "N" },
        { AttributeName: "title", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
                </div>
            </div>
        </div>
    </div>

    <script>
        function switchTab(tab) {
            // Hide all content
            document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
            // Remove active style from buttons
            document.querySelectorAll('.tab-btn').forEach(el => {
                el.classList.remove('text-blue-400', 'border-b-2', 'border-blue-400');
                el.classList.add('text-gray-400');
            });

            // Show selected content
            document.getElementById('content-' + tab).classList.remove('hidden');
            // Add active style to button
            const btn = document.getElementById('tab-' + tab);
            btn.classList.remove('text-gray-400');
            btn.classList.add('text-blue-400', 'border-b-2', 'border-blue-400');
        }

        async function startDeploy() {
            const consoleEl = document.getElementById('console-output');
            consoleEl.innerHTML = ''; // Clear previous output
            
            try {
                const response = await fetch('/deploy');
                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    
                    const text = decoder.decode(value);
                    // Simple color replacement for ANSI codes roughly matched to style logic
                    // In a real app we'd use a proper ANSI parser library
                    const formatted = text
                        .replace(/\\x1b\\[32m/g, '<span class="ansi-green">')
                        .replace(/\\x1b\\[33m/g, '<span class="ansi-yellow">')
                        .replace(/\\x1b\\[31m/g, '<span class="ansi-red">')
                        .replace(/\\x1b\\[36m/g, '<span class="ansi-cyan">')
                        .replace(/\\x1b\\[38;5;208m/g, '<span class="ansi-orange">')
                        .replace(/\\x1b\\[0m/g, '</span>');

                    consoleEl.innerHTML += formatted;
                    consoleEl.scrollTop = consoleEl.scrollHeight;
                }
            } catch (error) {
                consoleEl.innerHTML += \`<span class="ansi-red">Error connecting to deploy server: \${error.message}</span>\`;
            }
        }
    </script>
</body>
</html>`;

// ../../packages/template/services_list/aws/server.ts
var serverJs = `const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const deploy = require('./deploy');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');
let currentPort = 3748;

console.log("Starting AWS Local environment...");

// Spawn Docker Compose
const docker = spawn('docker', ['compose', 'up', '-d'], { stdio: 'inherit' });

docker.on('close', (code) => {
    if (code !== 0) {
        console.error('Failed to start Docker containers');
        process.exit(code);
    }
    // Give containers a moment to initialize
    setTimeout(displayCredentials, 3000);
});

function displayCredentials() {
    // Get container IDs for runtime file
    exec('docker compose ps -q', (err, stdout) => {
        let containerIds = [];
        if (stdout) {
            containerIds = stdout.trim().split('\\n').filter(id => id);
        }

        // Write runtime file
        try {
            fs.writeFileSync(RUNTIME_FILE, JSON.stringify({
                port: server.address().port,
                pid: process.pid,
                containerIds: containerIds
            }));
        } catch(e) {}

        console.log('\\n==================================================');
        console.log('\u{1F680} AWS LocalStack is running!');
        console.log('--------------------------------------------------');
        console.log('\u{1F4CC} AWS Credentials:');
        console.log('   Access Key ID:     test');
        console.log('   Secret Access Key: test');
        console.log('   Region:            us-east-1');
        console.log('--------------------------------------------------');
        console.log('\u{1F310} Service URLs:');
        console.log('   LocalStack:        http://localhost:4566');
        console.log('   DynamoDB Admin:    http://localhost:8001');
        console.log('   S3 Manager:        http://localhost:8002');
        console.log(\`   Manager UI:        http://localhost:\${server.address().port}\`);
        console.log('--------------------------------------------------');
        console.log('\u{1F4E6} Available Services:');
        console.log('   S3, Lambda, DynamoDB, API Gateway, SQS, SNS, CloudWatch');
        console.log('==================================================\\n');
    });
}

const requestListener = function (req, res) {
    if (req.url === "/") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync(path.join(__dirname, 'index.html')));
    } else if (req.url === "/deploy") {
        deploy.runDeploy(req, res);
    } else if (req.url === "/stop") {
        res.writeHead(200);
        res.end('Stopping...');
        cleanup();
    } else {
        res.writeHead(404);
        res.end("Not found");
    }
}

const server = http.createServer(requestListener);

function startServer(port) {
    server.listen(port);
}

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(\`Port \${currentPort} is in use, trying \${currentPort + 1}...\`);
        currentPort++;
        startServer(currentPort);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});

server.on('listening', () => {
    console.log(\`AWS Local Manager running at http://localhost:\${server.address().port}\`);
});

startServer(currentPort);

const cleanup = () => {
    console.log("Stopping AWS Local environment...");
    try {
        const runtime = JSON.parse(fs.readFileSync(RUNTIME_FILE));
        if (runtime.containerIds) {
            console.log(\`Stopping \${runtime.containerIds.length} containers...\`);
            runtime.containerIds.forEach(id => {
                exec(\`docker stop \${id}\`);
            });
        }
    } catch(e) {}
    try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
    
    spawn('docker', ['compose', 'down'], { stdio: 'inherit' });
    setTimeout(() => process.exit(0), 2000);
};

// Handle cleanup
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`;

// ../../packages/template/services_list/aws/stop.ts
var stopJs = `const { spawn } = require('child_process');
console.log("Stopping AWS Local environment...");
spawn('docker', ['compose', 'down'], { stdio: 'inherit' });`;

// ../../packages/template/services_list/aws.ts
var AWSTemplate = {
  name: "AWS Local",
  description: "AWS LocalStack Environment with Manager",
  notes: "Requires Docker, Node.js, and AWS CLI installed.",
  templating: [
    {
      action: "file",
      file: "docker-compose.yml",
      filecontent: dockerCompose
    },
    {
      action: "file",
      file: "deploy.js",
      filecontent: deployJs
    },
    {
      action: "file",
      file: "server.js",
      filecontent: serverJs
    },
    {
      action: "file",
      file: "stop.js",
      filecontent: stopJs
    },
    {
      action: "file",
      file: "index.html",
      filecontent: indexHtml
    },
    {
      action: "command",
      command: "mkdir -p examples/frontend examples/nodeserver"
    },
    {
      action: "file",
      file: "examples/frontend/index.html",
      filecontent: "<html><body><h1>Hello from S3!</h1></body></html>"
    },
    {
      action: "file",
      file: "examples/nodeserver/index.js",
      filecontent: 'exports.handler = async (event) => { return { statusCode: 200, body: JSON.stringify("Hello from Lambda!") }; };'
    },
    {
      action: "command",
      command: 'npm pkg set scripts.dev="node server.js"'
    },
    {
      action: "command",
      command: 'npm pkg set scripts.stop="node stop.js"'
    },
    {
      action: "command",
      command: 'npm pkg set fontawesomeIcon="fa-solid fa-cloud"'
    },
    {
      action: "command",
      command: 'npm pkg set name="$(basename $PWD)"'
    }
  ]
};

// ../../packages/template/services_list/stripe.ts
var dockerCompose2 = `services:
  stripe-mock:
    image: stripe/stripe-mock:latest
    container_name: stripe-mock
    ports:
      - "12111:12111"
      - "12112:12112"
    healthcheck:
      test: ["CMD", "/usr/bin/curl", "-f", "http://localhost:12111/"]
      interval: 5s
      timeout: 5s
      retries: 5
`;
var serverJs2 = `const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');

console.log('Starting Stripe Mock Server...');

// Spawn Docker Compose
const docker = spawn('docker', ['compose', 'up', '-d'], { stdio: 'inherit' });

docker.on('close', (code) => {
    if (code !== 0) {
        console.error('Failed to start Docker containers');
        process.exit(code);
    }
    // Give container a moment to initialize
    setTimeout(displayCredentials, 3000);
});

function displayCredentials() {
    // Get container ID for runtime file
    exec('docker compose ps -q stripe-mock', (err, stdout) => {
        let containerIds = [];
        if (stdout) {
            containerIds = [stdout.trim()];
        }

        // Write runtime file
        try {
            fs.writeFileSync(RUNTIME_FILE, JSON.stringify({
                port: server.address().port,
                pid: process.pid,
                containerIds: containerIds
            }));
        } catch(e) {}

        console.log('\\n==================================================');
        console.log('\u{1F4B3} Stripe Mock Server is running!');
        console.log('--------------------------------------------------');
        console.log('\u{1F4CC} Connection Details:');
        console.log('   API Key:           sk_test_mock_123 (any key works)');
        console.log('   HTTP Endpoint:     http://localhost:12111');
        console.log('   HTTPS Endpoint:    https://localhost:12112');
        console.log('--------------------------------------------------');
        console.log('\u{1F4DD} Quick Start (Node.js):');
        console.log("   const stripe = new Stripe('sk_test_mock_123', {");
        console.log("       host: 'localhost',");
        console.log("       port: 12111,");
        console.log("       protocol: 'http'");
        console.log('   });');
        console.log('--------------------------------------------------');
        console.log('\u{1F9EA} Test Command:');
        console.log('   npm run test');
        console.log('==================================================\\n');
    });
}

const requestListener = function (req, res) {
    if (req.url === '/stop') {
        res.writeHead(200);
        res.end('Stopping...');
        cleanup();
    } else {
        res.writeHead(200);
        res.end('Stripe Mock running. Use /stop to stop.');
    }
}

const server = http.createServer(requestListener);
server.listen(0, () => {
    console.log('Control server running on port', server.address().port);
});

const cleanup = () => {
    console.log('Stopping Stripe Mock Server...');
    try {
        const runtime = JSON.parse(fs.readFileSync(RUNTIME_FILE));
        if (runtime.containerIds) {
            console.log(\\\`Stopping \\\${runtime.containerIds.length} containers...\\\`);
            runtime.containerIds.forEach(id => {
                exec(\\\`docker stop \\\${id}\\\`);
            });
        }
    } catch(e) {}
    try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
    
    spawn('docker', ['compose', 'down'], { stdio: 'inherit' });
    setTimeout(() => process.exit(0), 2000);
};

// Handle cleanup
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`;
var testJs = `const Stripe = require('stripe');

// Initialize with a fake key and point to the mock server
// The mock server accepts any API key
const stripe = new Stripe('sk_test_mock_123', {
  host: 'localhost',
  port: 12111,
  protocol: 'http',
});

(async () => {
    console.log('Connecting to Local Stripe Mock at http://localhost:12111...');

    try {
        // 1. Create a Customer
        console.log('\\n1. Creating a mock customer...');
        const customer = await stripe.customers.create({
            email: 'jane.doe@example.com',
            name: 'Jane Doe',
            description: 'My First Mock Customer'
        });
        console.log('\u2705 Customer created:', customer.id);
        console.log('   Email:', customer.email);

        // 2. Create a Product
        console.log('\\n2. Creating a mock product...');
        const product = await stripe.products.create({
            name: 'Gold Special',
            description: 'One-time gold plan',
        });
        console.log('\u2705 Product created:', product.id);

        // 3. Create a Price
        console.log('\\n3. Creating a price for the product...');
        const price = await stripe.prices.create({
            unit_amount: 2000,
            currency: 'usd',
            product: product.id,
        });
        console.log('\u2705 Price created:', price.id);

        // 4. Create a Payment Intent
        console.log('\\n4. Creating a payment intent...');
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 2000,
            currency: 'usd',
            payment_method_types: ['card'],
            customer: customer.id,
        });
        console.log('\u2705 Payment Intent created:', paymentIntent.id);
        console.log('   Status:', paymentIntent.status); // likely 'requires_payment_method' in mock

        console.log('\\n\u{1F389} Success! You are successfully talking to the local Stripe Mock.');
        console.log('For more examples, try running other Stripe API commands.');

    } catch (err) {
        console.error('\u274C Error interacting with Stripe Mock:', err.message);
        console.error('Make sure the docker container is running with: npm run start');
    }
})();
`;
var StripeTemplate = {
  name: "Stripe Mock",
  description: "Stripe API Mock Server",
  notes: "Runs the official stripe-mock image. Requires Docker.",
  templating: [
    {
      action: "file",
      file: "docker-compose.yml",
      filecontent: dockerCompose2
    },
    {
      action: "file",
      file: "server.js",
      filecontent: serverJs2
    },
    {
      action: "file",
      file: "test.js",
      filecontent: testJs
    },
    {
      action: "command",
      command: "npm install stripe"
    },
    {
      action: "command",
      command: 'npm pkg set scripts.dev="node server.js"'
    },
    {
      action: "command",
      command: 'npm pkg set scripts.start="node server.js"'
    },
    {
      action: "command",
      command: 'npm pkg set scripts.test="node test.js"'
    },
    {
      action: "command",
      command: `npm pkg set scripts.stop="node -e 'const fs=require(\\"fs\\"); try{const p=JSON.parse(fs.readFileSync(\\".runtime.json\\")).port; fetch(\\"http://localhost:\\"+p+\\"/stop\\").catch(e=>{})}catch(e){}'"`
    },
    {
      action: "command",
      command: 'npm pkg set fontawesomeIcon="fa-solid fa-credit-card"'
    },
    {
      action: "command",
      command: 'npm pkg set name="$(basename $PWD)"'
    }
  ]
};

// ../../packages/template/services.ts
var templates4 = [
  N8NLocal,
  AWSTemplate,
  StripeTemplate
];
var services_default = templates4;

// ../../packages/template/index.ts
var MonorepoTemplates = {
  project: projecttemplate_default,
  database: database_default,
  services: services_default,
  demo: demo_default
};
var template_default = MonorepoTemplates;

// src/routes/availabletemplates.ts
var router18 = import_express21.default.Router();
router18.get("/", (req, res) => {
  try {
    const stripTemplating = (templates5) => {
      return templates5.map(({ templating, ...rest }) => rest);
    };
    const availableTemplates = {
      project: stripTemplating(template_default.project),
      database: stripTemplating(template_default.database),
      services: stripTemplating(template_default.services),
      demo: stripTemplating(template_default.demo)
    };
    res.json(availableTemplates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});
var availabletemplates_default = router18;

// src/routes/setworkspacetemplate.ts
var import_express22 = __toESM(require("express"));
var import_fs3 = require("fs");
var import_path14 = __toESM(require("path"));
var import_execa = require("execa");
var router19 = import_express22.default.Router();
async function ensureDirectory(dirPath) {
  try {
    await import_fs3.promises.mkdir(dirPath, { recursive: true });
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }
}
async function writeFile(filePath, content) {
  const dirName = import_path14.default.dirname(filePath);
  await ensureDirectory(dirName);
  await import_fs3.promises.writeFile(filePath, content, { encoding: "utf8" });
}
var isWindows = process.platform === "win32";
function preprocessCommand(command, cwd) {
  let processedCommand = command;
  if (processedCommand.includes("$(basename $PWD)")) {
    const dirName = import_path14.default.basename(cwd);
    processedCommand = processedCommand.replace(/\$\(basename \$PWD\)/g, dirName);
  }
  if (processedCommand.match(/rm\s+-rf\s+\.\/\*\s+\.\/\.\[!\.\]\*.*$/)) {
    if (isWindows) {
      processedCommand = 'powershell -Command "Get-ChildItem -Force | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue"';
    } else {
      processedCommand = "rm -rf ./* ./.[!.]* 2>/dev/null || true";
    }
  }
  if (isWindows && processedCommand.includes("python3")) {
    processedCommand = processedCommand.replace(/\bpython3\b/g, "python");
  }
  return processedCommand;
}
async function runCommand2(command, cwd) {
  try {
    const result = await (0, import_execa.execa)(command, {
      cwd,
      shell: true,
      // Detach from parent's stdio to avoid IDE terminal conflicts
      stdin: "ignore",
      // Set non-interactive environment
      env: {
        ...process.env,
        CI: "true",
        npm_config_yes: "true",
        FORCE_COLOR: "0",
        DEBIAN_FRONTEND: "noninteractive"
      },
      // Don't throw on non-zero exit (we handle it ourselves)
      reject: true,
      // Kill the whole process tree on abort
      killSignal: "SIGTERM",
      // Timeout after 5 minutes (for npm install which can be slow)
      timeout: 3e5
    });
    return { stdout: result.stdout || "", stderr: result.stderr || "" };
  } catch (error) {
    const execaError = error;
    throw new Error(
      `Command failed: ${command}
Exit code: ${execaError.exitCode}
stderr: ${execaError.stderr || "N/A"}
stdout: ${execaError.stdout || "N/A"}`
    );
  }
}
function findTemplate(templatename) {
  const categories = ["project", "database", "services", "demo"];
  for (const cat of categories) {
    const list = template_default[cat];
    if (Array.isArray(list)) {
      const match = list.find((t) => t.name === templatename);
      if (match) {
        return match;
      }
    }
  }
  return null;
}
async function executeTemplate(template, workspacePath, onProgress) {
  if (!template) {
    throw new Error("Template not found");
  }
  const progress = onProgress || ((msg) => console.log(`[Template] ${msg}`));
  for (const step of template.templating) {
    if (step.action === "command" && step.command) {
      const processedCommand = preprocessCommand(step.command, workspacePath);
      progress(`Running: ${processedCommand}`);
      try {
        const result = await runCommand2(processedCommand, workspacePath);
        if (result.stdout.trim()) {
          const truncated = result.stdout.trim().slice(0, 200);
          progress(`Output: ${truncated}${result.stdout.length > 200 ? "..." : ""}`);
        }
      } catch (cmdErr) {
        console.error(`Command failed: ${step.command}`, cmdErr);
        throw new Error(`Command failed: ${step.command}
${cmdErr.message}`);
      }
    } else if (step.action === "file" && step.file && step.filecontent !== void 0) {
      progress(`Creating file: ${step.file}`);
      const filePath = import_path14.default.join(workspacePath, step.file);
      await writeFile(filePath, step.filecontent);
    }
  }
}
router19.post("/", async (req, res) => {
  try {
    const { workspace, templatename } = req.body;
    if (!workspace || !workspace.path || !templatename) {
      return res.status(400).json({ error: "Missing workspace info or template name" });
    }
    const workspacePath = workspace.path;
    console.log("workspacePath", workspacePath);
    console.log("templatename", templatename);
    const template = findTemplate(templatename);
    if (!template) {
      return res.status(404).json({ error: `Template '${templatename}' not found` });
    }
    console.log(`Applying template '${templatename}' to ${workspacePath}...`);
    await executeTemplate(template, workspacePath);
    res.json({ success: true, message: "Template applied successfully" });
  } catch (error) {
    console.error("Error setting workspace template:", error);
    res.status(500).json({ error: "Failed to apply template: " + error.message });
  }
});
var setworkspacetemplate_default = router19;
function setWorkspaceTemplateSocket(io2) {
  io2.on("connection", (socket) => {
    socket.on("template:start", async (data) => {
      const { workspace, templatename } = data;
      if (!workspace || !workspace.path || !templatename) {
        socket.emit("template:error", { error: "Missing workspace info or template name" });
        return;
      }
      const workspacePath = workspace.path;
      const template = findTemplate(templatename);
      if (!template) {
        socket.emit("template:error", { error: `Template '${templatename}' not found` });
        return;
      }
      socket.emit("template:progress", { message: `Starting template '${templatename}'...` });
      console.log(`[Socket] Applying template '${templatename}' to ${workspacePath}...`);
      try {
        await executeTemplate(template, workspacePath, (message) => {
          socket.emit("template:progress", { message });
          console.log(`[Socket] ${message}`);
        });
        socket.emit("template:success", { message: "Template applied successfully" });
        console.log(`[Socket] Template '${templatename}' applied successfully`);
      } catch (error) {
        console.error("[Socket] Error setting workspace template:", error);
        socket.emit("template:error", { error: "Failed to apply template: " + error.message });
      }
    });
  });
}

// src/routes/stopTerminalWorkspace.ts
var import_express23 = require("express");
var import_fs_extra12 = __toESM(require("fs-extra"));
var import_path15 = __toESM(require("path"));
var import_child_process8 = require("child_process");
var import_util2 = __toESM(require("util"));
var execAsync2 = import_util2.default.promisify(import_child_process8.exec);
var router20 = (0, import_express23.Router)();
router20.post("/", async (req, res) => {
  try {
    const { socketId, workspace } = req.body;
    if (workspace && workspace.name) {
      const workspacePath = workspace.path;
      if (!workspacePath) {
        console.error(`[StopTerminal] ERROR: No workspace path provided for ${workspace.name}. Docker cleanup may fail.`);
      }
      let socket = null;
      let activeSession = null;
      let activeSessionId = null;
      for (const [id, session] of activeTerminals.entries()) {
        if (session.workspaceName === workspace.name) {
          socket = session.socket;
          activeSession = session;
          activeSessionId = id;
          break;
        }
      }
      const log = (msg) => {
        if (activeSession && activeSession.socket && activeSession.socket.connected) {
          activeSession.socket.emit("terminal:log", `\r
\x1B[33m[System] ${msg}\x1B[0m\r
`);
        }
      };
      if (activeSession) {
        log("Stopping workspace resources...");
      }
      if (workspacePath && await import_fs_extra12.default.pathExists(import_path15.default.join(workspacePath, ".runtime.json"))) {
        try {
          if (activeSession) log("Checking/Stopping Docker container...");
          const runtimeConfig = await import_fs_extra12.default.readJSON(import_path15.default.join(workspacePath, ".runtime.json"));
          if (runtimeConfig && runtimeConfig.containerIds && Array.isArray(runtimeConfig.containerIds)) {
            console.log(`[StopTerminal] Stopping ${runtimeConfig.containerIds.length} containers...`);
            activeSession && log(`Stopping ${runtimeConfig.containerIds.length} Docker containers...`);
            for (const cid of runtimeConfig.containerIds) {
              try {
                console.log(`[StopTerminal] Stopping container ${cid}`);
                await execAsync2(`docker stop ${cid}`);
                console.log(`[StopTerminal] Container ${cid} stopped.`);
              } catch (e) {
                console.error(`[StopTerminal] Error stopping container ${cid}:`, e);
                activeSession && log(`Error stopping container ${cid}: ${e.message}`);
              }
            }
            activeSession && log("All Docker containers stopped.");
          } else if (runtimeConfig && runtimeConfig.containerId) {
            console.log(`[StopTerminal] Stopping container ${runtimeConfig.containerId}`);
            await execAsync2(`docker stop ${runtimeConfig.containerId}`);
            console.log(`[StopTerminal] Container stopped.`);
            if (activeSession) log("Docker container stopped.");
          } else {
            if (activeSession) log("No active container ID found in config.");
          }
        } catch (e) {
          console.error("[StopTerminal] Error stopping docker:", e);
          if (activeSession) log(`Error stopping Docker: ${e.message}`);
        }
      } else {
      }
      if (workspacePath) {
        try {
          if (activeSession) log("Running npm run stop...");
          await execAsync2("npm run stop", { cwd: workspacePath });
          if (activeSession) log("npm run stop executed.");
        } catch (e) {
          if (activeSession) log(`Error running npm run stop (might not exist): ${e.message}`);
        }
      }
      let stopped = false;
      if (activeSession && activeSessionId) {
        log("Closing terminal in 1 second...");
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        const currentProcess = activeSession.child;
        if (currentProcess && currentProcess.pid) {
          if (process.platform === "win32") {
            (0, import_child_process8.exec)(`taskkill /pid ${currentProcess.pid} /T /F`, (err) => {
            });
          } else {
            try {
              process.kill(-currentProcess.pid, "SIGKILL");
            } catch (e) {
              try {
                currentProcess.kill("SIGKILL");
              } catch (e2) {
              }
            }
          }
        }
        stopTerminalProcess(activeSessionId);
        stopped = true;
      }
      if (stopped) {
        res.json({ success: true, message: `Terminated process for workspace ${workspace.name}` });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
        res.json({ success: true, message: `Cleanup performed for workspace ${workspace.name} (no active terminal found)` });
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
  } catch (err) {
    console.error("[StopTerminal] Unexpected Error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});
var stopTerminalWorkspace_default = router20;

// src/index.ts
var app = (0, import_express24.default)();
var port2 = config_default.apiPort;
app.use((0, import_cors.default)({
  origin: true,
  credentials: true
}));
app.use(import_express24.default.static("public"));
app.use(import_express24.default.json());
app.use("/", tester_default);
app.use("/" + api_default.scanWorkspace, scanworkspace_default);
app.use("/" + api_default.stopProcess, stopcmd_default);
app.use("/" + api_default.listWorkspacesDir, listworkspacedirs_default);
app.use("/" + api_default.newWorkspace, newworkspace_default);
app.use("/" + api_default.interactvTerminal, interactiveTerminal_default);
app.use("/" + api_default.stopInteractiveTerminal, stopInteractiveTerminal_default);
app.use("/" + api_default.stopTerminalWorkspace, stopTerminalWorkspace_default);
app.use("/" + api_default.updateWorkspace, updateworkspace_default);
app.use("/" + api_default.hideShowFileFolder, vscodeHideShow_default);
app.use("/" + api_default.getRootPath, rootPath_default);
app.use("/" + api_default.scaffoldRepo, scafoldrepo_default);
app.use("/" + api_default.turborepoExist, turborepoexist_default);
app.use("/" + api_default.firstRun, firstrun_default);
app.use("/" + api_default.notes, notes_default);
app.use("/" + api_default.crudTest, crudtest_default);
app.use("/" + api_default.gitControl, gitControlHelper_default);
app.use("/" + api_default.initMonorepoTime, initmonorepotime_default);
app.use("/" + api_default.processTree, processUsage_default);
app.use("/" + api_default.docker, apidocker_default);
app.use("/" + api_default.availabletemplates, availabletemplates_default);
app.use("/" + api_default.setWorkspaceTemplate, setworkspacetemplate_default);
var frontendPath = import_path16.default.join(__dirname, "../public");
app.use(import_express24.default.static(frontendPath));
app.get("*", (req, res) => {
  res.sendFile(import_path16.default.join(frontendPath, "index.html"));
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
setWorkspaceTemplateSocket(io);
var findAvailablePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const server = import_net.default.createServer();
    server.unref();
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${startPort} is in use, trying ${startPort + 1}...`);
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
    server.listen(startPort, () => {
      server.close(() => {
        resolve(startPort);
      });
    });
  });
};
findAvailablePort(port2).then((availablePort) => {
  httpServer.listen(availablePort, () => {
    console.log(`Monorepo Time is running at http://localhost:${availablePort}`);
    if (process.env.NODE_ENV != "development") {
      (0, import_open.default)(`http://localhost:${availablePort}`);
    }
  });
}).catch((err) => {
  console.error("Failed to find an available port:", err);
  process.exit(1);
});
var index_default = app;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app,
  httpServer,
  io
});
