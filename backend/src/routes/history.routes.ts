import { Router } from "express";
import {
  getHistory,
  getHistoryById,
  deleteHistoryById
} from "../controllers/history.controller";

const router = Router();

router.get("/", getHistory);
router.get("/:id", getHistoryById);
router.delete("/:id", deleteHistoryById);

export default router;