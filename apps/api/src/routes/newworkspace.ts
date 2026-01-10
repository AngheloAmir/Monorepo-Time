import { Request, Response, Router } from "express";
import type { WorkspaceInfo } from "types";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const reqBody: WorkspaceInfo = req.body;

    console.log('called')
    res.send("Hello World!");
});

export default router;
