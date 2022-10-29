import { DiscountCodeRepository } from './discount_code.repository';
import { CreateDiscountCodeDto } from './dtos/createDiscountCode.dto';

export class DiscountCodeService {
  private readonly discountCodeRepository = new DiscountCodeRepository();

  async getListDiscountCodes(page: number, limit: number) {
    return this.discountCodeRepository.listDiscountCodes(page, limit);
  }

  async createDiscountCode(createDiscountCodeDto: CreateDiscountCodeDto) {
    return this.discountCodeRepository.createDiscountCode(
      createDiscountCodeDto,
    );
  }

  async getDiscountCodeDetail(discount_code_id: string) {
    return this.discountCodeRepository.getDiscountCodeDetail(discount_code_id);
  }

  async inactivateDiscountCode(discount_code_id: string) {
    return this.discountCodeRepository.inactivateDiscountCode(discount_code_id);
  }
}
