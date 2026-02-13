import { Request, Response, Router } from "express";
import { clientInstance, opencodeInstances, type OpencodeClientInstance } from "./opencodeTUI";

const opencodeSdkPromise = (new Function('specifier', 'return import(specifier)'))("@opencode-ai/sdk");
const router = Router();

router.post("/newclient", async (req: Request, res: Response) => {
    try {
        const { instanceId, clientName, createSession } = req.body;
        let { sessionId } = req.body;
        const clientId = (req.body.clientId as string)?.trim();

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

router.post("/chat", async (req: Request, res: Response) => {
    try {
        const clientId = (req.body.clientId as string)?.trim();
        const { message, format, sessionId: reqSessionId } = req.body; // Use optional sessionId from body

        const cinstance = clientInstance.get(clientId);

        if (!cinstance) {
            console.log("Active Client IDs:", Array.from(clientInstance.keys()));
            return res.status(404).json({ error: `Client '${clientId}' not found. Check for spaces or use /newclient.` });
        }

        // 1. Resolve Session ID: use body sessionId if provided, otherwise check stored ID
        let targetSessionId = reqSessionId || cinstance.sessionId;

        if (!targetSessionId || !targetSessionId.startsWith('ses_')) {
            console.log(`Creating fresh Opencode session for client: ${clientId}`);
            const session = await cinstance.client.session.create();
            targetSessionId = session.data.id;
            // Only update stored ID if we're not using a specific one-off body sessionId
            if (!reqSessionId) cinstance.sessionId = targetSessionId;
        }

        const result = await cinstance.client.session.prompt({
            path: { id: targetSessionId },
            body: {
                parts: [{ type: "text", text: message || "Hello" }],
                ...(format ? { format } : {})
            },
        });

        console.log("Opencode Response:", JSON.stringify(result, null, 2));

        res.json({
            success: true,
            sessionId: targetSessionId,
            // If it's a structured output request, return that, otherwise return the raw parts
            data: result.data?.info?.structured_output || result.data?.parts || result.data
        });
    } catch (error: any) {
        console.error("Chat prompt error:", error);
        res.status(500).json({ error: error.message || error });
    }
});

export default router;