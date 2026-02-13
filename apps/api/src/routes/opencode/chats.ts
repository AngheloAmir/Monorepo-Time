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


router.post("/chatevents", async (req: Request, res: Response) => {
    let targetSessionId = "";
    let streamRef: any = null;

    try {
        const clientId = (req.body.clientId as string)?.trim();
        const { message, format, sessionId: reqSessionId } = req.body;

        const cinstance = clientInstance.get(clientId);

        if (!cinstance) {
            console.log("Active Client IDs:", Array.from(clientInstance.keys()));
            return res.status(404).json({ error: `Client '${clientId}' not found. Check for spaces or use /newclient.` });
        }

        // 1. Resolve Session ID: use body sessionId if provided, otherwise check stored ID
        targetSessionId = reqSessionId || cinstance.sessionId;

        if (!targetSessionId || !targetSessionId.startsWith('ses_')) {
            console.log(`Creating fresh Opencode session for client: ${clientId}`);
            const session = await cinstance.client.session.create();
            targetSessionId = session.data.id;
            if (!reqSessionId) cinstance.sessionId = targetSessionId;
        }

        // Set Headers for SSE
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        });

        // Initialize SSE connection
        res.write(`data: ${JSON.stringify({ type: "connected", sessionId: targetSessionId })}\n\n`);

        // Subscribe to events
        const { stream } = await cinstance.client.event.subscribe();
        streamRef = stream;

        // Cleanup on connection close
        req.on('close', async () => {
            console.log(`SSE connection closed for session: ${targetSessionId}`);
            if (streamRef) streamRef.return(null);
            // Optional: abort the current session if it's still busy
            try {
                await cinstance.client.session.abort({ path: { id: targetSessionId } });
            } catch (e) {
                // ignore
            }
        });

        // Start the prompt without awaiting it fully yet
        const promptPromise = cinstance.client.session.prompt({
            path: { id: targetSessionId },
            body: {
                parts: [{ type: "text", text: message || "Hello" }],
                ...(format ? { format } : {})
            },
        });

        // Process events in the background
        (async () => {
            try {
                for await (const event of stream) {
                    const props = event.properties as any;
                    const eventSessionId = props?.sessionID || props?.info?.sessionID || props?.part?.sessionID;

                    if (eventSessionId === targetSessionId) {
                        res.write(`data: ${JSON.stringify(event)}\n\n`);

                        // If the session goes back to idle, we are likely done
                        if (event.type === "session.status" && props?.status?.type === "idle") {
                            break;
                        }
                    }
                }
            } catch (err) {
                console.error("Event stream error:", err);
            } finally {
                // Once events are done or we break, wait for prompt results
                try {
                    const result = await promptPromise;
                    res.write(`data: ${JSON.stringify({
                        type: "completed",
                        success: true,
                        sessionId: targetSessionId,
                        data: result.data?.info?.structured_output || result.data?.parts || result.data
                    })}\n\n`);
                } catch (err: any) {
                    res.write(`data: ${JSON.stringify({ type: "error", error: err.message || err })}\n\n`);
                }
                res.end();
            }
        })();

    } catch (error: any) {
        console.error("Chat SSE error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message || error });
        } else {
            res.write(`data: ${JSON.stringify({ type: "error", error: error.message || error })}\n\n`);
            res.end();
        }
    }
});

export default router;