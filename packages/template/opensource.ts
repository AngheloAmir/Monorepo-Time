import { MattermostLocal } from "./opensource-app/mattermost";
import { NextcloudLocal } from "./opensource-app/nextcloud";
import { MauticLocal } from "./opensource-app/mautic";
import { EzBookkeepingLocal } from "./opensource-app/ezbookkeeping";
import { PeppermintLocal } from "./opensource-app/peppermint";
import { PenpotLocal } from "./opensource-app/penpot";
import { DrawDBTool } from "./opensource-app/drawdb";
import { N8nMcpTool } from "./opensource-app/n8n-mcp";
import { OdooLocal }  from "./opensource-app/odoo";

const OpenSourceTemplates =  [
    OdooLocal,
    DrawDBTool,
    PenpotLocal,
    N8nMcpTool,
    MattermostLocal,
    NextcloudLocal,
    MauticLocal,
    EzBookkeepingLocal,
    PeppermintLocal,
];

export default OpenSourceTemplates;

