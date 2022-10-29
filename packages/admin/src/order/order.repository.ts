/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { BadRequestError, NotFoundError } from 'routing-controllers';
import { CustomerRankEntry } from '../customer/enums/customer-rank-entry.enum';
import { CustomerModel } from '../customer/customer.model';
import { Mailer } from '../helper/mailer';
import { ConfirmDeliveryOrderDto } from './dtos/confirmDeliveryOrder.dto';
import { CreateOrderDto } from './dtos/createOrder.dto';
import { OrderStatus } from './order-status.enum';
import { OrderModel } from './order.model';

export class OrderRepository {
  async listOrders(
    page: number,
    limit: number,
    status: string,
    order_id: string,
    time_start_end: string,
    selects: string,
  ) {
    let aggregation = OrderModel.aggregate().match({}).sort('-create_time');
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

  async getOrderDetail(order_id: string) {
    const order = await OrderModel.find({ _id: order_id }).populate({
      path: 'user_id',
    });
    if (!order) throw new NotFoundError('Order not found !');
    return order;
  }

  async confirmDeliveryOrder(
    order_id: string,
    confirmDeliveryOrderDto: ConfirmDeliveryOrderDto,
  ) {
    const order = await OrderModel.findOneAndUpdate(
      { _id: order_id, status: OrderStatus.NEW },
      { status: OrderStatus.CONFIRMED, ...confirmDeliveryOrderDto },
      { new: true },
    );
    if (!order)
      throw new BadRequestError(
        'Can not confirm delivery this order ! The order does not exist or you are trying to confirm a non-new order !',
      );
    await Mailer.confirmDeliveryOrder(order.customer_email, order_id);
    return order;
  }

  async confirmSucessfullyDeliveredOrder(order_id: string) {
    const order = await OrderModel.findOneAndUpdate(
      { _id: order_id, status: OrderStatus.CONFIRMED },
      { status: OrderStatus.DONE },
      { new: true },
    );
    if (!order)
      throw new BadRequestError(
        'Can not confirm sucessfully delivered this order ! The order does not exist or you are trying to confirm successive of a non delivery-confirmation order !',
      );
    if (order.user_id) {
      const toUpdatePointCustomer = await CustomerModel.findById(order.user_id);
      toUpdatePointCustomer.point += order.total_product_cost;
      toUpdatePointCustomer.rank_point += order.total_product_cost;
      const ranks = Object.keys(CustomerRankEntry)
        .filter(
          (key) =>
            Number.isNaN(Number(CustomerRankEntry[key])) &&
            Number(key) <= toUpdatePointCustomer.rank_point,
        )
        .map(Number);
      toUpdatePointCustomer.rank = ranks.indexOf(Math.max(...ranks));
      await toUpdatePointCustomer.save();
    }
    await Mailer.confirmSuccessfulOrder(order.customer_email, order_id);
    return order;
  }

  async cancelOrder(order_id: string) {
    const order = await OrderModel.findOneAndUpdate(
      {
        _id: order_id,
        $or: [{ status: OrderStatus.NEW }, { status: OrderStatus.CONFIRMED }],
      },
      { status: OrderStatus.CANCELED },
      { new: true },
    );
    if (!order)
      throw new BadRequestError(
        'Can not cancel this order ! The order does not exist or you are trying to cancel a fully-successful/canceled order !',
      );
    await Mailer.cancelOrder(order.customer_email, order_id);
    return order;
  }

  isValidDate(dateString: string) {
    const regEx = /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)\d{2})$/;
    if (!dateString.match(regEx)) return false;
    return true;
  }
}
