import { INTERACTION_TYPE, STATUS_CODE } from "@/constants";
import { ResponseHelper } from "@/helper/response.helper";
import { AuthRequest } from "@/middlewres/auth.middleware";
import { BusinessService } from "@/services/business.service";
import { CommentService } from "@/services/comment.service";
import { InteractionService } from "@/services/interaction.service";
import { Response } from "express";

export class CommentController {
  private readonly commentService: CommentService;
  private readonly businessService: BusinessService;
  private readonly interactionService: InteractionService;

  constructor() {
    this.commentService = new CommentService();
    this.businessService = new BusinessService();
    this.interactionService = new InteractionService();

    this.addComment = this.addComment.bind(this);
    this.listBusinessComent = this.listBusinessComent.bind(this);
  }

  async addComment(req: AuthRequest, res: Response) {
    try {
      const { userId, body, params } = req;
      const { content } = body;
      const { businessId } = params;

      const business = await this.businessService.findById(businessId);

      if (!business.isVerified) {
        return ResponseHelper.json({
          res,
          statusCode: STATUS_CODE.BAD_REQUEST,
          message: "Business is not verified yet",
        });
      }

      const [comment] = await Promise.all([
        this.commentService.create([
          { content, userId, businessId, businessOwner: business.owner },
        ]),
        this.interactionService.create([
          {
            businessId,
            businessOwner: business.owner,
            userId,
            type: INTERACTION_TYPE.COMMENT,
          },
        ]),
      ]);

      return ResponseHelper.json({ res, data: comment });
    } catch (error) {
      return ResponseHelper.json({
        res,
        errors: error,
        statusCode: STATUS_CODE.SERVER_ERROR,
      });
    }
  }

  async listBusinessComent(req: AuthRequest, res: Response) {
    try {
      const { params } = req;
      const { businessId } = params;

      const business = await this.businessService.findById(businessId);

      if (!business.isVerified) {
        return ResponseHelper.json({
          res,
          statusCode: STATUS_CODE.BAD_REQUEST,
          message: "Business is not verified yet",
        });
      }

      const comments = await this.commentService
        .find({ businessId })
        .populate({ path: "userId", select: "username email" });

      return ResponseHelper.json({ res, data: comments });
    } catch (error) {
      return ResponseHelper.json({
        res,
        errors: error,
        statusCode: STATUS_CODE.SERVER_ERROR,
      });
    }
  }
}
