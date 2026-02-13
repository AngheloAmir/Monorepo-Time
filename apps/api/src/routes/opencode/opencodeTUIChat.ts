import { Request, Response, Router } from "express";

const opencodeSdkPromise = (new Function('specifier', 'return import(specifier)'))("@opencode-ai/sdk");
const router             = Router();


router.post("/newClient", async (req: Request, res: Response) => {

    res.send("Hello World");
});

router.post("/chat", async (req: Request, res: Response) => {
    
    res.send("Hello World");
});

export default router;