import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose';

export class Category {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  slug: string;

  @prop({ required: true })
  description: string;
}

export type CategoryDocument = DocumentType<Category>;
export const CategoryModel = getModelForClass(Category);
