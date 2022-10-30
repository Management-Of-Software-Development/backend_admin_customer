/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { NotFoundError } from 'routing-controllers';
import { Mailer } from '../helper/mailer';
import { CreateOrderDto } from './dtos/createOrder.dto';
import { LoyalCustomerCreateOrderDto } from './dtos/loyalCustomerCreateOrder.dto';
import { OrderStatus } from './enums/order-status.enum';
import { OrderModel } from './order.model';
import { sendConfirmCreateOrderEmailQueue } from './queues/createOrder/sendConfirmCreateEmail.queue';

export class OrderRepository {
  async listOrders(
    user_id: string,
    page: number,
    limit: number,
    status: string,
    order_id: string,
    time_start_end: string,
    selects: string,
  ) {
    let aggregation = OrderModel.aggregate()
      .match({ user_id })
      .sort('-create_time');
    if (order_id) {
      aggregation = aggregation.match({
        order_id: { $in: order_id.split(',') },
      });
    }
    if (status) {
      aggregation = aggregation.match({
        status: { $in: status.split(',').map((x) => +x) },
      });
    }
    if (time_start_end) {
      let start_time: any = time_start_end.split('-')[0];
      let end_time: any = time_start_end.split('-')[1];
      if (this.isValidDate(start_time) && this.isValidDate(end_time)) {
        start_time = start_time.split('/');
        end_time = end_time.split('/');
        start_time = new Date(
          +start_time[2],
          +start_time[1] - 1,
          +start_time[0],
        );
        end_time = new Date(+end_time[2], +end_time[1] - 1, +end_time[0] + 1);
        aggregation = aggregation.match({
          create_time: {
            $gte: start_time,
            $lte: end_time,
          },
        });
      }
    }
    if (selects) {
      const project = {};
      const fields = selects.split(',');
      fields.forEach((value) => {
        project[value] = 1;
      });
      project['campaign_id'] = 1;
      aggregation = aggregation.project(project);
    }
    aggregation.facet({
      paginationInfo: [
        {
          $count: 'total',
        },
        {
          $addFields: {
            page,
            limit,
          },
        },
      ],
      data: [
        {
          $skip: (page - 1) * limit,
        },
        {
          $limit: limit,
        },
      ],
    });
    aggregation.unwind('$paginationInfo');
    const [results] = await aggregation.exec();
    if (!results) return null;
    return results;
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const countOrder = await OrderModel.estimatedDocumentCount({});
    const newOrder = new OrderModel({
      order_id: `ORD${(countOrder + 1).toString().padStart(8, '0')}`,
      ...createOrderDto,
      status: OrderStatus.NEW,
    });
    await newOrder.save();
    await Mailer.createOrder(newOrder.customer_email, newOrder._id);
    return { message: 'Created Successfully' };
  }

  async loyalCustomerCreateOrder(
    user_id: string,
    user_email: string,
    createOrderDto: LoyalCustomerCreateOrderDto,
    discount_amount: string,
  ) {
    const countOrder = await OrderModel.estimatedDocumentCount({});

    const newOrder = new OrderModel({
      order_id: `ORD${(countOrder + 1).toString().padStart(8, '0')}`,
      customer_email: user_email,
      ...createOrderDto,
      status: OrderStatus.NEW,
      discount: discount_amount,
      user_id,
    });
    await newOrder.save();
    await sendConfirmCreateOrderEmailQueue.add({
      user_email,
      order_id: newOrder._id,
    });
    return { message: 'Created Successfully' };
  }

  async getOrderDetail(order_id: string, user_id: string) {
    const order = await OrderModel.find({ _id: order_id, user_id });
    if (!order) throw new NotFoundError('Order not found !');
    return order;
  }

  isValidDate(dateString: string) {
    const regEx = /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)\d{2})$/;
    if (!dateString.match(regEx)) return false;
    return true;
  }
}
