import { Expose } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  category: string;

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
