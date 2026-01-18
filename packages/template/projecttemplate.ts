import type { ProjectTemplate } from ".";
import { ViteReact } from "./projects/vite-react";
import { NextJS } from "./projects/nextjs";
import { ExpressTS } from "./projects/express";
import { PHP } from "./projects/php";
import { Laravel } from "./projects/laravel";
import { PythonConsole } from "./projects/python";
import { DotNetConsole } from "./projects/dotnet";

const templates: ProjectTemplate[] = [
    ViteReact,
    NextJS,
    ExpressTS,
    PHP,
    Laravel,
    PythonConsole,
    DotNetConsole
];

export default templates;