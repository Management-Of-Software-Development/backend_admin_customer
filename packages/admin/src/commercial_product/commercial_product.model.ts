import {
  DocumentType,
  getDiscriminatorModelForClass,
  prop,
} from '@typegoose/typegoose';
import { Product, ProductModel } from '../product/product.model';

export class CommercialProduct extends Product {
  @prop({ required: true })
  price: number;
}

export type CommercialProductDocument = DocumentType<CommercialProduct>;
export const CommercialProductModel = getDiscriminatorModelForClass(
  ProductModel,
  CommercialProduct,
  'commercial',
);
