/* eslint-disable dot-notation */
import { BadRequestError } from 'routing-controllers';
import { UserStatus } from '../user/enums/user-status.enum';
import { CustomerRepository } from './customer.repository';

export class CustomerService {
  private readonly customerRepository = new CustomerRepository();

  async getCustomerList(
    page: number,
    limit: number,
    ranks: string,
    select: string,
  ) {
    const query = { del_flag: false };
    const selectQuery = {};
    if (select) {
      const fieldsArray = select.split(',');
      fieldsArray.forEach((value) => {
        selectQuery[value] = 1;
      });
    }
    if (ranks) {
      Object.assign(query, { rank: { $in: ranks.split(',') } });
    }
    const data = await this.customerRepository.getCustomerList(
      query,
      select,
      page,
      limit,
    );
    const total = await this.customerRepository.countCustomerWithQuery(query);
    return {
      paginationInfo: {
        page,
        limit,
        total,
      },
      data,
    };
  }

  async getCustomerDetails(customer_id: string) {
    const query = { _id: customer_id, del_flag: false };
    return this.customerRepository.getCustomerDetail(query);
  }

  async blockCustomer(customer_id: string) {
    const query = {
      _id: customer_id,
      del_flag: false,
      status: UserStatus.ACTIVE,
    };
    const updateOptions = { status: UserStatus.INACTIVE };
    if (
      !(await this.customerRepository.updateCustomerDetail(
        query,
        updateOptions,
      ))
    ) {
      throw new BadRequestError(
        'Cannot block this user : Not found or already blocked',
      );
    }
  }

  async unblockCustomer(customer_id: string) {
    const query = {
      _id: customer_id,
      del_flag: false,
      status: UserStatus.INACTIVE,
    };
    const updateOptions = { status: UserStatus.ACTIVE };
    if (
      !(await this.customerRepository.updateCustomerDetail(
        query,
        updateOptions,
      ))
    ) {
      throw new BadRequestError(
        'Cannot unblock this user : Not found or already activated',
      );
    }
  }
}
