import type { ProjectTemplate } from "../types";
import { N8NLocal } from "./services/n8n";
import { N8NNative } from "./services/n8n-native";
import { AWSTemplate } from "./services/aws";
import { StripeTemplate } from "./services/stripe";

const templates: ProjectTemplate[] = [
    N8NLocal,
    N8NNative,
    AWSTemplate,
    StripeTemplate,
];
export default templates;   