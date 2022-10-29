import { Expose, Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { OrderProduct } from '../order-product';
import { OrderShippingAddress } from '../shipping-address';

export class CreateOrderDto {
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  customer_email: string;

  @Expose()
  @IsNotEmpty()
  @Type(() => OrderShippingAddress)
  shipping_address: OrderShippingAddress;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  payment_method: string;

  @Expose()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderProduct)
  products: OrderProduct[];

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  total_product_cost: number;
}
