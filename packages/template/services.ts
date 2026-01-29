import type { ProjectTemplate } from ".";
import { N8NLocal } from "./services_list/n8n";
import { AWSTemplate } from "./services_list/aws";
import { StripeTemplate } from "./services_list/stripe";
import { MattermostLocal } from "./services_list/mattermost";

const templates: ProjectTemplate[] = [
    N8NLocal,
    AWSTemplate,
    StripeTemplate,
    MattermostLocal
];
export default templates;