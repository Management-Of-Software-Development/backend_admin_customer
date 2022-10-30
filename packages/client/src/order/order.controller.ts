import { isValidObjectId } from 'mongoose';
import {
  Get,
  JsonController,
  BadRequestError,
  NotFoundError,
  QueryParam,
  Authorized,
  Post,
  Body,
  Param,
  CurrentUser,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { CustomerDocument } from '../customer/customer.model';
import { CreateOrderDto } from './dtos/createOrder.dto';
import { OrderService } from './order.service';
import { LoyalCustomerCreateOrderDto } from './dtos/loyalCustomerCreateOrder.dto';

@JsonController('/orders')
export class OrderController {
  private readonly orderService = new OrderService();

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'get List Orders',
  })
  @Authorized(['customer'])
  @Get('', { transformResponse: false })
  async getListOrders(
    @CurrentUser({ required: true }) user: CustomerDocument,
    @QueryParam('orderID')
    order_id: string,
    @QueryParam('fields')
    selects: string,
    @QueryParam('status')
    status: string,
    @QueryParam('start-end-time')
    start_end_time: string,
    @QueryParam('page')
    page: number,
    @QueryParam('limit')
    limit: number,
  ) {
    try {
      if (!page || !limit)
        throw new BadRequestError(
          'The page and limit must be specified and must be a valid number',
        );
      return this.orderService.getListOrder(
        user._id,
        page,
        limit,
        status,
        order_id,
        start_end_time,
        selects,
      );
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    description: 'create Orders',
  })
  @Post('', { transformResponse: false })
  async createOrder(@Body({ required: true }) createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'create Orders (cho khách hàng thân thiết)',
  })
  @Post('/loyalCustomer', { transformResponse: false })
  @Authorized(['customer'])
  async loyalCustomerCreateOrder(
    @CurrentUser({ required: true }) user: CustomerDocument,
    @Body({ required: true })
    loyalCustomerCreateOrderDto: LoyalCustomerCreateOrderDto,
  ) {
    return this.orderService.loyalCustomerCreateOrder(
      user._id,
      user.email,
      user.point,
      loyalCustomerCreateOrderDto,
    );
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get order detail',
  })
  @Authorized(['customer'])
  @Get('/:order_id', { transformResponse: false })
  async getOrderDetail(
    @CurrentUser({ required: true }) user: CustomerDocument,
    @Param('order_id') order_id: string,
  ) {
    try {
      if (!isValidObjectId(order_id))
        throw new BadRequestError('Invalid order_id');
      return this.orderService.getOrderDetail(order_id, user._id);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }
}
