import { IUser, User } from "@/models/user.model";
import { BaseRepository } from "@/repository/base.repository";

export class AdminService extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }
}
