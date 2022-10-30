import { getModelForClass, prop } from '@typegoose/typegoose';

export class Country {
  @prop()
  name: string;

  @prop()
  en_name: string;

  @prop()
  code: string;
}

export const CountryModel = getModelForClass(Country);
