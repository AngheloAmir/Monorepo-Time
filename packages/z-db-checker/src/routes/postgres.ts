import { Router, Request, Response } from "express";
import { Pool } from 'pg';

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    const { connectionString } = req.body;
    const pool = new Pool({
        connectionString: connectionString || 'postgres://admin:admin@localhost:5432/db',
    });

    try {
        const client = await pool.connect();
        try {
            await client.query(`
                CREATE TABLE IF NOT EXISTS Log (
                    id SERIAL PRIMARY KEY,
                    time TIMESTAMP NOT NULL
                );
            `);

            await client.query("INSERT INTO Log (time) VALUES (NOW())");

            const result = await client.query("SELECT * FROM Log");
            res.json(result.rows);
        } finally {
            client.release();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error: " + err);
    }
});

export default router;
