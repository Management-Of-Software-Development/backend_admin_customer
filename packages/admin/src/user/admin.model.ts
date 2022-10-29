import {
  DocumentType,
  getDiscriminatorModelForClass,
} from '@typegoose/typegoose';
import { User, UserModel } from './user.model';

export class Admin extends User {}

export type AdminDocument = DocumentType<Admin>;
export const AdminModel = getDiscriminatorModelForClass(
  UserModel,
  Admin,
  'admin',
);
