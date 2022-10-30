import {
  DocumentType,
  getDiscriminatorModelForClass,
  prop,
} from '@typegoose/typegoose';
import { ProductType } from '../product/enums/product-type.enum';
import { Product, ProductModel } from '../product/product.model';

export class AppreciationProduct extends Product {
  @prop({ required: true })
  point: number;
}

export type AppreciationProductDocument = DocumentType<AppreciationProduct>;
export const AppreciationProductModel = getDiscriminatorModelForClass(
  ProductModel,
  AppreciationProduct,
  ProductType.APPRECIATION,
);
