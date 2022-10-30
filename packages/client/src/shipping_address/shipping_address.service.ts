import { CreateShippingAddressDto } from './dtos/createShippingAddress.dto';
import { UpdateShippingAddressDto } from './dtos/updateShippingAddress.dto';
import { ShippingAddressRepository } from './shipping_address.repository';

export class ShippingAddressService {
  private readonly ShippingAddressRepository = new ShippingAddressRepository();

  async getListShippingAddresss(page: number, limit: number, user_id: string) {
    return this.ShippingAddressRepository.getListShippingAddresss(
      page,
      limit,
      user_id,
    );
  }

  async getShippingAddressByID(shipping_address_id: string, user_id: string) {
    return this.ShippingAddressRepository.getShippingAddressDetailByID(
      shipping_address_id,
      user_id,
    );
  }

  async updateShippingAddress(
    shipping_address_id: string,
    updateShippingAddressDto: UpdateShippingAddressDto,
    user_id: string,
  ) {
    return this.ShippingAddressRepository.updateShippingAddress(
      shipping_address_id,
      updateShippingAddressDto,
      user_id,
    );
  }

  async deleteShippingAddress(shipping_address_id: string, user_id: string) {
    return this.ShippingAddressRepository.deleteShippingAddress(
      shipping_address_id,
      user_id,
    );
  }

  async createShippingAddress(
    createShippingAddressDto: CreateShippingAddressDto,
    user_id: string,
  ) {
    return this.ShippingAddressRepository.createShippingAddress(
      createShippingAddressDto,
      user_id,
    );
  }
}
