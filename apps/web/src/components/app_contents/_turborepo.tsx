import type { BorderColorVariant } from "../ui/_color";

interface CommandGroup {
    title: string;
    commands: Command[];
}

interface Command {
    label: string;
    cmd: string;
    icon: string;
    color: BorderColorVariant;
    description?: string;
}

const commandGroups: CommandGroup[] = [
    {
        title: 'Build & Run',
        commands: [
            { label: 'Install', cmd: 'npm install', icon: 'fa-download', color: 'blueIndigo' },
            { label: 'Build',   cmd: 'turbo build', icon: 'fa-hammer',   color: 'emeraldTeal' },
            { label: 'Force',   cmd: 'turbo run build --force', icon: 'fa-sync-alt', color: 'yellowOrange' },
        ]
    },
    {
        title: 'Code Quality',
        commands: [
            { label: 'Lint', cmd: 'turbo lint', icon: 'fa-check-double', color: 'cyanBlue' },
            { label: 'Test', cmd: 'turbo test', icon: 'fa-vial', color: 'emeraldTeal' },
        ]
    },
    {
        title: 'Optimization',
        commands: [
            { label: 'Prune', cmd: 'turbo prune', icon: 'fa-scissors', color: 'orangePurple' },
            { label: 'Summary', cmd: 'turbo run build --dry-run', icon: 'fa-list-alt', color: 'blueIndigo'},
            { label: 'Generate', cmd: 'turbo gen', icon: 'fa-plus-circle', color: 'pinkRose' },
        ]
    },
    {
        title: 'Diagnostics',
        commands: [
            { label: 'Graph', cmd: 'turbo run build --graph', icon: 'fa-project-diagram', color: 'cyanBlue' },
            { label: 'Info', cmd: 'turbo info', icon: 'fa-info-circle', color: 'blueIndigo' },
            { label: 'Daemon', cmd: 'turbo daemon status', icon: 'fa-server', color: 'gray' },
        ]
    },
    {
        title: 'Remote Cache',
        commands: [
            { label: 'Link', cmd: 'npx turbo link', icon: 'fa-cloud', color: 'cyanBlue' },
            { label: 'Login', cmd: 'turbo login', icon: 'fa-sign-in-alt', color: 'emeraldTeal' },
            { label: 'Unlink', cmd: 'turbo unlink', icon: 'fa-unlink', color: 'red' },
        ]
    },
    {
        title: 'Maintenance',
        commands: [
            { label: 'Clean', cmd: 'turbo clean', icon: 'fa-broom', color: 'orangePurple' },
            { label: 'Cache', cmd: 'rm -rf node_modules/.cache/turbo .turbo', icon: 'fa-trash-alt', color: 'darkRed' },
        ]
    },
];

export default commandGroups;
