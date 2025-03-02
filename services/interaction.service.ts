import { Interaction, IInteraction } from "@/models/interaction.model";
import { BaseRepository } from "@/repository/base.repository";

export class InteractionService extends BaseRepository<IInteraction> {
  constructor() {
    super(Interaction);
  }
}
