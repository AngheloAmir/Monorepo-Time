import { MattermostLocal } from "./opensource-app/mattermost";
import { NextcloudLocal } from "./opensource-app/nextcloud";
import { MauticLocal } from "./opensource-app/mautic";
import { EzBookkeepingLocal } from "./opensource-app/ezbookkeeping";
import { WebstudioLocal } from "./opensource-app/webstudio";

const OpenSourceTemplates =  
    [
        WebstudioLocal,
        MattermostLocal,
        NextcloudLocal,
        MauticLocal,
        EzBookkeepingLocal,
    ];

export default OpenSourceTemplates;
