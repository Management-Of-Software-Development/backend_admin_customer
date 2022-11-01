import { UserService } from '../user/user.service';
import { CreateProductDto } from './dtos/createProduct.dto';
import { UpdateProductDto } from './dtos/updateProduct.dto';
import { ProductRepository as CommercialProductRepository } from './commercial_product.repository';
import { ConvertCommercialToGiftProductDto } from './dtos/convertCommercialToGiftProduct.dto';

export class CommercialProductService {
  private readonly commercialProductRepository = new CommercialProductRepository();

  private readonly userService = new UserService();

  async getListProducts(
    page: number,
    limit: number,
    status: string,
    category: string,
    scent: string,
  ) {
    return this.commercialProductRepository.getListCommercialProducts(
      page,
      limit,
      status,
      category,
      scent,
    );
  }

  async getCommercialProductByID(commercial_product_id: string) {
    return this.commercialProductRepository.getProductDetailByID(
      commercial_product_id,
    );
  }

  async updateCommercialProduct(
    commercial_product_id: string,
    updateProductDto: UpdateProductDto,
  ) {
    return this.commercialProductRepository.updateCommercialProduct(
      commercial_product_id,
      updateProductDto,
    );
  }

  async createProduct(createProductDto: CreateProductDto) {
    return this.commercialProductRepository.createProduct(createProductDto);
  }

  async convertCommercialToGiftProduct(
    product_id: string,
    convertGiftDto: ConvertCommercialToGiftProductDto,
  ) {
    return this.commercialProductRepository.convertCommercialToGiftProduct(
      product_id,
      convertGiftDto,
    );
  }
}
