import { Router } from "express";
import { createComparison } from "../controllers/comparison.controller";
import { validateComparisonInput } from "../validators/comparison.validators";

const router = Router();

router.post('/', validateComparisonInput, createComparison);

export default router;