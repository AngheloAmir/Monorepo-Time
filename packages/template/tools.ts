import type { ProjectTemplate } from "../types";
import { MongoExpressTool } from "./tools/mongoexpress";
import { RedisCommanderTool } from "./tools/rediscommander";
import { YaadeTool } from "./tools/yaade";
import { MailpitTool } from "./tools/mailpit";
import { CloudbeaverTool } from "./tools/cloudbeaver";

const tools: ProjectTemplate[] = [
    CloudbeaverTool,
    MongoExpressTool,
    RedisCommanderTool,
    YaadeTool,
    MailpitTool,
];
export default tools;