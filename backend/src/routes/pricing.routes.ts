import { Router } from "express";
import { getAllPricing, getPricingById } from "../controllers/pricing.controller";
import { validateModelIdParam } from "../validators/pricing.validator";

const router = Router();

router.get("/", getAllPricing);
router.get("/:modelId", validateModelIdParam, getPricingById);

export default router;