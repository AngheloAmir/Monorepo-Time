import { Request, Response, Router } from "express";
import { clientInstance } from "./_core";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
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
