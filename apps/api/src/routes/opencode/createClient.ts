import { Request, Response, Router } from "express";
import { clientInstance, OpencodeClientInstance, opencodeInstances } from "./_core";

const opencodeSdkPromise = (new Function('specifier', 'return import(specifier)'))("@opencode-ai/sdk");
const router = Router();

router.post("/", async (req: Request, res: Response) => {
    try {
        const { instanceId, clientName, createSession } = req.body;
        let { sessionId } = req.body;
        const clientId    = (req.body.clientId as string)?.trim();

        if (!instanceId || !clientId || !clientName)
            return res.status(400).json({ error: "Instance ID, Client ID and Client Name are required" });

        // Get the instance data
        const instance = opencodeInstances.get(instanceId);
        if (!instance)
            return res.status(404).json({ error: "Instance not found" });

        // Prevent duplicate client
        if (clientInstance.has(clientId))
            return res.status(400).json({ error: "Client already exists" });

        const { createOpencodeClient } = await opencodeSdkPromise;
        const client = createOpencodeClient({
            baseUrl: instance.url,
        });

        // Proactively create a session if requested and not provided
        if (!sessionId && createSession) {
            console.log(`Proactively creating Opencode session for new client: ${clientId}`);
            const session = await client.session.create();
            sessionId = session.data.id;
        }

        // Add the new client instance
        const newClientInstance: OpencodeClientInstance = {
            instanceId: instanceId,
            clientId: clientId,
            sessionId: sessionId || "", // Actual session ID from Opencode
            client: client,
            clientName: clientName
        };

        clientInstance.set(clientId, newClientInstance);
        res.json({
            instanceId: instanceId,
            clientId: clientId,
            clientName: clientName,
            sessionId: newClientInstance.sessionId
        });

    } catch (error: any) {
        console.error("Error creating opencode client:", error);
        res.status(500).json({ error: error.message || error });
    }
});

export default router;