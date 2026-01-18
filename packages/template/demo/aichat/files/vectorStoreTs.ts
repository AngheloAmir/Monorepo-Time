// Vector Store implementation for in-memory storage with file persistence

export const vectorStoreTs = `import fs from 'fs';
import path from 'path';

const EMBEDDINGS_FILE = path.join(__dirname, '../embeddings.json');

interface EmbeddingEntry {
    id: string;
    text: string;
    embedding: number[];
    timestamp: number;
}

// In-memory vector database
let vectorStore: EmbeddingEntry[] = [];

// Load embeddings from file on startup
export function loadEmbeddings(): void {
    try {
        if (fs.existsSync(EMBEDDINGS_FILE)) {
            const data = fs.readFileSync(EMBEDDINGS_FILE, 'utf-8');
            vectorStore = JSON.parse(data);
            console.log('📚 Loaded ' + vectorStore.length + ' embeddings from file');
        }
    } catch (error) {
        console.error('Failed to load embeddings:', error);
        vectorStore = [];
    }
}

// Save embeddings to file
export function saveEmbeddings(): void {
    try {
        fs.writeFileSync(EMBEDDINGS_FILE, JSON.stringify(vectorStore, null, 2));
    } catch (error) {
        console.error('Failed to save embeddings:', error);
    }
}

// Add embedding to store
export function addEmbedding(text: string, embedding: number[]): void {
    const entry: EmbeddingEntry = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        text,
        embedding,
        timestamp: Date.now()
    };
    vectorStore.push(entry);
    saveEmbeddings();
}

// Clear all embeddings
export function clearEmbeddings(): void {
    vectorStore = [];
    saveEmbeddings();
}

// Get embedding count
export function getEmbeddingCount(): number {
    return vectorStore.length;
}

// Cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Search for similar embeddings
export function searchSimilar(queryEmbedding: number[], topK: number = 3): { text: string; score: number }[] {
    const results = vectorStore
        .map(entry => ({
            text: entry.text,
            score: cosineSimilarity(queryEmbedding, entry.embedding)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
    
    return results;
}

// Get last update time
export function getLastUpdated(): string | null {
    if (vectorStore.length === 0) return null;
    const latest = Math.max(...vectorStore.map(e => e.timestamp));
    return new Date(latest).toLocaleString();
}
`;
