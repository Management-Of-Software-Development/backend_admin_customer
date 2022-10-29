import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class ConfirmDeliveryOrderDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  shipping_unit: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  shipping_cost: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MaxLength(35)
  shipping_code: string;
}
