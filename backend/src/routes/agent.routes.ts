import { Router } from "express";
import {
  getAgentCapabilities,
  getAgentHealth,
  recommendActionForAgent
} from "../controllers/agent.controller";

const router = Router();

router.get("/health", getAgentHealth);
router.get("/capabilities", getAgentCapabilities);
router.post("/recommend", recommendActionForAgent);

export default router;