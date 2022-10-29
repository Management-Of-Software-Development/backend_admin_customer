import { JsonController, Get } from 'routing-controllers';
import { CategoryService } from './scent-category.service';
@JsonController('/scents')
export class ScentCategoryController {
  private readonly categoryService = new CategoryService();

  @Get('', { transformResponse: false })
  async getAllScentCategories() {
    return this.categoryService.getAllScentCategories();
  }
}
