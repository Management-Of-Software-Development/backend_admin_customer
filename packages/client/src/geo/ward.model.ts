import { getModelForClass, prop } from '@typegoose/typegoose';

export class Ward {
  @prop()
  code: string;

  @prop()
  name: string;

  @prop()
  district_code: string;
}

export const WardModel = getModelForClass(Ward);
