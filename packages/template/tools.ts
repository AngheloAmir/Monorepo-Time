import type { ProjectTemplate } from "../types";
import { PgwebTool } from "./tools/pgweb";
import { MongoExpressTool } from "./tools/mongoexpress";
import { RedisCommanderTool } from "./tools/rediscommander";
import { YaadeTool } from "./tools/yaade";
import { MailpitTool } from "./tools/mailpit";
import { CloudbeaverTool } from "./tools/cloudbeaver";
import { HeadlampTool } from "./tools/headlamp";
import { LocalKubernetesTool } from "./tools/kubernetes";

const tools: ProjectTemplate[] = [
    CloudbeaverTool,
    YaadeTool,
    MailpitTool,
    PgwebTool,
    MongoExpressTool,
    RedisCommanderTool,
    HeadlampTool,
    LocalKubernetesTool,
];
export default tools;