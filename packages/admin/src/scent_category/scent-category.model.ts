import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose';

export class Scent {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  slug: string;

  @prop({ required: true })
  description: string;
}

export type ScentCategoryDocument = DocumentType<Scent>;
export const ScentCategoryModel = getModelForClass(Scent);
