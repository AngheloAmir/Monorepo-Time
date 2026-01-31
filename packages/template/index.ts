import database  from "./database";
import demo from "./demo";
import opensource from "./opensource";
import templates from "./projecttemplate";
import services  from "./services";
import tools from "./tools";

const MonorepoTemplates =  {
    project:    templates,
    database:   database,
    services:   services,
    opensource: opensource,
    tool:       tools,
    demo:       demo,
}

export default MonorepoTemplates;
