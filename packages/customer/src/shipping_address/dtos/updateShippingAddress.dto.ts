import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { OrderShippingAddress } from '../../order/shipping-address';

export class UpdateShippingAddressDto {
  @Expose()
  @IsNotEmpty()
  @Type(() => OrderShippingAddress)
  address_detail: OrderShippingAddress;
}
