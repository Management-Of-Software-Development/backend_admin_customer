import {
  DocumentType,
  getDiscriminatorModelForClass,
  prop,
} from '@typegoose/typegoose';
import { User, UserModel } from '../user/user.model';
import { CustomerRank } from './enums/customer-rank.enum';

export class Customer extends User {
  @prop({ enum: CustomerRank, default: CustomerRank.BRONZE })
  rank: CustomerRank;

  @prop({ required: false, default: 0 })
  point: number;

  @prop({ required: false, default: 0 })
  rank_point: number;
}

export type CustomerDocument = DocumentType<Customer>;
export const CustomerModel = getDiscriminatorModelForClass(
  UserModel,
  Customer,
  'customer',
);
