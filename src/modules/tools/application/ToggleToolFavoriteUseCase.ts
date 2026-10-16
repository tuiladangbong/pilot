import { ToolRepository } from '../ports/ToolRepository';

export class ToggleToolFavoriteUseCase {
  constructor(private readonly toolRepo: ToolRepository) {}

  async execute(id: string, explicitFavorite?: boolean): Promise<{ id: string; favorite: boolean }> {
    const existing = await this.toolRepo.findById(id);
    if (!existing) {
      throw new Error(`Tool with id "${id}" not found`);
    }

    const newFavorite = explicitFavorite !== undefined ? explicitFavorite : !existing.favorite;
    await this.toolRepo.setFavorite(id, newFavorite);
    return { id, favorite: newFavorite };
  }
}
