/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { BadRequestError } from 'routing-controllers';
import { DiscountCodeModel } from './discount_code.model';
import { OrderInformationsDto } from './dtos/orderInformations.dto';
import { AmountType } from './enums/amount-type.enum';

export class DiscountCodeRepository {
  async listDiscountCodes(user_id: string, page: number, limit: number) {
    const query = {
      'applied_user.user_id': user_id,
      'applied_user.remaining': { $gt: 0 },
      expired_time: { $gt: new Date() },
      total_remaining: { $gt: 0 },
    };
    const discountCodes = await DiscountCodeModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .select({
        name: 1,
        code: 1,
        min_order_value: 1,
        description: 1,
        total_remaining: 1,
        expired_time: 1,
        applied_user: {
          $filter: {
            input: '$applied_user',
            as: 'out',
            cond: { $eq: ['$$out.user_id', user_id] },
          },
        },
      })
      .lean();
    const numberOfDiscountCodes = await DiscountCodeModel.countDocuments(query);
    return {
      paginationInfo: {
        page,
        limit,
        total: numberOfDiscountCodes,
      },
      data: discountCodes,
    };
  }

  async getDiscountCodeDetail(discount_code_id: string, user_id: string) {
    return DiscountCodeModel.findOne({
      _id: discount_code_id,
      'applied_user.user_id': user_id,
      'applied_user.remaining': { $gt: 0 },
      expired_time: { $gt: new Date() },
      total_remaining: { $gt: 0 },
    })
      .select({
        name: 1,
        code: 1,
        min_order_value: 1,
        description: 1,
        total_remaining: 1,
        expired_time: 1,
        applied_user: {
          $filter: {
            input: '$applied_user',
            as: 'out',
            cond: { $eq: ['$$out.user_id', user_id] },
          },
        },
      })
      .lean();
  }

  async getApplyingDiscountAmountOnOrder(
    discount_code: string,
    user_id: string,
    total_product_cost: number,
  ): Promise<string> {
    const orderValue = total_product_cost;
    const discountCode = await DiscountCodeModel.findOne({
      code: discount_code,
      'applied_user.user_id': user_id,
      'applied_user.remaining': { $gt: 0 },
      expired_time: { $gt: new Date() },
      total_remaining: { $gt: 0 },
    }).lean();
    if (!discountCode)
      throw new BadRequestError(
        'Cannot apply this discount code : Already expired or reached maximum',
      );
    if (orderValue < discountCode.min_order_value) {
      throw new BadRequestError(
        "The order value didn't reach the required minimum order value",
      );
    }
    if (discountCode.amount_type === AmountType.DIRECT) {
      return orderValue > discountCode.discount_amount
        ? discountCode.discount_amount.toString()
        : orderValue.toString();
    }
    if (discountCode.amount_type === AmountType.PERCENT) {
      return ((orderValue * discountCode.discount_amount) / 100).toString();
    }
    return '0';
  }

  async applyingDiscountOnOrder(
    discount_code: string,
    user_id: string,
    orderInformationDto: OrderInformationsDto,
  ): Promise<string> {
    const orderValue = orderInformationDto.total_product_cost;
    const query = {
      code: discount_code,
      'applied_user.user_id': user_id,
      'applied_user.remaining': { $gt: 0 },
      expired_time: { $gt: new Date() },
      total_remaining: { $gt: 0 },
    };
    const discountCode = await DiscountCodeModel.findOne(query).select({
      applied_user: 1,
      min_order_value: 1,
      amount_type: 1,
      discount_type: 1,
      discount_amount: 1,
      total_remaining: 1,
    });
    if (!discountCode)
      throw new BadRequestError(
        'Cannot apply this discount code : Already expired or reached maximum',
      );
    if (orderValue < discountCode.min_order_value) {
      throw new BadRequestError(
        "The order value didn't reach the required minimum order value",
      );
    }
    const indexOfUserInDiscountCodeAppliedUsers: number = discountCode.applied_user.findIndex(
      (object) => {
        return object.user_id.toString() === user_id.toString();
      },
    );
    const newAppliedUserArray = discountCode.applied_user;
    newAppliedUserArray[indexOfUserInDiscountCodeAppliedUsers].remaining -= 1;
    await DiscountCodeModel.updateOne(query, {
      $inc: {
        total_remaining: -1,
      },
      applied_user: newAppliedUserArray,
    });
    if (discountCode.amount_type === AmountType.DIRECT) {
      return orderValue > discountCode.discount_amount
        ? discountCode.discount_amount.toString()
        : orderValue.toString();
    }
    if (discountCode.amount_type === AmountType.PERCENT) {
      return ((orderValue * discountCode.discount_amount) / 100).toString();
    }
    return '0';
  }
}
