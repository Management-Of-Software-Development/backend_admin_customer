import { Expose } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
import { Types } from 'mongoose';

export class OrderAppreciationProduct {
  @Expose()
  @IsNotEmpty()
  @IsMongoId()
  product_id: Types.ObjectId;

  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  point: number;

  @Expose()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @Expose()
  @IsUrl()
  image: string;
}
