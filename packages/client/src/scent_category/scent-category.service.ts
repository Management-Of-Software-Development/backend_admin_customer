import { ScentCategoryRepository } from './scent-category.repository';

export class CategoryService {
  private readonly scentCategoryRepository = new ScentCategoryRepository();

  async getAllScentCategories() {
    return this.scentCategoryRepository.getAllScentCategories();
  }

  async getScentCategoryBySlug(slug: string): Promise<string | null> {
    return this.scentCategoryRepository.getScentCategoryBySlug(slug);
  }
}
