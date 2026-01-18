import database  from "./database";
import demo from "./demo";
import templates from "./projecttemplate";
import services  from "./services";

export interface ProcessTemplate {
    action:   "command" | "file";
    command?: string;
    file?:    string;
    filecontent?: string;
}

export interface ProjectTemplate {
    name:        string;
    description: string;
    notes:       string;
    templating:  ProcessTemplate[];
}

const MonorepoTemplates =  {
    project:    templates,
    database:   database,
    services:   services,
    demo:       demo,
}

export default MonorepoTemplates;
