import { UserService } from '../user/user.service';
import { AppreciationProductRepository } from './appreciation_product.repository';

export class AppreciationProductService {
  private readonly appreciationProductRepository = new AppreciationProductRepository();

  private readonly userService = new UserService();

  async getListProducts(
    page: number,
    limit: number,
    category: string,
    scent: string,
  ) {
    return this.appreciationProductRepository.getListProducts(
      page,
      limit,
      category,
      scent,
    );
  }

  async getProductByID(Product_id: string) {
    return this.appreciationProductRepository.getProductDetailByID(Product_id);
  }
}
