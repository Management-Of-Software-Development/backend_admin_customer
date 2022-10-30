import { getModelForClass, prop } from '@typegoose/typegoose';

export class District {
  @prop()
  code: string;

  @prop()
  name: string;

  @prop()
  city_code: string;
}

export const DistrictModel = getModelForClass(District);
