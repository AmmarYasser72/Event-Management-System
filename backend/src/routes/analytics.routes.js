// backend/src/routes/analytics.routes.js
import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { getOverview } from "../controllers/analytics.controllers.js";

const router = Router();

router.get("/overview", requireAuth, isAdmin, getOverview);

export default router;
