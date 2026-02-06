import { Router, Request, Response } from "express";
import mongoose, { Schema, Document } from "mongoose";

const router = Router();

// Define interface for the Log document
interface ILog extends Document {
    time: Date;
}

// Define the schema
const LogSchema: Schema = new Schema({
    time: { type: Date, required: true }
});

// Create model (or retrieve if already exists to prevent OverwriteModelError)
const Log = mongoose.models.Log || mongoose.model<ILog>('Log', LogSchema);

router.post("/", async (req: Request, res: Response) => {
    const { connectionString } = req.body;
    const uri = connectionString || 'mongodb://admin:admin@localhost:27017/db?authSource=admin';

    try {
        // Connect to MongoDB
        // Note: In a real app, you might maintain a persistent connection, 
        // but for this checker we connect on demand to verify the string works.
        // Mongoose buffers commands, so we can await connection.
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(uri);
        } else {
             // If connected to a different URI, we might need to disconnect and reconnect, 
             // but for simplicity assuming single checking flow or same DB. 
             // To be safe for a "checker" that might receive different URIs:
             await mongoose.disconnect();
             await mongoose.connect(uri);
        }

        // Create a new log entry
        const newLog = new Log({ time: new Date() });
        await newLog.save();

        // Fetch all logs
        const logs = await Log.find({});
        
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).send("MongoDB error: " + err);
    }
});

export default router;
