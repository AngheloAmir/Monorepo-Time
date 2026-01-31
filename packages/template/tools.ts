import type { ProjectTemplate } from "../types";
import { PgwebTool } from "./tools/pgweb";
import { MongoExpressTool } from "./tools/mongoexpress";
import { RedisCommanderTool } from "./tools/rediscommander";
import { YaadeTool } from "./tools/yaade";
import { MailpitTool } from "./tools/mailpit";
import { CloudbeaverTool } from "./tools/cloudbeaver";

const tools: ProjectTemplate[] = [
    CloudbeaverTool,
    YaadeTool,
    MailpitTool,
    PgwebTool,
    MongoExpressTool,
    RedisCommanderTool,
];
export default tools;