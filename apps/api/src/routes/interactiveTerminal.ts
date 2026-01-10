import { Request, Response, Router } from "express";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
     console.log('called')
    res.send("Hello World!");
});

export default router;
