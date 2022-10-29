import { prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class OrderShippingAddress {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @prop({ required: true })
  receiver_name: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @prop({ required: true })
  receiver_phone_number: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @prop({ required: true })
  city: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @prop({ required: true })
  district: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @prop({ required: true })
  ward: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @prop({ required: true })
  address: string;
}
