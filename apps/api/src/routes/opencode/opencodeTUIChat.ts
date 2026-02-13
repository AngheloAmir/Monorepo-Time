import { Request, Response, Router } from "express";
import { clientInstance, opencodeInstances, type OpencodeClientInstance } from "./opencodeTUI";

const opencodeSdkPromise = (new Function('specifier', 'return import(specifier)'))("@opencode-ai/sdk");
const router = Router();

router.post("/newclient", async (req: Request, res: Response) => {
    try {
        const { instanceId, clientId, clientName } = req.body;
        if (!instanceId || !clientId || !clientName)
            return res.status(400).json({ error: "Instance ID, Client ID and Client Name are required" });

        //get the instance data
        const instance = opencodeInstances.get(instanceId);
        if (!instance)
            return res.status(404).json({ error: "Instance not found" });

        //prevent duplicate client
        if (clientInstance.has(clientId))
            return res.status(400).json({ error: "Client already exists" });

        const { createOpencodeClient } = await opencodeSdkPromise;
        const client = createOpencodeClient({
            baseUrl: instance.url,
        });

        //add the new instance 
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

    } catch (error) {
        console.error("Error creating opencode client:", error);
        res.status(500).json({ error: error });
    }
});

router.post("/chat", async (req: Request, res: Response) => {
    const { clientId } = req.body;
    const cinstance    = clientInstance.get(clientId);

    console.log(clientInstance);

    if (!cinstance) return res.status(404).json({ error: "Client not found" });

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
    })
    
    res.json({
        data: result.data.info.structured_output
    })
});

export default router;