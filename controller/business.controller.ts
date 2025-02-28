import { STATUS_CODE, USER_ROLE } from "@/constants";
import { ResponseHelper } from "@/helper/response.helper";
import { AuthRequest } from "@/middlewres/auth.middleware";
import { BusinessService } from "@/services/business.service";
import { Response } from "express";

export class BusinessController {
  private readonly businessService: BusinessService;

  constructor() {
    this.businessService = new BusinessService();
    this.registerBusiness = this.registerBusiness.bind(this);
    this.listBusinesses = this.listBusinesses.bind(this);
    this.deleteBusiness = this.deleteBusiness.bind(this);
    this.editBusiness = this.editBusiness.bind(this);
    this.getbusinessById = this.getbusinessById.bind(this);
    this.listUnverifiedBusinesses = this.listUnverifiedBusinesses.bind(this);
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
    } catch (error) {
      return ResponseHelper.json({
        res,
        errors: error,
        statusCode: STATUS_CODE.SERVER_ERROR,
      });
    }
  }

  async listBusinesses(req: AuthRequest, res: Response) {
    try {
      const { query, userId } = req;
      const { owner } = query;

      const businesses = await this.businessService.find({
        owner,
        ...(owner === userId.toString() ? {} : { isVerified: true }),
      });

      return ResponseHelper.json({ res, data: businesses });
    } catch (error) {
      return ResponseHelper.json({
        res,
        errors: error,
        statusCode: STATUS_CODE.SERVER_ERROR,
      });
    }
  }

  async deleteBusiness(req: AuthRequest, res: Response) {
    try {
      const { userId, params } = req;
      const { businessId } = params;

      const business = await this.businessService.findById(businessId);

      if (!business)
        return ResponseHelper.json({
          res,
          message: "Business not found",
          statusCode: STATUS_CODE.NOT_FOUND,
        });

      if (business.owner.toString() !== userId)
        return ResponseHelper.json({
          res,
          message: "User not allowed to delete this business",
          statusCode: STATUS_CODE.FORBIDDEN,
        });

      await this.businessService.delete({ _id: businessId });

      return ResponseHelper.json({
        res,
        message: "Business Deleted sucessfully!",
      });
    } catch (error) {
      return ResponseHelper.json({
        res,
        errors: error,
        statusCode: STATUS_CODE.SERVER_ERROR,
      });
    }
  }

  async editBusiness(req: AuthRequest, res: Response) {
    try {
      const { userId, params, body } = req;
      const { businessId } = params;

      const business = await this.businessService.findById(businessId);

      if (!business)
        return ResponseHelper.json({
          res,
          message: "Business not found",
          statusCode: STATUS_CODE.NOT_FOUND,
        });

      if (business.owner.toString() !== userId)
        return ResponseHelper.json({
          res,
          message: "User not allowed to edit this business",
          statusCode: STATUS_CODE.FORBIDDEN,
        });

      const { name, description, phone, email, latitude, longitude, address } =
        body;

      const updatedBusiness = await this.businessService.updateById(
        businessId,
        {
          name,
          description,
          phone,
          email,
          owner: userId,
          location: { latitude, longitude },
          address,
          image: (req as any).file ? (req as any).file.path : business.image,
        } as any
      );

      return ResponseHelper.json({ res, data: updatedBusiness });
    } catch (error) {
      return ResponseHelper.json({
        res,
        errors: error,
        statusCode: STATUS_CODE.SERVER_ERROR,
      });
    }
  }

  async getbusinessById(req: AuthRequest, res: Response) {
    try {
      const { userId, params } = req;
      const { businessId } = params;

      const business = await this.businessService.findById(businessId);

      if (
        !business ||
        (!business.isVerified && business.owner.toString() !== userId)
      )
        return ResponseHelper.json({
          res,
          message: "Business not found",
          statusCode: STATUS_CODE.NOT_FOUND,
        });

      return ResponseHelper.json({ res, data: business });
    } catch (error) {
      return ResponseHelper.json({
        res,
        errors: error,
        statusCode: STATUS_CODE.SERVER_ERROR,
      });
    }
  }

  async listUnverifiedBusinesses(req: AuthRequest, res: Response) {
    try {
      const { userRole } = req;

      if (userRole !== USER_ROLE.ADMIN)
        return ResponseHelper.json({
          res,
          message: "User not allowed to list the businesses",
          statusCode: STATUS_CODE.FORBIDDEN,
        });

      const businesss = await this.businessService.find({ isVerified: false });

      return ResponseHelper.json({ res, data: businesss });
    } catch (error) {
      return ResponseHelper.json({
        res,
        errors: error,
        statusCode: STATUS_CODE.SERVER_ERROR,
      });
    }
  }
}
