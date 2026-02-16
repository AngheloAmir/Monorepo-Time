import type { ProjectTemplate } from "../types";
import { N8NLocal } from "./services/n8n";
import { N8NNative } from "./services/n8n-native";
import { AWSTemplate } from "./services/aws";
import { StripeTemplate } from "./services/stripe";
import { K3dHeadlampTemplate } from "./services/k3d-headlamp";
import { OllamaTemplate } from "./services/ollama";

const templates: ProjectTemplate[] = [
    N8NLocal,
    N8NNative,
    AWSTemplate,
    StripeTemplate,
    K3dHeadlampTemplate,
    OllamaTemplate,
];
export default templates;   