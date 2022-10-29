import { Expose } from 'class-transformer';
import { IsIn, IsNotEmpty } from 'class-validator';

export const ConditionList = [
  'equal',
  'not equal',
  'greater than',
  'greater than or equal',
  'less than',
  'less than or equal',
] as const;
const UserFields = ['status', 'create_time', 'rank'];
export type ConditionType = typeof ConditionList[number];
export class discountCodeCondition {
  @Expose()
  @IsNotEmpty()
  @IsIn(UserFields)
  object: string;

  @IsNotEmpty()
  @Expose()
  value: unknown;

  @IsNotEmpty()
  @Expose()
  @IsIn(ConditionList)
  condition: ConditionType;
}
export type DiscountCodeCondition = [discountCodeCondition[]];
