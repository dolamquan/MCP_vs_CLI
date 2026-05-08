import { Router } from "express";
import healthRoutes from "./health.routes";
import comparisonRoutes from "./comparison.routes";
import pricingRoutes from "./pricing.routes";
import historyRoutes from "./history.routes";
import reportsRoutes from "./reports.routes";
import cliRoutes from "./cli.routes";
import mcpRoutes from "./mcp.routes";

const router = Router();

router.use("/health", healthRoutes);
router.use("/comparisons", comparisonRoutes);
router.use("/pricing", pricingRoutes);
router.use("/history", historyRoutes);
router.use("/reports", reportsRoutes);
router.use("/cli", cliRoutes);
router.use("/mcp", mcpRoutes);

export default router;
