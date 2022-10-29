import { FilterQuery, UpdateQuery } from 'mongoose';
import { CustomerDocument, CustomerModel } from './customer.model';

export class CustomerRepository {
  async getCustomerList(
    query: FilterQuery<CustomerDocument>,
    selectQuery: any,
    page: number,
    limit: number,
  ) {
    return CustomerModel.find(query)
      .select(selectQuery)
      .skip(limit * (page - 1))
      .limit(limit)
      .lean();
  }

  async countCustomerWithQuery(
    query: FilterQuery<CustomerDocument>,
  ): Promise<number> {
    return CustomerModel.countDocuments(query);
  }

  async getCustomerDetail(query: FilterQuery<CustomerDocument>) {
    return CustomerModel.findOne(query).lean();
  }

  async updateCustomerDetail(
    query: FilterQuery<CustomerDocument>,
    updateOptions: UpdateQuery<CustomerDocument>,
  ) {
    return CustomerModel.findOneAndUpdate(query, updateOptions, {
      new: true,
    }).lean();
  }
}
