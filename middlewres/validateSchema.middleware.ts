import Joi, { PartialSchemaMap } from "joi";
import { NextFunction, Request, Response } from "express";

import { STATUS_CODE } from "@/constants";
import { ResponseHelper } from "@/helper/response.helper";

export const validateSchema = (schema: PartialSchemaMap<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { body } = req;
      const validated = await Joi.object(schema).validateAsync(body);

      req.body = validated;
      next();
    } catch (err) {
      if ((err as any).isJoi)
        return ResponseHelper.json({
          res,
          errors: err,
          message: err?.message || "Invalid Request body!",
          statusCode: STATUS_CODE.BAD_REQUEST,
        });

      return ResponseHelper.json({
        res,
        errors: err,
        message: "Invalid Request body!",
        statusCode: STATUS_CODE.SERVER_ERROR,
      });
    }
  };
};
