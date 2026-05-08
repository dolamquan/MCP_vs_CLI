import { Router } from "express";
import {
  getMcpServers,
  getMcpTools,
  runMcpTool
} from "../controllers/mcp.controller";
import {
  validateMcpServerIdParam,
  validateMcpToolCallInput
} from "../validators/mcp.validator";

const router = Router();

router.get("/servers", getMcpServers);
router.get("/servers/:serverId/tools", validateMcpServerIdParam, getMcpTools);
router.post("/call-tool", validateMcpToolCallInput, runMcpTool);

export default router;