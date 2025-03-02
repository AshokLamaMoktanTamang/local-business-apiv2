import { Router } from "express";
import { CommentController } from "@/controller/comment.controller";
import authMiddleware from "@/middlewres/auth.middleware";

export const commentRouter = Router();

const commentController = new CommentController();

commentRouter.post(
  "/business/:businessId",
  authMiddleware,
  commentController.addComment
);
commentRouter.get(
  "/business/:businessId",
  commentController.listBusinessComent
);
