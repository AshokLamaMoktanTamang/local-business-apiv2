import { Router } from "express";
import { AuthController } from "@/controller/auth.controller";
import { validateSchema } from "@/middlewres/validateSchema.middleware";
import { loginSchema, signupSchema } from "@/schemas/auth.schema";

export const authRouter = Router();

const authController = new AuthController();

authRouter.post("/signup", validateSchema(signupSchema), authController.signUp);
authRouter.post("/login", validateSchema(loginSchema), authController.login);
authRouter.get("/verify", authController.verify);
