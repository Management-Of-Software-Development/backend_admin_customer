import { NotFoundError } from 'routing-controllers';
import { CreateShippingAddressDto } from './dtos/createShippingAddress.dto';
import { UpdateShippingAddressDto } from './dtos/updateShippingAddress.dto';
import {
  ShippingAddressModel,
  ShippingAddressDocument,
} from './shipping_address.model';
import { ShippingAddressStatus } from './enums/shipping-address-status.enum';
import { OrderShippingAddress } from '../order/shipping-address';

export class ShippingAddressRepository {
  async getListShippingAddresss(page: number, limit: number, user_id: string) {
    let aggregation = ShippingAddressModel.aggregate().match({
      user_id,
      status: ShippingAddressStatus.ACTIVE,
    });
    aggregation = aggregation
      .facet({
        paginationInfo: [
          {
            $count: 'total',
          },
          {
            $addFields: {
              page,
              limit,
            },
          },
        ],
        data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
      })
      .unwind('paginationInfo');
    aggregation.unwind('$paginationInfo');
    const [results] = await aggregation.exec();
    if (!results) return null;
    return results;
  }

  async getShippingAddressDetailByID(
    shipping_address_id: string,
    user_id: string,
  ): Promise<ShippingAddressDocument> {
    const shipping_address_info = await ShippingAddressModel.findOne({
      _id: shipping_address_id,
      user_id,

      status: ShippingAddressStatus.ACTIVE,
    })
      .populate('category')
      .exec();
    if (!shipping_address_info) {
      throw new NotFoundError('This ShippingAddress  does not exist !');
    }
    return shipping_address_info;
  }

  async createShippingAddress(
    createShippingAddressDto: CreateShippingAddressDto,
    user_id: string,
  ) {
    await ShippingAddressModel.create({
      ...createShippingAddressDto,
      user_id,
      status: ShippingAddressStatus.ACTIVE,
    });
  }

  async updateShippingAddress(
    shipping_address_id: string,
    updateShippingAddressDto: UpdateShippingAddressDto,
    user_id: string,
  ) {
    const updatedShippingAddress = await ShippingAddressModel.findOneAndUpdate(
      {
        _id: shipping_address_id,
        user_id,
        status: ShippingAddressStatus.ACTIVE,
      },
      { address_detail: { ...updateShippingAddressDto.address_detail } },
      {
        new: true,
      },
    );
    return updatedShippingAddress;
  }

  async deleteShippingAddress(shipping_address_id: string, user_id: string) {
    const updatedShippingAddress = await ShippingAddressModel.findOneAndUpdate(
      {
        _id: shipping_address_id,
        status: ShippingAddressStatus.ACTIVE,
        user_id,
      },
      { status: ShippingAddressStatus.DELETED },
      {
        new: true,
      },
    );
    return updatedShippingAddress;
  }
}
