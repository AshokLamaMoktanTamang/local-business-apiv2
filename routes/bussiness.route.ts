// routes/business.ts
import express from "express";
import businessController from "../controller/business.controller";

const router = express.Router();

// POST /api/business - Register a new business
router.post("/business", businessController.registerBusiness);

export default router;