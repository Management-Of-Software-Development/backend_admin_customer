import { DiscountCodeRepository } from './discount_code.repository';
import { OrderInformationsDto } from './dtos/orderInformations.dto';

export class DiscountCodeService {
  private readonly discountCodeRepository = new DiscountCodeRepository();

  async getListDiscountCodes(user_id: string, page: number, limit: number) {
    return this.discountCodeRepository.listDiscountCodes(user_id, page, limit);
  }

  async getDiscountCodeDetail(discount_code_id: string, user_id: string) {
    return this.discountCodeRepository.getDiscountCodeDetail(
      discount_code_id,
      user_id,
    );
  }

  async getApplyingDiscountAmountOnOrder(
    discount_code: string,
    user_id: string,
    total_product_cost: number,
  ) {
    return this.discountCodeRepository.getApplyingDiscountAmountOnOrder(
      discount_code,
      user_id,
      total_product_cost,
    );
  }

  async applyingDiscountOnOrder(
    discount_code: string,
    user_id: string,
    orderInformationDto: OrderInformationsDto,
  ) {
    return this.discountCodeRepository.applyingDiscountOnOrder(
      discount_code,
      user_id,
      orderInformationDto,
    );
  }
}
