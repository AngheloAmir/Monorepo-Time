import type { ProjectTemplate } from "../types";
import { ViteReact } from "./projects/vite-react";
import { NextJS } from "./projects/nextjs";
import { ExpressTS } from "./projects/express";
import { ServerlessExpressTS } from "./projects/serverless-express";
import { PHP } from "./projects/php";
import { Laravel } from "./projects/laravel";
import { PythonConsole } from "./projects/python";
import { DotNetConsole } from "./projects/dotnet";
import { PlasmicNextJS } from "./projects/plasmic";
import { StrapiLocal } from "./projects/strapi";

const templates: ProjectTemplate[] = [
    ViteReact,
    NextJS,
    PlasmicNextJS,
    StrapiLocal,
    ExpressTS,
    ServerlessExpressTS,
    PHP,
    Laravel,
    PythonConsole,
    DotNetConsole
];

export default templates;