import type { ProjectTemplate } from "../../types";

export const Laravel: ProjectTemplate = {
    name: "Laravel",
    description: "Laravel PHP Framework template",
    notes: "Composer and PHP must be installed in your system.",
    type: "app",
    templating: [
        {
            action: 'command',
            cmd: 'rm -rf ./* ./.[!.]*',
            args: []
        },
        {
            action: 'command',
            cmd: 'composer',
            args: ['create-project', 'laravel/laravel', '.', '--no-interaction', '--no-progress']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'name=$(basename $PWD)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.dev=php artisan serve']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=php artisan serve']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=npx -y kill-port 8000']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=Laravel']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fab fa-laravel text-red-500']
        }
    ]
};
