import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { OrderShippingAddress } from '../../order/schemas/shipping-address';

export class CreateShippingAddressDto {
  @Expose()
  @IsNotEmpty()
  @Type(() => OrderShippingAddress)
  address_detail: OrderShippingAddress;
}
