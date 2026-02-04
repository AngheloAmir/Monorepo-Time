import express, { Request, Response } from "express";
import path from "path";
import cors from "cors";
import helloRouter from "./routes/hello";
import postgresRouter from "./routes/postgres";
import mariadbRouter from "./routes/mariadb";
import redisRouter from "./routes/redis";
import mongodbRouter from "./routes/mongodb";

const app  = express();
const port = process.env.PORT || 3500;

app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use("/hello", helloRouter);
app.use("/postgres", postgresRouter);
app.use("/mariadb", mariadbRouter);
app.use("/redis", redisRouter);
app.use("/mongodb", mongodbRouter);

app.listen(port, () => {
    console.log("Server running at http://localhost:" + port);
});
