import { CategoryDocument, CategoryModel } from './category.model';

export class CategoryRepository {
  async getAllCategories(): Promise<CategoryDocument[] | null> {
    return CategoryModel.find().lean();
  }

  async getCategoryBySlug(slug: string): Promise<string | null> {
    const category = await CategoryModel.findOne({ slug }).lean();
    return category?._id;
  }
}
