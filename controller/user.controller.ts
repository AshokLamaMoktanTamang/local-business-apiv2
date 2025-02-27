import { STATUS_CODE } from "@/constants";
import { ResponseHelper } from "@/helper/response.helper";
import { AuthRequest } from "@/middlewres/auth.middleware";
import { UserService } from "@/services/user.service";
import { Response } from "express";

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
    this.getUserProfile = this.getUserProfile.bind(this);
  }

  async getUserProfile(req: AuthRequest, res: Response) {
    try {
      const { userId } = req;
      const user = (await this.userService.findById(userId))?.toJSON();
      if (!user) {
        return ResponseHelper.json({
          res,
          statusCode: STATUS_CODE.NOT_FOUND,
          message: "User not found",
        });
      }

      return ResponseHelper.json({ res, data: user });
    } catch (error) {}
    return ResponseHelper.json({
      res,
      statusCode: STATUS_CODE.SERVER_ERROR,
    });
  }
}
