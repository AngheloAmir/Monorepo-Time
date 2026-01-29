import type { ProjectTemplate } from ".";
import { PgwebTool } from "./tools/pgweb";
import { MongoExpressTool } from "./tools/mongoexpress";
import { RedisCommanderTool } from "./tools/rediscommander";

const tools: ProjectTemplate[] = [
    PgwebTool,
    MongoExpressTool,
    RedisCommanderTool,
];
export default tools;