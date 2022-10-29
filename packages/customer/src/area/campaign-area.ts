import { prop } from '@typegoose/typegoose';

export class CampaignArea {
  @prop()
  country: string;

  @prop()
  city: string;

  @prop()
  district: string;
}

export const AREA_ALL = 'all';
