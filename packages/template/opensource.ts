import { MattermostLocal } from "./opensource-app/mattermost";
import { NextcloudLocal } from "./opensource-app/nextcloud";
import { MauticLocal } from "./opensource-app/mautic";
import { EzBookkeepingLocal } from "./opensource-app/ezbookkeeping";
import { HeadlampTool } from "./opensource-app/headlamp";

const OpenSourceTemplates =  
    [
        HeadlampTool,
        MattermostLocal,
        NextcloudLocal,
        MauticLocal,
        EzBookkeepingLocal,
    ];

export default OpenSourceTemplates;
