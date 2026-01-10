"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpServer = exports.io = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const apiroute_1 = __importDefault(require("apiroute"));
const config_1 = __importDefault(require("config"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
//routers
const scanworkspace_1 = __importDefault(require("./routes/scanworkspace"));
const runcmddev_1 = __importDefault(require("./routes/runcmddev"));
const stopcmd_1 = __importDefault(require("./routes/stopcmd"));
const listworkspacedirs_1 = __importDefault(require("./routes/listworkspacedirs"));
const newworkspace_1 = __importDefault(require("./routes/newworkspace"));
const interactiveTerminal_1 = __importStar(require("./routes/interactiveTerminal"));
const updateworkspace_1 = __importDefault(require("./routes/updateworkspace"));
const vscodeHideShow_1 = __importDefault(require("./routes/vscodeHideShow"));
const rootPath_1 = __importDefault(require("./routes/rootPath"));
const scafoldrepo_1 = __importDefault(require("./routes/scafoldrepo"));
const turborepoexist_1 = __importDefault(require("./routes/turborepoexist"));
const app = (0, express_1.default)();
exports.app = app;
const port = config_1.default.apiPort;
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use(express_1.default.static('public'));
app.use(express_1.default.json());
//routes=======================================================================
app.use("/" + apiroute_1.default.scanWorkspace, scanworkspace_1.default);
app.use("/" + apiroute_1.default.stopProcess, stopcmd_1.default);
app.use("/" + apiroute_1.default.listWorkspacesDir, listworkspacedirs_1.default);
app.use("/" + apiroute_1.default.newWorkspace, newworkspace_1.default);
app.use("/" + apiroute_1.default.interactvTerminal, interactiveTerminal_1.default);
app.use("/" + apiroute_1.default.updateWorkspace, updateworkspace_1.default);
app.use("/" + apiroute_1.default.hideShowFileFolder, vscodeHideShow_1.default);
app.use("/" + apiroute_1.default.getRootPath, rootPath_1.default);
app.use("/" + apiroute_1.default.scaffoldRepo, scafoldrepo_1.default);
app.use("/" + apiroute_1.default.turborepoExist, turborepoexist_1.default);
// Socket.IO Setup ============================================================
const httpServer = (0, http_1.createServer)(app);
exports.httpServer = httpServer;
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
    transports: ['websocket', 'polling']
});
exports.io = io;
(0, runcmddev_1.default)(io);
(0, interactiveTerminal_1.interactiveTerminalSocket)(io);
//=============================================================================
httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
exports.default = app;
