import type { WorkspaceItem } from "../workspace";

const workspace: WorkspaceItem[] = [
    {
        isRunningAs: 'dev',
        consoleOutput: `\n\n\x1b[1;33;40m 33;40  \x1b[1;33;41m 33;41  \x1b[1;33;42m 33;42  \x1b[1;33;43m 33;43  \x1b[1;33;44m 33;44  \x1b[1;33;45m 33;45  \x1b[1;33;46m 33;46  \x1b[1m\x1b[0\n\n\x1b[1;33;42m >> Tests OK\n\n`,
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
        consoleOutput: 'running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod . running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. unning me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod . running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod. running me \n\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod.',
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
        consoleOutput: null,
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
        consoleOutput: null,
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
        consoleOutput: null,
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
        consoleOutput: 'Running as dev\nLorem ipsum dolor sit amet \n consectetur adipisicing elit. Quisquam, quod.',
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