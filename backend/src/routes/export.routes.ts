import { Router } from "express";
import {
  exportHistoryCsv,
  exportHistoryJson
} from "../controllers/export.controller";

const router = Router();

router.get("/history/json", exportHistoryJson);
router.get("/history/csv", exportHistoryCsv);

export default router;