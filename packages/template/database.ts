import { ProjectTemplate } from ".";
import { MySQL } from "./databases/mysql";
import { PostgreSQL } from "./databases/postgres";
import { Supabase } from "./databases/supabase";
import { Redis } from "./databases/redis";
import { MongoDB } from "./databases/mongodb";

const templates: ProjectTemplate[] = [
    MySQL,
    PostgreSQL,
    Supabase,
    Redis,
    MongoDB
];

export default templates;