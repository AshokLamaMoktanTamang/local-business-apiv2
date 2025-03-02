import { env } from "@/config";
import { INTERACTION_TYPE, STATUS_CODE, USER_ROLE } from "@/constants";
import { ResponseHelper } from "@/helper/response.helper";
import { AuthRequest } from "@/middlewres/auth.middleware";
import { BusinessService } from "@/services/business.service";
import { InteractionService } from "@/services/interaction.service";
import { Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export class BusinessController {
  private readonly businessService: BusinessService;
  private readonly interactionService: InteractionService;

  constructor() {
    this.businessService = new BusinessService();
    this.interactionService = new InteractionService();

    this.registerBusiness = this.registerBusiness.bind(this);
    this.listBusinesses = this.listBusinesses.bind(this);
    this.deleteBusiness = this.deleteBusiness.bind(this);
    this.editBusiness = this.editBusiness.bind(this);
    this.getbusinessById = this.getbusinessById.bind(this);
    this.listUnverifiedBusinesses = this.listUnverifiedBusinesses.bind(this);
    this.verifyBusiness = this.verifyBusiness.bind(this);
    this.listAllverifiedBusiness = this.listAllverifiedBusiness.bind(this);
    this.getBusinessDetail = this.getBusinessDetail.bind(this);
    this.getBusinessAnalytics = this.getBusinessAnalytics.bind(this);
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

  async verifyBusiness(req: AuthRequest, res: Response) {
    try {
      const { userRole, params, body } = req;
      const { businessId } = params;
      const { verify } = body;

      if (userRole !== USER_ROLE.ADMIN)
        return ResponseHelper.json({
          res,
          message: "User not allowed to verify the businesses",
          statusCode: STATUS_CODE.FORBIDDEN,
        });

      const existingBusiness = await this.businessService.findById(businessId);

      if (!existingBusiness.isVerified && !verify) {
        await this.businessService.delete({ _id: businessId });
        return ResponseHelper.json({ res, data: existingBusiness });
      }

      const businesss = await this.businessService.updateById(businessId, {
        isVerified: verify,
      });

      return ResponseHelper.json({ res, data: businesss });
    } catch (error) {
      return ResponseHelper.json({
        res,
        errors: error,
        statusCode: STATUS_CODE.SERVER_ERROR,
      });
    }
  }

  async listAllverifiedBusiness(req: AuthRequest, res: Response) {
    try {
      const businesses = await this.businessService
        .find({ isVerified: true }, undefined, {
          lean: true,
          sort: { createdAt: -1 },
        })
        .populate({ path: "owner", select: "username email" });

      return ResponseHelper.json({ res, data: businesses });
    } catch (error) {
      return ResponseHelper.json({
        res,
        errors: error,
        statusCode: STATUS_CODE.SERVER_ERROR,
      });
    }
  }

  async getBusinessDetail(req: AuthRequest, res: Response) {
    try {
      const { params } = req;
      const { businessId } = params;

      const business = await this.businessService
        .findOne({ isVerified: true, _id: businessId }, undefined, {
          lean: true,
          sort: { createdAt: -1 },
        })
        .populate({ path: "owner", select: "username email" });

      const token = req.header("Authorization")?.split(" ")[1];

      if (token) {
        try {
          const decoded = jwt.verify(token, env.JWT_SECRET);
          const userId = (decoded as JwtPayload)?.id;

          await this.interactionService.create([
            {
              businessId,
              businessOwner: business.owner,
              userId,
              type: INTERACTION_TYPE.VISIT,
            },
          ]);
        } catch (error) {
          console.error(error, "failed to save interaction");
        }
      }

      return ResponseHelper.json({ res, data: business });
    } catch (error) {
      return ResponseHelper.json({
        res,
        errors: error,
        statusCode: STATUS_CODE.SERVER_ERROR,
      });
    }
  }

  async getBusinessAnalytics(req: AuthRequest, res: Response) {
    try {
      const { userId } = req;

      // Find businesses owned by the user
      const businesses = await this.businessService
        .find({ owner: userId, isVerified: true }, "_id name")
        .lean();

      if (!businesses.length) {
        return ResponseHelper.json({
          res,
          data: [],
        });
      }

      const businessIds = businesses.map((b) => b._id);

      // Aggregate interactions for those businesses
      const analytics = await this.interactionService.aggregate([
        { $match: { businessId: { $in: businessIds } } },
        {
          $group: {
            _id: "$businessId",
            interactions: {
              $push: {
                type: "$type",
                count: { $sum: 1 },
              },
            },
          },
        },
        {
          $lookup: {
            from: "businesses",
            localField: "_id",
            foreignField: "_id",
            as: "businessDetails",
          },
        },
        { $unwind: "$businessDetails" },
        {
          $project: {
            businessId: "$_id",
            businessName: "$businessDetails.name",
            interactions: 1,
            _id: 0,
          },
        },
      ]);

      const chartData = businesses.map((business) => {
        const businessAnalytics = analytics.find(
          (a) => a.businessId.toString() === business._id.toString()
        );
        const interactionCounts = {};

        if (businessAnalytics) {
          businessAnalytics.interactions.forEach((interaction) => {
            interactionCounts[interaction.type] =
              (interactionCounts[interaction.type] || 0) + interaction.count;
          });
        }

        return {
          businessName: business.name,
          data: [
            {
              type: INTERACTION_TYPE.COMMENT,
              count: interactionCounts[INTERACTION_TYPE.COMMENT] || 0,
            },
            {
              type: INTERACTION_TYPE.VISIT,
              count: interactionCounts[INTERACTION_TYPE.VISIT] || 0,
            },
          ],
        };
      });

      return ResponseHelper.json({
        res,
        data: chartData,
      });
    } catch (error) {
      return ResponseHelper.json({
        res,
        errors: error,
        statusCode: STATUS_CODE.SERVER_ERROR,
      });
    }
  }
}
