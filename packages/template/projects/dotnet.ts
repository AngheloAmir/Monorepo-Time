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
            command: 'dotnet new console'
        },
        {
            action: 'file',
            file: 'Program.cs',
            filecontent: netFile
        },
        {
            action: 'command',
            command: 'npm pkg set scripts.dev="dotnet run"'
        },
        {
            action: 'command',
            command: 'npm pkg set scripts.start="dotnet run"'
        },
        {
            action: 'command',
            command: "npm pkg set scripts.fontawesomeIcon=\"fa-solid fa-terminal\""
        }
    ]
};
