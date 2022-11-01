import { UserService } from '../user/user.service';
import { AppreciationProductRepository } from './appreciation_product.repository';
import { CreateGiftDto } from './dtos/createGift.dto';
import { UpdateGiftDto } from './dtos/updateGift.dto';

export class AppreciationProductService {
  private readonly appreciationProductRepository = new AppreciationProductRepository();

  private readonly userService = new UserService();

  async getListProducts(
    page: number,
    limit: number,
    category: string,
    scent: string,
    status: string,
  ) {
    return this.appreciationProductRepository.getListProducts(
      page,
      limit,
      category,
      scent,
      status,
    );
  }

  async getProductByID(Product_id: string) {
    return this.appreciationProductRepository.getProductDetailByID(Product_id);
  }

  async updateCommercialProduct(
    commercial_product_id: string,
    updateProductDto: UpdateGiftDto,
  ) {
    return this.appreciationProductRepository.updateCommercialProduct(
      commercial_product_id,
      updateProductDto,
    );
  }

  async createProduct(createProductDto: CreateGiftDto) {
    return this.appreciationProductRepository.createProduct(createProductDto);
  }
}
