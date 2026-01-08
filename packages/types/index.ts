export interface ChildProcessInfo {
    name: string;
    pid:  number;
    mem:  number;
}

export interface DockerProcessInfo {
    id: string;
    image: string;
    status: string;
    name: string;
    memoryStr: string;
    memoryBytes: number;
}

export interface WorkspaceInfo {
    name: string;
    path: string;

    //These are found inside of the package the json of the project
    serviceType:  'app' | 'frontend' | 'backend' | 'database' | 'service' | null;
    fontawesomeIcon: string | null;
    localUrl:     string | null;
    description:  string | null;
    devCommand:   string | null;
    startCommand: string | null;
    stopCommand:  string | null;
    buildCommand: string | null;
    cleanCommand: string | null;
    lintCommand:  string | null;
    testCommand:  string | null;
}

