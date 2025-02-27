import { env } from "@/config";
import { STATUS_CODE } from "@/constants";
import { ResponseHelper } from "@/helper/response.helper";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return ResponseHelper.json({
      res,
      message: "Access denied. No token provided.",
      statusCode: STATUS_CODE.UNAUTHORIZED,
    });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.userId = (decoded as JwtPayload)?.id;
    next();
  } catch (error) {
    return ResponseHelper.json({
      res,
      message: "Invalid Token",
      statusCode: STATUS_CODE.UNAUTHORIZED,
    });
  }
};

export default authMiddleware;
