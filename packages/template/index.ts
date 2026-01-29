import database  from "./database";
import demo from "./demo";
import templates from "./projecttemplate";
import services  from "./services";
import tools from "./tools";

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
    templating:  ProcessTemplate[];
}

const MonorepoTemplates =  {
    project:    templates,
    database:   database,
    services:   services,
    tool:       tools,
    demo:       demo,
}

export default MonorepoTemplates;
