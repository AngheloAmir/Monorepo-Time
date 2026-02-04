import { MattermostLocal } from "./opensource-app/mattermost";
import { NextcloudLocal } from "./opensource-app/nextcloud";
import { MauticLocal } from "./opensource-app/mautic";
import { EzBookkeepingLocal } from "./opensource-app/ezbookkeeping";
import { PeppermintLocal } from "./opensource-app/peppermint";
import { PenpotLocal } from "./opensource-app/penpot";
import { DrawDBTool } from "./opensource-app/drawdb";

const OpenSourceTemplates =  [
    DrawDBTool,
    PenpotLocal,
    MattermostLocal,
    NextcloudLocal,
    MauticLocal,
    EzBookkeepingLocal,
    PeppermintLocal
];

export default OpenSourceTemplates;

