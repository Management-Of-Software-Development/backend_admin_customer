import { ConfirmDeliveryOrderDto } from './dtos/confirmDeliveryOrder.dto';
import { CreateOrderDto } from './dtos/createOrder.dto';
import { OrderRepository } from './order.repository';

export class OrderService {
  private readonly orderRepository = new OrderRepository();

  async getListOrder(
    page: number,
    limit: number,
    status: string,
    order_id: string,
    time_start_end: string,
    selects: string,
  ) {
    return this.orderRepository.listOrders(
      page,
      limit,
      status,
      order_id,
      time_start_end,
      selects,
    );
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    return this.orderRepository.createOrder(createOrderDto);
  }

  async getOrderDetail(order_id: string) {
    return this.orderRepository.getOrderDetail(order_id);
  }

  async confirmDelivery(
    order_id: string,
    confirmDeliveryOrderDto: ConfirmDeliveryOrderDto,
  ) {
    return this.orderRepository.confirmDeliveryOrder(
      order_id,
      confirmDeliveryOrderDto,
    );
  }

  async confirmSucessfullyDeliveredOrder(order_id: string) {
    return this.orderRepository.confirmSucessfullyDeliveredOrder(order_id);
  }

  async cancelOrder(order_id: string) {
    return this.orderRepository.cancelOrder(order_id);
  }
}
