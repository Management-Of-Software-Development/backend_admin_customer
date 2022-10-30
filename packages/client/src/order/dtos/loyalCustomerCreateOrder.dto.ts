import { Expose, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { OrderAppreciationProduct } from '../schemas/order-appreciation-product';
import { OrderCommercialProduct } from '../schemas/order-commercial-product';
import { OrderShippingAddress } from '../schemas/shipping-address';

export class LoyalCustomerCreateOrderDto {
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
  @ValidateIf((o) => o.gifts === undefined || o.products)
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderCommercialProduct)
  products: OrderCommercialProduct[];

  @Expose()
  @ValidateIf((o) => o.products === undefined || o.gifts)
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderAppreciationProduct)
  gifts: OrderAppreciationProduct[];

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  total_product_cost: number;

  @Expose()
  @IsOptional()
  @IsString()
  discount_code: string;
}
