import { Router } from "express";
import authMiddleware from "@/middlewres/auth.middleware";
import { ChatController } from "@/controller/chat.controller";

export const chatRouter = Router();

const chatController = new ChatController();

chatRouter.get(
  "/business/:businessId/:receiverId",
  authMiddleware,
  chatController.getAllChat
);
chatRouter.get(
  "/business/:businessId",
  authMiddleware,
  chatController.getMessageOfBusiness
);
