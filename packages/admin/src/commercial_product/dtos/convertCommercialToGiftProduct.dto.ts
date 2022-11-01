import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class ConvertCommercialToGiftProductDto {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  point: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  number_to_convert: number;
}
