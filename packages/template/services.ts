import type { ProjectTemplate } from ".";
import { N8NLocal } from "./services_list/n8n";
import { AWSTemplate } from "./services_list/aws";
import { StripeTemplate } from "./services_list/stripe";
import { MattermostLocal } from "./services_list/mattermost";
import { NextcloudLocal } from "./services_list/nextcloud";

const templates: ProjectTemplate[] = [
    N8NLocal,
    MattermostLocal,
    NextcloudLocal,
    AWSTemplate,
    StripeTemplate,
];
export default templates;