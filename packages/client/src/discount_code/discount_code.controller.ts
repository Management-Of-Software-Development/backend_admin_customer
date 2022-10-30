import { isValidObjectId } from 'mongoose';
import {
  Get,
  JsonController,
  BadRequestError,
  NotFoundError,
  QueryParam,
  Authorized,
  Param,
  CurrentUser,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { UserDocument } from '../user/user.model';
import { DiscountCodeService } from './discount_code.service';

@JsonController('/discount_code')
export class DiscountCodeController {
  private readonly discountCodeService = new DiscountCodeService();

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'get List Discount Code',
  })
  @Authorized(['customer'])
  @Get('', { transformResponse: false })
  async getListDiscountCodes(
    @CurrentUser({ required: true }) user: UserDocument,
    @QueryParam('page')
    page: number,
    @QueryParam('limit')
    limit: number,
  ) {
    try {
      if (!page || !limit)
        throw new BadRequestError(
          'The page and limit must be specified and must be a valid number',
        );
      return this.discountCodeService.getListDiscountCodes(
        user._id,
        page,
        limit,
      );
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get discount code detail',
  })
  @Authorized(['customer'])
  @Get('/details/:discount_code_id', { transformResponse: false })
  async getDiscountCodeDetail(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param('discount_code_id') discount_code_id: string,
  ) {
    try {
      if (!isValidObjectId(discount_code_id))
        throw new BadRequestError('Invalid order_id');
      return this.discountCodeService.getDiscountCodeDetail(
        discount_code_id,
        user._id,
      );
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description:
      'Get discount code amount when applying, param is code field, not objectId',
  })
  @Authorized(['customer'])
  @Get('/tryApplying/:discount_code', { transformResponse: false })
  async getApplyingDiscountAmountOnOrder(
    @CurrentUser({ required: true }) user: UserDocument,
    @Param('discount_code') discount_code: string,
    @QueryParam('total_product_cost') total_product_cost: string,
  ) {
    try {
      if (!total_product_cost || Number(total_product_cost) < 0) {
        throw new BadRequestError(
          'total_product_cost is required and must be >=0',
        );
      }
      return this.discountCodeService.getApplyingDiscountAmountOnOrder(
        discount_code,
        user._id,
        Number(total_product_cost),
      );
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }
}
