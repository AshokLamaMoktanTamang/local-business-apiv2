import { Router } from "express";
import { validateSchema } from "@/middlewres/validateSchema.middleware";
import { BusinessController } from "@/controller/business.controller";
import { registerBusinessSchema } from "@/schemas/business.schema";
import authMiddleware from "@/middlewres/auth.middleware";
import { upload } from "@/middlewres/upload.middleware";

export const businessRouter = Router();

const businessController = new BusinessController();

businessRouter.post(
  "/",
  authMiddleware,
  upload.single("image"),
  validateSchema(registerBusinessSchema),
  businessController.registerBusiness
);
businessRouter.get("/", authMiddleware, businessController.listBusinesses);
