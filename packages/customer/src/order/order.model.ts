import {
  getModelForClass,
  prop,
  DocumentType,
  Ref,
  modelOptions,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { User } from '../user/user.model';
import { OrderProduct } from './order-product';
import { OrderStatus } from './order-status.enum';
import { OrderShippingAddress } from './shipping-address';

@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: 'create_time',
    },
  },
})
export class Order {
  @prop({ required: true })
  order_id: string;

  @prop({ type: Types.ObjectId, ref: () => User })
  user_id: Ref<User>;

  @prop({ required: true })
  customer_email: string;

  @prop({ _id: false })
  shipping_address: OrderShippingAddress;

  @prop({ required: true })
  payment_method: string;

  @prop({ required: true, _id: false })
  products: OrderProduct[];

  @prop({ required: true })
  total_product_cost: number;

  @prop({ required: false, default: 0 })
  discount: number;

  @prop({ required: false })
  shipping_unit: string;

  @prop({ required: false })
  shipping_cost: number;

  @prop({ required: false })
  shipping_code: string;

  @prop({ required: true, enum: OrderStatus })
  status: OrderStatus;

  @prop({ required: false })
  create_time: Date;
}
export type Order_Document = DocumentType<Order>;
export const OrderModel = getModelForClass(Order);
