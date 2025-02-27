import { Router } from "express";
import { UserController } from "@/controller/user.controller";
import authMiddleware from "@/middlewres/auth.middleware";

export const userRouter = Router();

const userController = new UserController();

userRouter.get("/profile", authMiddleware, userController.getUserProfile);
