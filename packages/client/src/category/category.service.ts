import { CategoryRepository } from './category.repository';

export class CategoryService {
  private readonly categoryRepository = new CategoryRepository();

  async getAllCategories() {
    return this.categoryRepository.getAllCategories();
  }

  async getCategoryBySlug(slug: string): Promise<string | null> {
    return this.categoryRepository.getCategoryBySlug(slug);
  }
}
