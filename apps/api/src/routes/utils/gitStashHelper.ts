import { Request, Response, Router } from "express";
const router = Router();

router.get("/list", async (req: Request, res: Response) => {
     console.log('called')
    res.send("Hello World!");
});

router.get("/clear", async (req: Request, res: Response) => {
     console.log('called')
    res.send("Hello World!");
});

router.post("/add", async (req: Request, res: Response) => {
     console.log('called')
    res.send("Hello World!");
});

router.post("/revert", async (req: Request, res: Response) => {
     console.log('called')
    res.send("Hello World!");
});

export default router;
