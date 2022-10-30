import { UserService } from '../user/user.service';
import { CommercialProductRepository } from './commercial_product.repository';

export class CommercialProductService {
  private readonly CommercialProductRepository = new CommercialProductRepository();

  private readonly userService = new UserService();

  async getListProducts(
    page: number,
    limit: number,
    status: string,
    category: string,
    scent: string,
  ) {
    return this.CommercialProductRepository.getListProducts(
      page,
      limit,
      status,
      category,
      scent,
    );
  }

  async getProductByID(Product_id: string) {
    return this.CommercialProductRepository.getProductDetailByID(Product_id);
  }

  
}
