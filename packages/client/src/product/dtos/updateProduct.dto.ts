import { Expose } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';
import { Types } from 'mongoose';
import { ProductStatus } from '../enums/product-status.enum';

export class UpdateProductDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  category: Types.ObjectId;

  @Expose()
  @IsNotEmpty()
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @Expose()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  width: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  height: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  mass: number;

  @Expose()
  @IsOptional()
  @IsString()
  description: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  stock: number;

  @Expose()
  @IsOptional()
  @IsUrl()
  image: string;
}
