import express from "express";
import { env } from "./config";
import { mainRouter } from "./routes";
import { Database } from "./db";
import cors from "cors";

const app = express();
const databse = new Database();

databse.connect();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api", mainRouter);
app.use("/uploads", express.static("uploads"));

const port = env.PORT;
app.listen(port, () => {
  console.log(`APP listening at port`, port);
});
