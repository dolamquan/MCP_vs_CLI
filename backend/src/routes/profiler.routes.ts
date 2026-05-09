import { Router } from "express";
import {
  compareProfiles,
  profileCli,
  profileMcp
} from "../controllers/profiler.controller";

const router = Router();

router.post("/cli", profileCli);
router.post("/mcp", profileMcp);
router.post("/compare", compareProfiles);

export default router;