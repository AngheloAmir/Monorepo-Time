import { Router, Request, Response } from "express";
import mysql from 'mysql2/promise';

const router = Router();

router.post("/", async (req: Request, res: Response) => {
    const { connectionString } = req.body;
    const uri = connectionString || 'mysql://admin:admin@localhost:3306/db';

    try {
        const connection = await mysql.createConnection(uri);
        try {
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS Log (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    time TIMESTAMP NOT NULL
                );
            `);

            await connection.execute("INSERT INTO Log (time) VALUES (NOW())");

            const [rows] = await connection.execute("SELECT * FROM Log");
            res.json(rows);
        } finally {
            await connection.end();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Database error: " + err);
    }
});

export default router;
