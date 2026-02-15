import type { ProjectTemplate } from "../types";
import { MySQL } from "./databases/mysql";
import { PostgreSQL } from "./databases/postgres";
import { Supabase } from "./databases/supabase";
import { Firebase } from "./databases/firebase";
import { Redis } from "./databases/redis";
import { MongoDB } from "./databases/mongodb";
import { Meilisearch } from "./databases/meilisearch";
import { MinIO } from "./databases/minio";
import { Milvus } from "./databases/milvus";

const templates: ProjectTemplate[] = [
    MySQL,
    PostgreSQL,
    Supabase,
    Firebase,
    Redis,
    MongoDB,
    Meilisearch,
    MinIO,
    Milvus
];

export default templates;