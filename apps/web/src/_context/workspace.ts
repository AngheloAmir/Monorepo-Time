import { create } from 'zustand';
import { createSelectors } from './zustandSelector';
import type { WorkspaceInfo } from 'types';

export interface WorkspaceItem {
    isRunningAs:    'dev' | 'start' | null;
    consoleOutput:  string | null;
    info:           WorkspaceInfo;  
}

interface workspaceContext {
    workspace: WorkspaceItem[];
    loadWorkspace: () => Promise<void>;
}

const workspaceState = create<workspaceContext>()((set) => ({
    workspace: [],

    loadWorkspace: async () => {
        //const workspace = await fetch('/api/workspace').then(res => res.json());
        //fake workspaces
        let workspace :WorkspaceItem[] = [
            {
                isRunningAs:   'dev',
                consoleOutput:  `\n\n\x1b[1;33;40m 33;40  \x1b[1;33;41m 33;41  \x1b[1;33;42m 33;42  \x1b[1;33;43m 33;43  \x1b[1;33;44m 33;44  \x1b[1;33;45m 33;45  \x1b[1;33;46m 33;46  \x1b[1m\x1b[0\n\n\x1b[1;33;42m >> Tests OK\n\n`,
                info: {
                    name: 'Power JS',
                    path: '/workspace/1',
                    serviceType: 'app',
                    localUrl: 'http://localhost:3000',
                    description: 'Description 1',
                    devCommand: 'npm run dev',
                    startCommand: 'npm run start',
                    stopCommand: 'npm run stop',
                    buildCommand: 'npm run build',
                    cleanCommand: 'npm run clean',
                    lintCommand: 'npm run lint',
                    testCommand: 'npm run test',
                    fontawesomeIcon: 'fa-brands fa-node-js',
                }
            },
            {
                isRunningAs: 'start',
                consoleOutput:  'running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod . running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. unning me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod . running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod.',
                info: {
                    name: 'Workspace 2',
                    path: '/workspace/2',
                    serviceType: 'app',
                    localUrl: 'http://localhost:3001',
                    description: 'Description 2',
                    devCommand: 'npm run dev',
                    startCommand: 'npm run start',
                    stopCommand: 'npm run stop',
                    buildCommand: 'npm run build',
                    cleanCommand: 'npm run clean',
                    lintCommand: 'npm run lint',
                    testCommand: 'npm run test',
                    fontawesomeIcon: 'fa-brands fa-node-js',
                }
            },
            {
                isRunningAs: null,
                consoleOutput: null,
                info: {
                    name: 'Workspace 3',
                    path: '/workspace/3',
                    serviceType: 'app',
                    localUrl: 'http://localhost:3002',
                    description: 'Description 3 asdsad asd asd asd asd asd asd asdas dasd as dasd asd asd asd asd',
                    devCommand: 'npm run dev',
                    startCommand: 'npm run start',
                    stopCommand: 'npm run stop',
                    buildCommand: 'npm run build',
                    cleanCommand: 'npm run clean',
                    lintCommand: 'npm run lint',
                    testCommand: 'npm run test',
                    fontawesomeIcon: 'fa-brands fa-node-js',
                }
            },
            {
                isRunningAs: null,
                consoleOutput: null,
                info: {
                    name: 'Workspace 4 asd asd asd  asd',
                    path: '/workspace/4',
                    serviceType: 'app',
                    localUrl: 'http://localhost:3003',
                    description: 'Description 4',
                    devCommand: 'npm run dev',
                    startCommand: 'npm run start',
                    stopCommand: 'npm run stop',
                    buildCommand: 'npm run build',
                    cleanCommand: 'npm run clean',
                    lintCommand: 'npm run lint',
                    testCommand: 'npm run test',
                    fontawesomeIcon: 'fa-brands fa-node-js',
                }
            },
            {
                isRunningAs: 'start',
                consoleOutput: null,
                info: {
                    name: 'AAA I am last',
                    path: '/workspace/6',
                    serviceType: 'app',
                    localUrl: 'http://localhost:3005',
                    description: 'Description 6',
                    devCommand: 'npm run dev',
                    startCommand: 'npm run start',
                    stopCommand: 'npm run stop',
                    buildCommand: 'npm run build',
                    cleanCommand: 'npm run clean',
                    lintCommand: 'npm run lint',
                    testCommand: 'npm run test',
                    fontawesomeIcon: 'fa-brands fa-node-js',
                }
            },
            {
                isRunningAs: 'dev',
                consoleOutput:  'Running as dev\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod.',
                info: {
                    name: 'Opps',
                    path: '/workspace/6',
                    serviceType: 'app',
                    localUrl: 'http://localhost:3005',
                    description: 'Description 6',
                    devCommand: 'npm run dev',
                    startCommand: 'npm run start',
                    stopCommand: 'npm run stop',
                    buildCommand: 'npm run build',
                    cleanCommand: 'npm run clean',
                    lintCommand: 'npm run lint',
                    testCommand: 'npm run test',
                    fontawesomeIcon: 'fa-brands fa-node-js',
                }
            },
        ]

        const runningStartWorkspace = workspace.filter((item) => item.isRunningAs === 'start');
        const runningDevWorkspace   = workspace.filter((item) => item.isRunningAs === 'dev');
        const runningStartWorkSpaceAlphabetical = runningStartWorkspace.sort((a, b) => {
            if (a.info.name < b.info.name) return -1;
            if (a.info.name > b.info.name) return 1;
            return 0;
        });
        const runningDevWorkSpaceAlphabetical   = runningDevWorkspace.sort((a, b) => {
            if (a.info.name < b.info.name) return -1;
            if (a.info.name > b.info.name) return 1;
            return 0;
        });
        
        const stoppedWorkspace = workspace.filter((item) => !item.isRunningAs);
        stoppedWorkspace.sort((a, b) => {
            if (a.info.name < b.info.name) return -1;
            if (a.info.name > b.info.name) return 1;
            return 0;
        });

        set({ workspace: [
            ...runningStartWorkSpaceAlphabetical,
            ...runningDevWorkSpaceAlphabetical,
            ...stoppedWorkspace
        ] });
    }
}));

const useWorkspaceState = createSelectors(workspaceState);
export default useWorkspaceState;
