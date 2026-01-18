// API Routes for chat, embedding, and config endpoints

export const chatRouteTs = `import { Router, Request, Response } from 'express';
import { searchSimilar } from '../vectorStore';
import { getConfig, callEmbeddingsAPI, callChatAPI } from '../aiClient';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const config = getConfig();
        if (!config.apiKey) {
            return res.json({ 
                reply: "I'm not configured yet. Please ask the admin to set up the AI provider in the admin panel." 
            });
        }

        // Get embedding for the user's message
        const queryEmbedding = await callEmbeddingsAPI(message);
        
        // Search for similar content in our knowledge base
        const similarDocs = searchSimilar(queryEmbedding, 3);
        
        // Build context from similar documents
        let context = '';
        if (similarDocs.length > 0 && similarDocs[0].score > 0.3) {
            context = 'Relevant information from our knowledge base:\\n' + 
                similarDocs
                    .filter(doc => doc.score > 0.3)
                    .map(doc => doc.text)
                    .join('\\n\\n');
        }

        // Create the chat prompt
        const systemPrompt = "You are a helpful customer support assistant for FreshFruit, " +
            "a premium organic fruit delivery service. Be friendly, helpful, and concise. " +
            "If you have relevant information from the knowledge base, use it to answer. " +
            "If you don't know something, say so politely and suggest contacting human support.\\n\\n" +
            (context ? 'Knowledge Base Context:\\n' + context : 'No specific knowledge base context available for this query.');

        // Call the chat API
        const reply = await callChatAPI(systemPrompt, message);
        
        res.json({ reply });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Failed to process message' });
    }
});

export default router;
`;

export const embedRouteTs = `import { Router, Request, Response } from 'express';
import { addEmbedding, clearEmbeddings, getEmbeddingCount } from '../vectorStore';
import { getConfig, callEmbeddingsAPI } from '../aiClient';

const router = Router();

// Embed new content
router.post('/', async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        
        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const config = getConfig();
        if (!config.apiKey) {
            return res.status(400).json({ error: 'API key not configured. Please configure in admin panel.' });
        }

        // Split content into chunks (by double newline or paragraph)
        const chunks = content
            .split(/\\n\\n+/)
            .map((chunk: string) => chunk.trim())
            .filter((chunk: string) => chunk.length > 10);

        if (chunks.length === 0) {
            return res.status(400).json({ error: 'No valid content chunks found' });
        }

        // Embed each chunk
        let embedded = 0;
        for (const chunk of chunks) {
            try {
                const embedding = await callEmbeddingsAPI(chunk);
                addEmbedding(chunk, embedding);
                embedded++;
            } catch (error) {
                console.error('Failed to embed chunk:', error);
            }
        }

        res.json({ 
            message: 'Successfully embedded ' + embedded + ' chunks',
            count: getEmbeddingCount()
        });
    } catch (error) {
        console.error('Embed error:', error);
        res.status(500).json({ error: 'Failed to embed content' });
    }
});

// Clear all embeddings
router.delete('/', (req: Request, res: Response) => {
    clearEmbeddings();
    res.json({ message: 'All embeddings cleared', count: 0 });
});

export default router;
`;

export const configRouteTs = `import { Router, Request, Response } from 'express';
import { getConfig, saveConfig, AIConfig } from '../aiClient';
import { getEmbeddingCount, getLastUpdated } from '../vectorStore';

const router = Router();

// Get current config
router.get('/', (req: Request, res: Response) => {
    const config = getConfig();
    // Mask the API key for security
    const maskedConfig = {
        ...config,
        apiKey: config.apiKey ? '••••••' + config.apiKey.slice(-4) : ''
    };
    
    res.json({
        config: maskedConfig,
        embeddingCount: getEmbeddingCount(),
        lastUpdated: getLastUpdated()
    });
});

// Update config
router.post('/', (req: Request, res: Response) => {
    try {
        const { apiKey, providerUrl, embeddingsUrl, model, embeddingsModel } = req.body;
        
        const newConfig: AIConfig = {
            apiKey: apiKey || '',
            providerUrl: providerUrl || 'https://api.openai.com/v1/chat/completions',
            embeddingsUrl: embeddingsUrl || 'https://api.openai.com/v1/embeddings',
            model: model || 'gpt-3.5-turbo',
            embeddingsModel: embeddingsModel || 'text-embedding-3-small'
        };
        
        saveConfig(newConfig);
        res.json({ message: 'Configuration saved' });
    } catch (error) {
        console.error('Config save error:', error);
        res.status(500).json({ error: 'Failed to save configuration' });
    }
});

export default router;
`;
