// AI Client for OpenAI-compatible API calls

export const aiClientTs = `import fs from 'fs';
import path from 'path';

const CONFIG_FILE = path.join(__dirname, '../config.json');

export interface AIConfig {
    apiKey: string;
    providerUrl: string;
    embeddingsUrl: string;
    model: string;
    embeddingsModel: string;
}

// Default configuration
const defaultConfig: AIConfig = {
    apiKey: '',
    providerUrl: 'https://api.openai.com/v1/chat/completions',
    embeddingsUrl: 'https://api.openai.com/v1/embeddings',
    model: 'gpt-3.5-turbo',
    embeddingsModel: 'text-embedding-3-small'
};

let currentConfig: AIConfig = { ...defaultConfig };

// Load configuration from file
export function loadConfig(): void {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
            currentConfig = { ...defaultConfig, ...JSON.parse(data) };
            console.log('🔑 Loaded AI configuration');
        }
    } catch (error) {
        console.error('Failed to load config:', error);
        currentConfig = { ...defaultConfig };
    }
}

// Save configuration to file
export function saveConfig(config: AIConfig): void {
    currentConfig = { ...config };
    try {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    } catch (error) {
        console.error('Failed to save config:', error);
    }
}

// Get current configuration
export function getConfig(): AIConfig {
    return currentConfig;
}

// Call embeddings API
export async function callEmbeddingsAPI(text: string): Promise<number[]> {
    const config = getConfig();
    
    if (!config.apiKey) {
        throw new Error('API key not configured');
    }

    const response = await fetch(config.embeddingsUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + config.apiKey
        },
        body: JSON.stringify({
            model: config.embeddingsModel,
            input: text
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error('Embeddings API error: ' + error);
    }

    const data = await response.json();
    return data.data[0].embedding;
}

// Call chat completions API
export async function callChatAPI(systemPrompt: string, userMessage: string): Promise<string> {
    const config = getConfig();
    
    if (!config.apiKey) {
        throw new Error('API key not configured');
    }

    const response = await fetch(config.providerUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + config.apiKey
        },
        body: JSON.stringify({
            model: config.model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            max_tokens: 500,
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error('Chat API error: ' + error);
    }

    const data = await response.json();
    return data.choices[0].message.content;
}
`;
