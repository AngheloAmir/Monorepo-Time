import type { ProjectTemplate } from "../types";
import { N8NLocal } from "./services_list/n8n";
import { AWSTemplate } from "./services_list/aws";
import { StripeTemplate } from "./services_list/stripe";
import { MattermostLocal } from "./services_list/mattermost";
import { NextcloudLocal } from "./services_list/nextcloud";
import { MauticLocal } from "./services_list/mautic";

const templates: ProjectTemplate[] = [
    N8NLocal,
    MattermostLocal,
    NextcloudLocal,
    MauticLocal,
    AWSTemplate,
    StripeTemplate,
];
export default templates;   