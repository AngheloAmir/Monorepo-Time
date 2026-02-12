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

    workspace?:   string;
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
}
 */
export interface WorkspaceInfo {
    name: string;
    path: string;

    workspace?:   string;
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

export const TemplateCategories = [
    'project',
    'database',
    'services',
    'tool',
    'opensource',
    'demo'
] as const;

/**
 * @example
 * export interface ProcessTemplate {
    action:   "command" | "file" | "root-command";
    cmd?:     string;
    args?:    string[];
    file?:    string;
    filecontent?: string;
}
 */
export interface ProcessTemplate {
    action:   "command" | "file" | "root-command";
    cmd?:     string;
    args?:    string[];
    file?:    string;
    filecontent?: string;
}

/**
 * @example
export interface ProjectTemplate {
    name:        string;
    description: string;
    notes:       string;
    type:        "app" | "database" | "tool" | "opensource-app";
    templating:  ProcessTemplate[];
    icon:        string;
}
 */
export interface ProjectTemplate {
    name:        string;
    description: string;
    notes:       string;
    type:        "app" | "database" | "tool" | "opensource-app";
    icon:        string;
    category:    string;
    templating:  ProcessTemplate[];
}

/**
 * @example
 * export interface AvailbleTemplates {
    project:    ProjectTemplate[],
    database:   ProjectTemplate[],
    services:   ProjectTemplate[],
    opensource: ProjectTemplate[],
    tool:       ProjectTemplate[],
    demo:       ProjectTemplate[],
}
 */
export interface AvailbleTemplates {
    project:    ProjectTemplate[],
    database:   ProjectTemplate[],
    services:   ProjectTemplate[],
    opensource: ProjectTemplate[],
    tool:       ProjectTemplate[],
    demo:       ProjectTemplate[],
}

import { OpenCodeAgentConfig } from "./opencodeagent";
export type { OpenCodeAgentConfig };
