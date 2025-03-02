import { Business, IBusiness } from "@/models/business.model";
import { BaseRepository } from "@/repository/base.repository";

export class BusinessService extends BaseRepository<IBusiness> {
  constructor() {
    super(Business);
  }
}
