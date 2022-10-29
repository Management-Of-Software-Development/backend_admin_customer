import { UserService } from '../user/user.service';
import { ProductRepository } from './product.repository';

export class ProductService {
  private readonly ProductRepository = new ProductRepository();

  private readonly userService = new UserService();

  async getListProducts(
    page: number,
    limit: number,
    status: string,
    category: string,
    scent: string,
  ) {
    return this.ProductRepository.getListProducts(
      page,
      limit,
      status,
      category,
      scent,
    );
  }

  async getProductByID(Product_id: string) {
    return this.ProductRepository.getProductDetailByID(Product_id);
  }
}
