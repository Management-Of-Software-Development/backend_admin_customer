import { Expose } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export class OrderInformationsDto {
  @Expose()
  @IsNumber()
  @IsPositive()
  total_product_cost: number;
}
