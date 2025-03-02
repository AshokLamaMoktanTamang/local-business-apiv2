import { STATUS_CODE } from "@/constants";
import { ResponseHelper } from "@/helper/response.helper";
import { AuthRequest } from "@/middlewres/auth.middleware";
import { BusinessService } from "@/services/business.service";
import { ChatService } from "@/services/chat.service";
import { Response } from "express";
import { Types } from "mongoose";

export class ChatController {
  private readonly chatService: ChatService;
  private readonly businessService: BusinessService;

  constructor() {
    this.chatService = new ChatService();
    this.businessService = new BusinessService();

    this.getAllChat = this.getAllChat.bind(this);
    this.getMessageOfBusiness = this.getMessageOfBusiness.bind(this);
  }

  async getAllChat(req: AuthRequest, res: Response) {
    try {
      const { userId, params } = req;
      const { receiverId, businessId } = params;

      const chats = await this.chatService.find({
        $or: [
          {
            senderId: new Types.ObjectId(userId),
            recieverId: new Types.ObjectId(receiverId),
            businessId: new Types.ObjectId(businessId),
          },
          {
            senderId: new Types.ObjectId(receiverId),
            recieverId: new Types.ObjectId(userId),
            businessId: new Types.ObjectId(businessId),
          },
        ],
      });

      return ResponseHelper.json({ res, data: chats });
    } catch (error) {
      return ResponseHelper.json({
        res,
        errors: error,
        statusCode: STATUS_CODE.SERVER_ERROR,
      });
    }
  }

  async getMessageOfBusiness(req: AuthRequest, res: Response) {
    try {
      const { params } = req;
      const { businessId } = params;

      const business = await this.businessService.findById(businessId);
      const chatHeads = await this.chatService.aggregate([
        {
          $match: {
            businessId: new Types.ObjectId(businessId),
            senderId: { $ne: new Types.ObjectId(business.owner) },
          },
        },
        {
          $group: {
            _id: "$senderId",
            sender: { $first: "$senderId" },
            message: { $last: "$message" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "sender",
            foreignField: "_id",
            as: "result",
            pipeline: [{ $project: { username: 1, email: 1 } }],
          },
        },
        {
          $project: {
            sender: { $arrayElemAt: ["$result", 0] },
            message: 1,
          },
        },
      ]);

      return ResponseHelper.json({ res, data: chatHeads });
    } catch (error) {
      return ResponseHelper.json({
        res,
        errors: error,
        statusCode: STATUS_CODE.SERVER_ERROR,
      });
    }
  }
}
