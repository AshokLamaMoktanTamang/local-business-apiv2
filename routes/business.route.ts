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
businessRouter.delete(
  "/:businessId",
  authMiddleware,
  businessController.deleteBusiness
);
businessRouter.patch(
  "/:businessId",
  authMiddleware,
  upload.single("image"),
  businessController.editBusiness
);
businessRouter.get(
  "/:businessId",
  authMiddleware,
  businessController.getbusinessById
);
businessRouter.get(
  "/list/unverified",
  authMiddleware,
  businessController.listUnverifiedBusinesses
);
businessRouter.post(
  "/:businessId/verify",
  authMiddleware,
  businessController.verifyBusiness
);
businessRouter.get(
  "/list/verified",
  businessController.listAllverifiedBusiness
);
businessRouter.get("/detail/:businessId", businessController.getBusinessDetail);
businessRouter.get(
  "/v1/detail/analytics",
  authMiddleware,
  businessController.getBusinessAnalytics
);
