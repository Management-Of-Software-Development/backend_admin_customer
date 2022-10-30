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
import { OrderCommercialProduct } from '../schemas/order-commercial-product';
import { OrderShippingAddress } from '../schemas/shipping-address';

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
  @Type(() => OrderCommercialProduct)
  products: OrderCommercialProduct[];

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  total_product_cost: number;
}
