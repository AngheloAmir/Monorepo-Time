import type { ProjectTemplate } from "../types";
import { N8NLocal } from "./services/n8n";
import { AWSTemplate } from "./services/aws";
import { StripeTemplate } from "./services/stripe";
import { LocalKubernetesTool } from "./services/kubernetes";

const templates: ProjectTemplate[] = [
    N8NLocal,
    LocalKubernetesTool,
    AWSTemplate,
    StripeTemplate,
];
export default templates;   