import type { ProjectTemplate } from "..";

export const Laravel: ProjectTemplate = {
    name: "Laravel",
    description: "Laravel PHP Framework template",
    notes: "Composer and PHP must be installed in your system.",
    templating: [
        {
            action: 'command',
            command: 'composer create-project laravel/laravel .'
        },
        {
            action: 'command',
            command: 'npm pkg set scripts.dev="php artisan serve"'
        },
        {
            action: 'command',
            command: 'npm pkg set scripts.start="php artisan serve"'
        },
        {
            action: 'command',
            command: 'npm pkg set scripts.stop="npx kill-port 8000"'
        },
        {
            action: 'command',
            command: "npm pkg set scripts.fontawesomeIcon=\"fa-solid fa-server\""
        }
    ]
};
