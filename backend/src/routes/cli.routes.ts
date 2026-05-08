import { Router } from "express";
import { runCli } from "../controllers/cli.controller";
import { validateCliRunInput } from "../validators/cli.validator";

const router = Router();

router.post("/run", validateCliRunInput, runCli);

export default router;