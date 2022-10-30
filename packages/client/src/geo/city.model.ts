import { getModelForClass, prop } from '@typegoose/typegoose';

export class City {
  @prop()
  code: string;

  @prop()
  name: string;

  @prop()
  country_code: string;
}

export const CityModel = getModelForClass(City);
