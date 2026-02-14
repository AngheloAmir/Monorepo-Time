import type { Express } from "express";
import path from 'path';
import apiRoute from 'apiroute';
import express from 'express';

import tester from './utils/_tester';
import apiScanWorkspace from './workspace/scanworkspace';

import stopProcess from './terminal/stopcmd';
import listWorkspacesDir from './workspace/listworkspacedirs';
import newWorkspace from './workspace/newworkspace';
import interactiveTerminal from './terminal/interactiveTerminal';
import stopInteractiveTerm from './terminal/stopInteractiveTerminal';
import updateWorkspace from './workspace/updateworkspace';
import vscodeHideShow from './utils/vscodeHideShow';
import rootPath from './utils/rootPath';
import scaffoldRepo from './utils/scafoldrepo';
import turborepoExist from './home/turborepoexist';
import firstRunRoute from './utils/firstrun';
import notesRoute from './home/notes';
import crudTestRoute from './crud/crudtest';
import gitControlHelper from './utils/gitControlHelper';
import initMonorepoTime from './utils/initmonorepotime';
import processTree from './home/processUsage';
import apiDocker from './home/apidocker';
import availableTemplates from './workspace/availabletemplates';
import setWorkspaceTemplate from './workspace/setworkspace';
import stopTerminalWorkspace from './terminal/stopTerminalWorkspace';
import deleteWorkspace from './workspace/deleteWorkspace';
import scanProject from './textEditor/projectBrowser';
import textEditor from './textEditor/textEditor';
import gitStashHelper from './utils/gitStashHelper';

import createInstance from './opencode/createInstance';
import listInstance from "./opencode/listInstance";
import opencode from "./opencode/opencode";
import createClient from "./opencode/createClient";
import listClients from "./opencode/listClients";
import opencodePrompt from "./opencode/prompt";
import sessionChats from "./opencode/sessionChats";

export default function SETROUTES(app: Express) {
    app.use("/", tester);

    app.use("/" + apiRoute.getRootPath,        rootPath);
    app.use("/" + apiRoute.scaffoldRepo,       scaffoldRepo);
    app.use("/" + apiRoute.turborepoExist,     turborepoExist);
    app.use("/" + apiRoute.firstRun,           firstRunRoute);
    app.use("/" + apiRoute.initMonorepoTime,   initMonorepoTime);

    //dashboard / home endpoints
    app.use("/" + apiRoute.notes,        notesRoute);
    app.use("/" + apiRoute.crudTest,     crudTestRoute);
    app.use("/" + apiRoute.processTree,  processTree);
    app.use("/" + apiRoute.docker,       apiDocker);

    //gits
    app.use("/" + apiRoute.gitControl, gitControlHelper);
    app.use("/" + apiRoute.gitStash,   gitStashHelper); 

    //terminal endpoints
    app.use("/" + apiRoute.interactvTerminal,        interactiveTerminal);
    app.use("/" + apiRoute.stopInteractiveTerminal,  stopInteractiveTerm);
    app.use("/" + apiRoute.stopTerminalWorkspace,    stopTerminalWorkspace);
    app.use("/" + apiRoute.stopProcess,              stopProcess);
    app.use("/" + apiRoute.updateWorkspace,          updateWorkspace);
    app.use("/" + apiRoute.hideShowFileFolder,       vscodeHideShow);

    //workspace endpoints
    app.use("/" + apiRoute.scanWorkspace,            apiScanWorkspace);
    app.use("/" + apiRoute.listWorkspacesDir,        listWorkspacesDir);
    app.use("/" + apiRoute.newWorkspace,             newWorkspace);
    app.use("/" + apiRoute.availabletemplates,       availableTemplates);
    app.use("/" + apiRoute.setWorkspaceTemplate,     setWorkspaceTemplate);
    app.use("/" + apiRoute.deleteWorkspace,          deleteWorkspace);

    //opencode
    app.use("/" + apiRoute.opencodeCreateInstance,   createInstance);
    app.use("/" + apiRoute.opencodeListInstances,    listInstance);
    app.use("/" + apiRoute.opencode,                 opencode);
    app.use("/" + apiRoute.opencodeCreateClient,     createClient);
    app.use("/" + apiRoute.opencodeListClients,      listClients);
    app.use("/" + apiRoute.opencodePrompt,           opencodePrompt);
    app.use("/" + apiRoute.opencodeSessionChat,      sessionChats);

    //project browser and editor endpoints
    app.use("/" + apiRoute.scanProject, scanProject);
    app.use("/" + apiRoute.textEditor, textEditor);


    // Serve frontend static files==================================================
    const frontendPath = path.join(__dirname, '../../public');
    app.use(express.static(frontendPath));
    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}