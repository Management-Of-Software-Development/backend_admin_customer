import { DiscountCodeRepository } from '../discount_code/discount_code.repository';
import { CreateOrderDto } from './dtos/createOrder.dto';
import { OrderRepository } from './order.repository';

export class OrderService {
  private readonly orderRepository = new OrderRepository();

  private readonly discountRepository = new DiscountCodeRepository();

  async getListOrder(
    user_id: string,
    page: number,
    limit: number,
    status: string,
    order_id: string,
    time_start_end: string,
    selects: string,
  ) {
    return this.orderRepository.listOrders(
      user_id,
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

  async loyalCustomerCreateOrder(
    user_id: string,
    createOrderDto: CreateOrderDto,
  ) {
    let discount_amount = '0';
    if (createOrderDto.discount_code)
      discount_amount = await this.discountRepository.applyingDiscountOnOrder(
        createOrderDto.discount_code,
        user_id,
        { total_product_cost: createOrderDto.total_product_cost },
      );
    return this.orderRepository.loyalCustomerCreateOrder(
      user_id,
      createOrderDto,
      discount_amount,
    );
  }

  async getOrderDetail(order_id: string, user_id: string) {
    return this.orderRepository.getOrderDetail(order_id, user_id);
  }
}
