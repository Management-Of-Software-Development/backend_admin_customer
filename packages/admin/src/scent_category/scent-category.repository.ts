import {
  ScentCategoryDocument,
  ScentCategoryModel,
} from './scent-category.model';

export class ScentCategoryRepository {
  async getAllScentCategories(): Promise<ScentCategoryDocument[] | null> {
    return ScentCategoryModel.find().lean();
  }

  async getScentCategoryBySlug(slug: string): Promise<string | null> {
    const category = await ScentCategoryModel.findOne({ slug }).lean();
    return category?._id;
  }
}
