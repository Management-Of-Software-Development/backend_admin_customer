import { Types } from 'mongoose';

export interface DiscountCodeAppliedUsers {
  user_id: Types.ObjectId;
  remaining: number;
}
