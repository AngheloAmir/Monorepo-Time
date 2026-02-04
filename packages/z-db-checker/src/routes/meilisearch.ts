import { Router, Request, Response } from "express";
import { MeiliSearch } from 'meilisearch';

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    const { connectionString, apiKey } = req.body;
    const host = connectionString || 'http://localhost:7700';
    const key = apiKey || 'admin';

    const client = new MeiliSearch({
        host: host,
        apiKey: key,
    });

    try {
        const index = client.index('logs');
        
        // Ensure index exists (implicitly created on addDocuments usually, but good to be explicit or just proceed)
        
        const timestamp = new Date().toISOString();
        const id = Date.now();
        
        // Add document
        const task = await index.addDocuments([
            { id: id, time: timestamp }
        ]);

        // Simple delay to allow indexing to process
        await new Promise(resolve => setTimeout(resolve, 500));

        // Get documents (might be empty if indexing isn't fast enough)
        const result = await index.getDocuments({
            limit: 20,
            offset: 0
        });

        res.json(result.results);
    } catch (err) {
        console.error(err);
        res.status(500).send("Meilisearch error: " + err);
    }
});

export default router;
