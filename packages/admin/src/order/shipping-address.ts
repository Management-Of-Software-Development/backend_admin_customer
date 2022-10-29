import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';

export class OrderShippingAddress {
  @Expose()
  @prop({ required: true })
  receiver_name: string;

  @Expose()
  @prop({ required: true })
  receiver_phone_number: string;

  @Expose()
  @prop({ required: true })
  city: string;

  @Expose()
  @prop({ required: true })
  district: string;

  @Expose()
  @prop({ required: true })
  ward: string;

  @Expose()
  @prop({ required: true })
  address: string;
}
