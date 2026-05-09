import express from "express";
import cors from "cors";
import routes from "./routes/index.routes";
import { loggerMiddleware } from "./middleware/logger.middleware";
import { notFoundMiddleware } from "./middleware/notFound.middleware";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use(loggerMiddleware);

app.use("/api", routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;