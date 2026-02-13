import { Request, Response, Router } from "express";
import { clientInstance, opencodeInstances, type OpencodeClientInstance } from "./opencodeTUI";

const opencodeSdkPromise = (new Function('specifier', 'return import(specifier)'))("@opencode-ai/sdk");
const router = Router();

router.post("/newclient", async (req: Request, res: Response) => {
    try {
        const { instanceId, clientName } = req.body;
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

        // Add the new client instance
        const newClientInstance: OpencodeClientInstance = {
            instanceId: instanceId,
            clientId: clientId,
            client: client,
            clientName: clientName
        };

        clientInstance.set(clientId, newClientInstance);
        res.json({
            instanceId: instanceId,
            clientId: clientId,
            clientName: clientName
        });

    } catch (error: any) {
        console.error("Error creating opencode client:", error);
        res.status(500).json({ error: error.message || error });
    }
});

router.post("/chat", async (req: Request, res: Response) => {
    try {
        const clientId = (req.body.clientId as string)?.trim();
        const cinstance = clientInstance.get(clientId);

        if (!cinstance) {
            console.log("Active Client IDs:", Array.from(clientInstance.keys()));
            return res.status(404).json({ error: `Client '${clientId}' not found. Check for spaces or use /newclient.` });
        }

        // 1. Resolve Session ID: use as-is if it's a real session ID, otherwise create one
        if (!cinstance.clientId.startsWith('ses_')) {
            console.log(`Creating fresh Opencode session for client: ${clientId}`);
            const session = await cinstance.client.session.create();
            cinstance.clientId = session.data.id;
            // The mapping now holds the real SID from here on
        }

        const result = await cinstance.client.session.prompt({
            path: { id: cinstance.clientId },
            body: {
                parts: [{ type: "text", text: "Research Anthropic and provide company info" }],
                format: {
                    type: "json_schema",
                    schema: {
                        type: "object",
                        properties: {
                            company: { type: "string", description: "Company name" },
                            founded: { type: "number", description: "Year founded" },
                            products: {
                                type: "array",
                                items: { type: "string" },
                                description: "Main products",
                            },
                        },
                        required: ["company", "founded"],
                    },
                },
            },
        });

        console.log( JSON.stringify(result, null, 2));

        res.json({
            success: true,
            sessionId: cinstance.clientId,
            data: result.data?.info?.structured_output || result.data
        });
    } catch (error: any) {
        console.error("Chat prompt error:", error);
        res.status(500).json({ error: error.message || error });
    }
});

export default router;