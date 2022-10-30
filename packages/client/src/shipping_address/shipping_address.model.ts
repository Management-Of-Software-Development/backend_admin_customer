import {
  DocumentType,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { OrderShippingAddress } from '../order/schemas/shipping-address';
import { User } from '../user/user.model';
import { ShippingAddressStatus } from './enums/shipping-address-status.enum';

@modelOptions({
  options: { allowMixed: 1 },
  schemaOptions: { collection: 'shipping_addresses' },
})
export class ShippingAddress {
  @prop({ type: Types.ObjectId, ref: () => User })
  user_id: Ref<User>;

  @prop({ required: true, _id: false })
  address_detail: OrderShippingAddress;

  @prop({ required: true })
  status: ShippingAddressStatus;
}
export type ShippingAddressDocument = DocumentType<ShippingAddress>;
export const ShippingAddressModel = getModelForClass(ShippingAddress);
