import { Chat, IChat } from "@/models/chat.model";
import { BaseRepository } from "@/repository/base.repository";

export class ChatService extends BaseRepository<IChat> {
  constructor() {
    super(Chat);
  }
}
