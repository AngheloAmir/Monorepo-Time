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
    appType?:     string;
    description?: string;
    
    devCommand?: string;
    startCommand?: string;
    stopCommand?: string;
    buildCommand?: string;
    cleanCommand?: string;
    lintCommand?: string;
    testCommand?: string;
}

export interface CrudCategory {
    category: string,
    devurl: string,
    produrl: string,
    items: CrudItem[]
}

export interface CrudItem {
    label: string,
    route: string,
    methods: string,
    description: string,
    sampleInput: string,
    suggested: Array<{
        name: string,
        urlparams: string,
        content: string
    }>,
    expectedOutcome: string,
}

export const TemplateCategories = ['project', 'database', 'services', 'tool', 'demo'] as const;
export interface ProcessTemplate {
    action:   "command" | "file" | "root-command";
    cmd?:     string;
    args?:    string[];
    file?:    string;
    filecontent?: string;
}

export interface ProjectTemplate {
    name:        string;
    description: string;
    notes:       string;
    type:        "app" | "database" | "tool";
    templating:  ProcessTemplate[];
    icon:        string;
}