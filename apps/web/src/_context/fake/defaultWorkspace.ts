import type { WorkspaceItem } from "../workspace";

const workspace: WorkspaceItem[] = [
    {
        isRunningAs: null,
        info: {
            name: 'Demo workspace',
            path: '/workspace/1',
            description: 'Must run in your system',
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
        info: {
            name: 'Workspace 2',
            path: '/workspace/2',
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
]
export default workspace;