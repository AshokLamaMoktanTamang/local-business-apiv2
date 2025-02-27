import jwt, { JwtPayload } from "jsonwebtoken";

import { IUser, User } from "@/models/user.model";
import { BaseRepository } from "@/repository/base.repository";
import { env } from "@/config";

export class UserService extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findUserbyEmail(email: string) {
    const user = await this.findOne({ email });

    return user;
  }

  async generateAccessToken(payload: JwtPayload) {
    const token = jwt.sign(payload, env.JWT_SECRET);

    return token;
  }
}
