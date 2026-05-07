import express from "express";
import cors from "cors";
import routes from "./routes/index.routes";

const app = express();

app.use(cors()); // Lets backend accept requests from a frontend running on a different origin
app.use(express.json());
app.use("/api", routes); // Prefix all routes with /api
export default app;