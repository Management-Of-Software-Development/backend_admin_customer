import {
  getModelForClass,
  prop,
  DocumentType,
  modelOptions,
} from '@typegoose/typegoose';
import { DiscountCodeAppliedUsers } from './discountCodeAppliedUsers.interface';
import { AmountType } from './enums/amount-type.enum';
import { DiscountType } from './enums/discount-type.enum';

@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: 'create_time',
    },
  },
})
@modelOptions({ schemaOptions: { collection: 'discount_codes' } })
export class DiscountCode {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  code: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true, enum: DiscountType })
  discount_type: DiscountType;

  @prop({ required: true, enum: AmountType })
  amount_type: AmountType;

  @prop({ required: true })
  discount_amount: number;

  @prop({ required: true, select: false })
  customer_applying_condition: string;

  @prop({ select: false })
  applied_user: DiscountCodeAppliedUsers[];

  @prop({ required: false, default: 0 })
  min_order_value: number;

  @prop({ required: true })
  total_remaining: number;

  @prop({ required: false })
  create_time: Date;

  @prop({ required: true })
  expired_time: Date;
}
export type DiscountCodeDocument = DocumentType<DiscountCode>;
export const DiscountCodeModel = getModelForClass(DiscountCode);
