import {
  getModelForClass,
  plugin,
  prop,
  DocumentType,
  Ref,
} from '@typegoose/typegoose';
import { Types } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { Category } from '../category/category.model';
import { ProductStatus } from './product-status.enum';

@plugin(mongooseUniqueValidator)
export class Product {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  price: number;

  @prop({ type: Types.ObjectId, ref: () => Category })
  category: Ref<Category>;

  @prop({ type: Types.ObjectId, ref: () => Category }) // TODO
  scent_category: Ref<Category>;

  @prop({ required: true })
  status: ProductStatus;

  @prop({ required: false })
  width: number;

  @prop({ required: false })
  height: number;

  @prop({ required: true })
  mass: number;

  @prop({ required: false })
  description: string;

  @prop({ required: true })
  stock: number;

  @prop({ required: true })
  image: string;
}
export type ProductDocument = DocumentType<Product>;
export const ProductModel = getModelForClass(Product);
