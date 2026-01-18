import type { ProjectTemplate } from "..";

export const AIChat: ProjectTemplate = {
    name: "AI Chat",
    description: "Simple fullstack ExpressJS AI Chat project template",
    notes: "",
    templating: [
        {
            action: 'command',
            command: "npm pkg set fontawesomeIcon=\"fa-solid fa-comments\""
        }
    ]
};
