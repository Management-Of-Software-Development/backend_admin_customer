/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { BadRequestError } from 'routing-controllers';
import { Types } from 'mongoose';
import { DiscountCodeModel } from './discount_code.model';
import { DiscountCodeCondition } from './interfaces/discount_code_condition.interface';
import { CreateDiscountCodeDto } from './dtos/createDiscountCode.dto';
import { CustomerModel } from '../customer/customer.model';

export class DiscountCodeRepository {
  async listDiscountCodes(page: number, limit: number) {
    const discountCodes = await DiscountCodeModel.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    const numberOfDiscountCodes = await DiscountCodeModel.estimatedDocumentCount();
    return {
      paginationInfo: {
        page,
        limit,
        total: numberOfDiscountCodes,
      },
      data: discountCodes,
    };
  }

  async createDiscountCode(createDiscountCodeDto: CreateDiscountCodeDto) {
    const create_time = new Date();
    let conditionToSaved;
    let userQuery;
    if (createDiscountCodeDto.customer_applying_condition) {
      conditionToSaved = JSON.stringify(
        createDiscountCodeDto.customer_applying_condition,
      );
      userQuery = await this.conditionDecoder(
        createDiscountCodeDto.customer_applying_condition,
      );
    }
    let users: any = await CustomerModel.find(userQuery).lean();
    if (!users)
      throw new BadRequestError('Found 0 users match your condition !');
    users = users.map((x) => x._id.toString());
    users = [...new Set(users.map((x) => x.toString()))];
    const newDiscountCode = new DiscountCodeModel({
      ...createDiscountCodeDto,
      customer_applying_condition: conditionToSaved,
      create_time,
    });
    for (const x of users) {
      newDiscountCode.applied_user.push({
        user_id: Types.ObjectId(x),
        remaining: createDiscountCodeDto.maximum_apply_time_per_user,
      });
    }
    await newDiscountCode.save();
  }

  private async conditionDecoder(objectToDecode: DiscountCodeCondition) {
    for (const x of objectToDecode) {
      for (const y of x) {
        const newY = {};
        const newKey = y.object;
        switch (y.condition) {
          case 'greater than': {
            newY[newKey] = {
              $gt: y.value,
            };
            break;
          }
          case 'greater than or equal': {
            newY[newKey] = {
              $gte: y.value,
            };
            break;
          }
          case 'less than': {
            newY[newKey] = {
              $lt: y.value,
            };
            break;
          }
          case 'less than or equal': {
            newY[newKey] = {
              $lte: y.value,
            };
            break;
          }
          case 'not equal': {
            newY[newKey] = {
              $ne: y.value,
            };
            break;
          }
          default: {
            newY[newKey] = y.value;
            break;
          }
        }
        // eslint-disable-next-line guard-for-in
        for (const member in y) delete y[member];
        Object.assign(y, newY);
      }
    }
    const resultArray = objectToDecode.map((x) => {
      return {
        $and: x,
      };
    });
    const result = {};
    // eslint-disable-next-line dot-notation
    result['$or'] = resultArray;
    return result;
  }

  async getDiscountCodeDetail(discount_code_id: string) {
    return DiscountCodeModel.findOne({ _id: discount_code_id }).lean();
  }

  async inactivateDiscountCode(discount_code_id: string) {
    return DiscountCodeModel.findOneAndUpdate(
      { _id: discount_code_id },
      {
        total_remaining: 0,
        expired_time: new Date(),
      },
    ).lean();
  }
}
