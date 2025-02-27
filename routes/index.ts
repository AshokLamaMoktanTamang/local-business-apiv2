import { Router } from "express";
import { authRouter } from "./auth.route";
import { userRouter } from "./user.route";
import { businessRouter } from "./business.route";

export const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/user", userRouter);
mainRouter.use("/business", businessRouter);
