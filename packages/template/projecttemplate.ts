import type { ProjectTemplate } from "../types";
import { ViteReact } from "./projects/vite-react";
import { NextJS } from "./projects/nextjs";
import { ExpoReactNative } from "./projects/expo-react-native";
import { ExpressTS } from "./projects/express";
import { ServerlessExpressTS } from "./projects/serverless-express";
import { PHP } from "./projects/php";
import { Laravel } from "./projects/laravel";
import { PythonConsole } from "./projects/python";
import { DotNetConsole } from "./projects/dotnet";
import { StrapiLocal } from "./projects/strapi";
import { GoApp } from "./projects/go";
import { GoGinApp } from "./projects/go-gin";
import { JavaSpringBoot } from "./projects/java";
import { FlutterApp } from "./projects/flutter";
import { TanStackStart } from "./projects/tanstack-start";

const templates: ProjectTemplate[] = [
    ViteReact,
    NextJS,
    TanStackStart,
    ExpoReactNative,
    FlutterApp,
    GoApp,
    GoGinApp,
    JavaSpringBoot,
    StrapiLocal,
    ExpressTS,
    ServerlessExpressTS,
    PHP,
    Laravel,
    PythonConsole,
    DotNetConsole,
];

export default templates;