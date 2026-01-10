/**
 * @example
 * export interface ChildProcessInfo {
    name: string;
    pid: number;
    mem: number;
}
 */
export interface ChildProcessInfo {
    name: string;
    pid: number;
    mem: number;
}

/**
 * @example
 * export interface DockerProcessInfo {
    id: string;
    image: string;
    status: string;
    name: string;
    memoryStr: string;
    memoryBytes: number;
}
 */
export interface DockerProcessInfo {
    id: string;
    image: string;
    status: string;
    name: string;
    memoryStr: string;
    memoryBytes: number;
}

/**
 * @example
 * export interface WorkspaceInfo {
    name: string;
    path: string;

    //These are found inside of the package the json of the project
    fontawesomeIcon?: string;
    description?: string;
    localUrl?: string;
    
    devCommand?: string;
    startCommand?: string;
    stopCommand?: string;
    buildCommand?: string;
    cleanCommand?: string;
    lintCommand?: string;
    testCommand?: string;
}
 */
export interface WorkspaceInfo {
    name: string;
    path: string;

    //These are found inside of the package the json of the project
    fontawesomeIcon?: string;
    description?: string;
    
    devCommand?: string;
    startCommand?: string;
    stopCommand?: string;
    buildCommand?: string;
    cleanCommand?: string;
    lintCommand?: string;
    testCommand?: string;
}

