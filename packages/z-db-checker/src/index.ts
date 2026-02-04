import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import helloRouter from "./routes/hello";

const app = express();
const port = process.env.PORT || 3500;

app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

app.use("/hello", helloRouter);

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(port, () => {
    console.log("Server running at http://localhost:" + port);
});
