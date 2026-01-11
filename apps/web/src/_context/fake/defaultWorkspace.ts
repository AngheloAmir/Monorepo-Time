import type { WorkspaceItem } from "../workspace";

const workspace: WorkspaceItem[] = [
    {
        isRunningAs: 'dev',
        info: {
            name: 'Power JS',
            path: '/workspace/1',
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
    {
        isRunningAs: null,
        info: {
            name: 'Workspace 3',
            path: '/workspace/3',
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
        info: {
            name: 'Workspace 4 asd asd asd  asd',
            path: '/workspace/4',
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
        info: {
            name: 'AAA I am last',
            path: '/workspace/6',
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
        info: {
            name: 'Opps',
            path: '/workspace/6',
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
export default workspace;