import { Response } from "express";
import { STATUS_CODE, ERROR_MESSAGE } from "@/constants";

export class ResponseHelper {
  static json<T>(response: {
    res: Response;
    message?: string;
    data?: T;
    metadata?: Record<string, any>;
    statusCode?: number;
    errors?: any;
  }) {
    const { res, data, errors, message, metadata, statusCode = 200 } = response;
    res.status(statusCode).json({
      success: !(statusCode >= 400),
      message:
        statusCode === STATUS_CODE.SERVER_ERROR
          ? ERROR_MESSAGE.SERVER_ERROR
          : message,
      data,
      metadata: metadata || null,
      statusCode,
      errors,
    });
  }
}
