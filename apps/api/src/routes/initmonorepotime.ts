
import { Request, Response, Router } from "express";
import fs from "fs-extra";
import path from "path";
import { ROOT } from "./rootPath";

const router = Router();

const defaultmonrepotime = {
    notes: "",
    crudtest: [
        {
            category: "Internal CRUD Test",
            devurl: "",
            produrl: "",
            items: [
                {
                    label: "Ping the Tool Server",
                    route: "/ping",
                    methods: "GET",
                    description: "Ping the tool server to check if it is running.",
                    sampleInput: "{}",
                    suggested: [],
                    expectedOutcome: "# You should see the word \"pong\" as a message \n\n{\n  \"message\": \"pong\"\n}"
                },
                {
                    label: "Check Post",
                    route: "/post",
                    methods: "POST",
                    description: "Send a POST request to check if it sending correctly",
                    sampleInput: "{\n \"data\": \"test\",\n \"message\": \"test\"\n}",
                    suggested: [
                        {
                            name: "Customer Data",
                            urlparams: "",
                            content: "{\n \"name\": \"Demo Customer\",\n \"email\": \"demo@test.com\",\n \"phone\": \"123456789\",\n \"icon\": \"test icon\"\n}"
                        }
                    ],
                    expectedOutcome: "# Note \nYou should see the mirror of your inputs"
                },
                {
                    label: "Check Stream",
                    route: "/stream",
                    methods: "STREAM",
                    description: "Send a stream request to check if it sending correctly",
                    sampleInput: "{ }",
                    suggested: [
                        {
                            name: "I Wandered Lonely as a Cloud",
                            "urlparams": "poem=I Wandered Lonely as a Cloud",
                            "content": "{}"
                        },
                        {
                            name: "The Sun Has Long Been Set",
                            urlparams: "poem=The Sun Has Long Been Set",
                            content: "{}"
                        }
                    ],
                    expectedOutcome: "# Note \nYou should see the stream of words"
                }
            ]
        }
    ]
}

router.get("/", async (req: Request, res: Response) => {
    try {
        const sourcePath = path.join(__dirname, 'scaffold', 'monorepotime.json');
        const destPath = path.join(ROOT, "monorepotime.json");

        if (fs.existsSync(destPath)) {
             res.status(400).json({ success: false, message: "monorepotime.json already exists" });
             return;
        }

        if (!fs.existsSync(sourcePath)) {
            // Fallback content if scaffold is missing, though it should exist
            await fs.writeJson(destPath, defaultmonrepotime, { spaces: 4 });
             res.json({ success: true, message: "Created monorepotime.json with default content (scaffold missing)" });
             return;
        }

        await fs.copy(sourcePath, destPath);
        res.json({ success: true, message: "Successfully initialized monorepotime.json" });

    } catch (error) {
        console.error("Error initializing monorepotime.json:", error);
        res.status(500).json({ 
            success: false, 
            error: "Failed to initialize monorepotime.json",
            details: error instanceof Error ? error.message : String(error)
        });
    }
});

export default router;
