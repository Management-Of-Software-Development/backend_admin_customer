import { Expose, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  discountCodeCondition,
  DiscountCodeCondition,
} from '../interfaces/discount_code_condition.interface';
import { AmountType } from '../enums/amount-type.enum';
import { DiscountType } from '../enums/discount-type.enum';

export class CreateDiscountCodeDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  code: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Expose()
  @IsNotEmpty()
  @IsEnum(DiscountType)
  discount_type: DiscountType;

  @Expose()
  @IsNotEmpty()
  @IsEnum(AmountType)
  amount_type: AmountType;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  discount_amount: number;

  @Expose()
  @IsOptional()
  @Type(() => discountCodeCondition)
  @ValidateNested({ each: true })
  customer_applying_condition: DiscountCodeCondition;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Min(0)
  min_order_value: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  total_remaining: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  maximum_apply_time_per_user: number;

  @Expose()
  @IsNotEmpty()
  @IsDateString()
  expired_time: Date;
}
