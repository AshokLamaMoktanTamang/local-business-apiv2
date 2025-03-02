import { Comment, IComment } from "@/models/comment.model";
import { BaseRepository } from "@/repository/base.repository";

export class CommentService extends BaseRepository<IComment> {
  constructor() {
    super(Comment);
  }
}
