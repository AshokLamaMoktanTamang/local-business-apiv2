import { STATUS_CODE } from "@/constants";
import { ResponseHelper } from "@/helper/response.helper";
import { AuthRequest } from "@/middlewres/auth.middleware";
import { BusinessService } from "@/services/business.service";
import { Response } from "express";

export class BusinessController {
  private readonly businessService: BusinessService;

  constructor() {
    this.businessService = new BusinessService();
    this.registerBusiness = this.registerBusiness.bind(this);
  }

  async registerBusiness(req: AuthRequest, res: Response) {
    try {
      const { userId, body } = req;
      const { name, description, phone, email, latitude, longitude, address } =
        body;

      const business = await this.businessService.create({
        name,
        description,
        phone,
        email,
        owner: userId,
        location: { latitude, longitude },
        address,
        image: (req as any).file.path,
      } as any);

      return ResponseHelper.json({ res, data: business });
    } catch (error) {}
    return ResponseHelper.json({
      res,
      statusCode: STATUS_CODE.SERVER_ERROR,
    });
  }
}
