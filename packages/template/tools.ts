import type { ProjectTemplate } from ".";
import { PgwebTool } from "./tools/pgweb";
import { MongoExpressTool } from "./tools/mongoexpress";
import { RedisCommanderTool } from "./tools/rediscommander";
import { HoppscotchTool } from "./tools/hoppscotch";
import { MailpitTool } from "./tools/mailpit";
import { CloudbeaverTool } from "./tools/cloudbeaver";

const tools: ProjectTemplate[] = [
    CloudbeaverTool,
    HoppscotchTool,
    MailpitTool,
    PgwebTool,
    MongoExpressTool,
    RedisCommanderTool,
];
export default tools;