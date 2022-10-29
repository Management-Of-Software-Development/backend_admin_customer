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
  Patch,
  Delete,
} from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { ConfirmDeliveryOrderDto } from './dtos/confirmDeliveryOrder.dto';
import { CreateOrderDto } from './dtos/createOrder.dto';
import { OrderService } from './order.service';

@JsonController('/orders')
export class OrderController {
  private readonly orderService = new OrderService();

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'get List Orders',
  })
  @Authorized(['admin', 'staff'])
  @Get('', { transformResponse: false })
  async getListOrders(
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
    security: [{ BearerAuth: [] }],
    description: 'create Orders',
  })
  @Post('', { transformResponse: false })
  async createOrder(@Body({ required: true }) createOrderDto: CreateOrderDto) {
    return this.orderService.createOrder(createOrderDto);
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Get order detail',
  })
  @Authorized(['admin', 'staff'])
  @Get('/:order_id', { transformResponse: false })
  async getOrderDetail(@Param('order_id') order_id: string) {
    try {
      if (!isValidObjectId(order_id))
        throw new BadRequestError('Invalid order_id');
      return this.orderService.getOrderDetail(order_id);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Confirm order delivery',
  })
  @Authorized(['admin', 'staff'])
  @Patch('/confirm/:order_id', { transformResponse: false })
  async confirmDeliveryOrder(
    @Param('order_id') order_id: string,
    @Body({ required: true })
    confirmDeliveryOrderDto: ConfirmDeliveryOrderDto,
  ) {
    try {
      if (!isValidObjectId(order_id))
        throw new BadRequestError('Invalid order_id');
      return this.orderService.confirmDelivery(
        order_id,
        confirmDeliveryOrderDto,
      );
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Confirm successfully delivered order',
  })
  @Authorized(['admin', 'staff'])
  @Patch('/success/:order_id', { transformResponse: false })
  async confirmSuccessfullyDeliveredOrder(@Param('order_id') order_id: string) {
    try {
      if (!isValidObjectId(order_id))
        throw new BadRequestError('Invalid order_id');
      return this.orderService.confirmSucessfullyDeliveredOrder(order_id);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }

  @OpenAPI({
    security: [{ BearerAuth: [] }],
    description: 'Cancel order ',
  })
  @Authorized(['admin', 'staff'])
  @Delete('/:order_id', { transformResponse: false })
  async cancelOrder(@Param('order_id') order_id: string) {
    try {
      if (!isValidObjectId(order_id))
        throw new BadRequestError('Invalid order_id');
      return this.orderService.cancelOrder(order_id);
    } catch (e) {
      if (e instanceof NotFoundError) throw new NotFoundError(e.message);
      throw new BadRequestError(e.message);
    }
  }
}
