import type { ProjectTemplate } from ".";
import { MySQL } from "./databases/mysql";
import { PostgreSQL } from "./databases/postgres";
import { Supabase } from "./databases/supabase";
import { Redis } from "./databases/redis";
import { MongoDB } from "./databases/mongodb";
import { Meilisearch } from "./databases/meilisearch";
import { MinIO } from "./databases/minio";

const templates: ProjectTemplate[] = [
    MySQL,
    PostgreSQL,
    Supabase,
    Redis,
    MongoDB,
    Meilisearch,
    MinIO
];

export default templates;