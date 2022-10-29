import {
  DocumentType,
  getDiscriminatorModelForClass,
  prop,
} from '@typegoose/typegoose';
import { User, UserModel } from '../user/user.model';
import { CustomerRank } from './customer-rank.enum';

export class Customer extends User {
  @prop({ enum: CustomerRank })
  rank: CustomerRank;

  @prop({ required: false, default: 0 })
  point: number;
}

export type CustomerDocument = DocumentType<Customer>;
export const CustomerModel = getDiscriminatorModelForClass(
  UserModel,
  Customer,
  'customer',
);
