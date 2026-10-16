import { PromptRepository } from '../ports/PromptRepository';

export class TogglePromptFavoriteUseCase {
  constructor(private readonly promptRepo: PromptRepository) {}

  async execute(id: string, explicitFavorite?: boolean): Promise<{ id: string; favorite: boolean }> {
    const existing = await this.promptRepo.findById(id);
    if (!existing) {
      throw new Error(`Prompt with id "${id}" not found`);
    }

    const newFavorite = explicitFavorite !== undefined ? explicitFavorite : !existing.favorite;
    await this.promptRepo.setFavorite(id, newFavorite);
    return { id, favorite: newFavorite };
  }
}
