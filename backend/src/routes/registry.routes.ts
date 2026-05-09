import { Router } from "express";
import {
  createRegistryCliProfile,
  createRegistryMcpServer,
  getRegistryCliProfiles,
  getRegistryCliRules,
  getRegistryMcpServers,
  patchRegistryCliProfile,
  patchRegistryCliRules,
  patchRegistryMcpServer,
  removeRegistryCliProfile,
  removeRegistryMcpServer
} from "../controllers/registry.controller";

const router = Router();

router.get("/mcp-servers", getRegistryMcpServers);
router.post("/mcp-servers", createRegistryMcpServer);
router.patch("/mcp-servers/:serverId", patchRegistryMcpServer);
router.delete("/mcp-servers/:serverId", removeRegistryMcpServer);

router.get("/cli-rules", getRegistryCliRules);
router.patch("/cli-rules", patchRegistryCliRules);

router.get("/cli-profiles", getRegistryCliProfiles);
router.post("/cli-profiles", createRegistryCliProfile);
router.patch("/cli-profiles/:profileId", patchRegistryCliProfile);
router.delete("/cli-profiles/:profileId", removeRegistryCliProfile);

export default router;
