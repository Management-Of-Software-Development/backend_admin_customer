import {
  JsonController,
  Get,
  Authorized,
  QueryParam,
  Param,
  Patch,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CustomerService } from './customer.service';

@JsonController('/customers')
export class CustomerController {
  private readonly customerService = new CustomerService();

  @Get('', { transformResponse: false })
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Gets customer list  ',
  })
  @Authorized(['admin'])
  getCustomerList(
    @QueryParam('page') page: number,
    @QueryParam('limit') limit: number,
    @QueryParam('rank') rank: string,
    @QueryParam('fields') fields: string,
  ) {
    return this.customerService.getCustomerList(page, limit, rank, fields);
  }

  @Get('/:customer_id', { transformResponse: false })
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Gets details of a customer ',
  })
  @Authorized(['admin'])
  getCustomerDetails(@Param('customer_id') customer_id: string) {
    return this.customerService.getCustomerDetails(customer_id);
  }

  @Patch('/block/:customer_id', { transformResponse: false })
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Temporary block customer ',
  })
  @Authorized(['admin'])
  async blockCustomer(@Param('customer_id') customer_id: string) {
    await this.customerService.blockCustomer(customer_id);
    return {
      message: 'Blocked customer successfully',
    };
  }

  @Patch('/unblock/:customer_id', { transformResponse: false })
  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Unblock customer ',
  })
  @Authorized(['admin'])
  async unblockCustomer(@Param('customer_id') customer_id: string) {
    await this.customerService.unblockCustomer(customer_id);
    return {
      message: 'UnBlocked customer successfully',
    };
  }
}
