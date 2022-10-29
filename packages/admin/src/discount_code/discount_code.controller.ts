import { isValidObjectId } from 'mongoose';
import {
  Get,
  JsonController,
  BadRequestError,
  NotFoundError,
  QueryParam,
  Authorized,
  Post,
  Body,
  Param,
  Patch,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { DiscountCodeService } from './discount_code.service';
import { CreateDiscountCodeDto } from './dtos/createDiscountCode.dto';

@JsonController('/discount_code')
export class DiscountCodeController {
  private readonly discountCodeService = new DiscountCodeService();

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'get List Discount Code',
  })
  @Authorized(['admin', 'staff'])
  @Get('', { transformResponse: false })
  async getListDiscountCodes(
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
      return this.discountCodeService.getListDiscountCodes(page, limit);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'create Discount code',
  })
  @Post('', { transformResponse: false })
  async createDiscountCode(
    @Body({ required: true }) createDiscountCodeDto: CreateDiscountCodeDto,
  ) {
    await this.discountCodeService.createDiscountCode(createDiscountCodeDto);
    return {
      message: 'Created Successfully',
    };
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get discount code detail',
  })
  @Authorized(['admin', 'staff'])
  @Get('/:discount_code_id', { transformResponse: false })
  async getDiscountCodeDetail(
    @Param('discount_code_id') discount_code_id: string,
  ) {
    try {
      if (!isValidObjectId(discount_code_id))
        throw new BadRequestError('Invalid order_id');
      return this.discountCodeService.getDiscountCodeDetail(discount_code_id);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get discount code detail',
  })
  @Authorized(['admin', 'staff'])
  @Patch('/:discount_code_id', { transformResponse: false })
  async inactivateDiscountCode(
    @Param('discount_code_id') discount_code_id: string,
  ) {
    try {
      if (!isValidObjectId(discount_code_id))
        throw new BadRequestError('Invalid discount_code ObjectID');
      const discountCode = await this.discountCodeService.inactivateDiscountCode(
        discount_code_id,
      );
      if (!discountCode) throw new NotFoundError('Cannot inactivated!');
      return {
        message: 'Inactivated successfully',
      };
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }
}
