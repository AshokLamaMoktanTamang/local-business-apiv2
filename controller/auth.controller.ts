import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import { STATUS_CODE } from "@/constants";
import MailService from "@/helper/email.helper";
import { UserService } from "@/services/user.service";
import { ResponseHelper } from "@/helper/response.helper";
import { emailVerificationTemplate } from "@/emailTemplates/emailVerification";
import { env } from "@/config";
export class AuthController {
  private readonly userService: UserService;
  private readonly mailService: MailService;

  constructor() {
    this.userService = new UserService();
    this.mailService = new MailService();
    this.signUp = this.signUp.bind(this);
    this.login = this.login.bind(this);
    this.verify = this.verify.bind(this);
  }

  async signUp({ body }: Request, res: Response) {
    try {
      const { email, username } = body;

      const existingUser = await this.userService.findUserbyEmail(email);

      if (existingUser) {
        return ResponseHelper.json({
          res,
          statusCode: STATUS_CODE.BAD_REQUEST,
          message: "User with email already exist",
        });
      }

      const newUser = await this.userService.create(body);

      const token = jwt.sign((newUser as any).toJSON(), env.JWT_SECRET);

      this.mailService.sendMail({
        email,
        html: emailVerificationTemplate(
          username,
          env.BASE_URL + "/auth/verify?token=" + token
        ),
        subject: "Verify email",
      });

      return ResponseHelper.json({
        res,
        statusCode: STATUS_CODE.CREATED,
        data: newUser,
      });
    } catch (error) {
      return ResponseHelper.json({
        res,
        errors: error,
        statusCode: STATUS_CODE.SERVER_ERROR,
      });
    }
  }

  async login({ body }: Request, res: Response) {
    try {
      const { email, password } = body;

      const existingUser = await this.userService.findUserbyEmail(email);

      if (!existingUser || !existingUser.isVerified) {
        return ResponseHelper.json({
          res,
          statusCode: STATUS_CODE.UNAUTHORIZED,
          message: !existingUser.isVerified
            ? "User not verified"
            : "Invalid Credentials",
        });
      }

      const isPasswordCorrect = await existingUser.comparePassword(password);

      if (!isPasswordCorrect) {
        return ResponseHelper.json({
          res,
          statusCode: STATUS_CODE.UNAUTHORIZED,
          message: "Invalid Credentials",
        });
      }

      const token = await this.userService.generateAccessToken({
        id: existingUser?.toJSON()?.id,
      });

      return ResponseHelper.json({
        res,
        statusCode: STATUS_CODE.CREATED,
        data: {
          token,
        },
      });
    } catch (error) {
      return ResponseHelper.json({
        res,
        errors: error,
        statusCode: STATUS_CODE.SERVER_ERROR,
      });
    }
  }

  async verify({ query }: Request, res: Response) {
    try {
      const { token } = query;

      const decodedToken = jwt.verify(token.toString(), env.JWT_SECRET);

      if (!decodedToken) {
        return ResponseHelper.json({
          res,
          statusCode: STATUS_CODE.BAD_REQUEST,
          message: "Token expired or invalid",
        });
      }

      const { isVerified, id } = (decodedToken as Record<any, any>) || {};

      if (!isVerified) {
        await this.userService.updateById(id, { isVerified: true });
      }

      return res.redirect(`${env.FRONTEND_BASE_URL}`);
    } catch (error) {
      return ResponseHelper.json({
        res,
        errors: error,
        statusCode: STATUS_CODE.SERVER_ERROR,
      });
    }
  }
}
