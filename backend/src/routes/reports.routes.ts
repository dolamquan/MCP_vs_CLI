import { Router } from "express";
import {
  getReportChartData,
  getSummaryReport
} from "../controllers/reports.controller";

const router = Router();

router.get("/summary", getSummaryReport);
router.get("/chart-data", getReportChartData);

export default router;
