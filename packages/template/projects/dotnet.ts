import type { ProjectTemplate } from "..";

const netFile = `// See https://aka.ms/new-console-template for more information
Console.WriteLine("Monorepo Time Console!");
Console.Write("Please enter your name: ");
string? name = Console.ReadLine();
Console.WriteLine("Hello " + name);
`;

export const DotNetConsole: ProjectTemplate = {
    name: ".NET Console",
    description: "Simple .NET Console Application",
    notes: ".NET SDK must be installed in your system.",
    templating: [
        {
            action: 'command',
            cmd: 'dotnet',
            args: ['new', 'console']
        },
        {
            action: 'file',
            file: 'Program.cs',
            filecontent: netFile
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.dev=dotnet run']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=dotnet run']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=.NET Console']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fab fa-windows text-blue-500']
        }
    ]
};
