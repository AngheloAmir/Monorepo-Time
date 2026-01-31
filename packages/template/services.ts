import type { ProjectTemplate } from "../types";
import { N8NLocal } from "./services/n8n";
import { AWSTemplate } from "./services/aws";
import { StripeTemplate } from "./services/stripe";
import { LocalKubernetesTool } from "./services/kubernetes";
import { StrapiLocal } from "./services/strapi";

const templates: ProjectTemplate[] = [
    N8NLocal,
    StrapiLocal,
    LocalKubernetesTool,
    AWSTemplate,
    StripeTemplate,
];
export default templates;   