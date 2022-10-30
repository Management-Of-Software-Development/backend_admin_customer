/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { BadRequestError } from 'routing-controllers';
import { CommercialProductModel } from '../commercial_product/commercial_product.model';
import { DiscountCodeRepository } from '../discount_code/discount_code.repository';
import { CreateOrderDto } from './dtos/createOrder.dto';
import { LoyalCustomerCreateOrderDto } from './dtos/loyalCustomerCreateOrder.dto';
import { OrderCommercialProduct } from './schemas/order-commercial-product';
import { OrderRepository } from './order.repository';
import { ProductModel } from '../product/product.model';
import { OrderAppreciationProduct } from './schemas/order-appreciation-product';
import { AppreciationProductModel } from '../appreciation_product/appreciation_product.model';
import { CustomerModel } from '../customer/customer.model';

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
    Object.assign(createOrderDto, {
      total_product_cost: await this.getTotalProductOrderCost(
        createOrderDto.products,
      ),
    });
    return this.orderRepository.createOrder(createOrderDto);
  }

  async loyalCustomerCreateOrder(
    user_id: string,
    user_email: string,
    user_point: number,
    createOrderDto: LoyalCustomerCreateOrderDto,
  ) {
    if (createOrderDto.products && createOrderDto.products.length)
      Object.assign(createOrderDto, {
        total_product_cost: await this.getTotalProductOrderCost(
          createOrderDto.products,
        ),
      });
    else {
      Object.assign(createOrderDto, {
        total_product_cost: 0,
      });
    }
    if (createOrderDto.gifts) {
      const totalPointConsumed = await this.getTotalPointConsumedOnOrder(
        createOrderDto.gifts,
      );
      if (totalPointConsumed > user_point)
        throw new BadRequestError('Not enough points to purchase gifts !');
      await this.updateGiftProductStock(createOrderDto.gifts);
      await CustomerModel.findOneAndUpdate(
        { _id: user_id },
        { point: user_point - totalPointConsumed },
      );
    }
    let discount_amount = '0';
    if (createOrderDto.discount_code)
      discount_amount = await this.discountRepository.applyingDiscountOnOrder(
        createOrderDto.discount_code,
        user_id,
        { total_product_cost: createOrderDto.total_product_cost },
      );
    return this.orderRepository.loyalCustomerCreateOrder(
      user_id,
      user_email,
      createOrderDto,
      discount_amount,
    );
  }

  async getOrderDetail(order_id: string, user_id: string) {
    return this.orderRepository.getOrderDetail(order_id, user_id);
  }

  private async getTotalProductOrderCost(products: OrderCommercialProduct[]) {
    const productList = await CommercialProductModel.find({
      _id: { $in: products.map((product) => product.product_id) },
    });
    if (!productList.length)
      throw new BadRequestError('No valid products specified.');
    const productSet = Object.fromEntries(
      productList.map((product) => [product._id.toString(), product]),
    );
    let totalCost = 0;
    for (const orderedProduct of products) {
      const product = productSet[orderedProduct.product_id.toString()];

      if (product.stock < orderedProduct.quantity)
        throw new BadRequestError(`Not enough stock for item: ${product.name}`);
      await ProductModel.findByIdAndUpdate(
        orderedProduct.product_id.toString(),
        {
          stock: product.stock - orderedProduct.quantity,
        },
      );
      totalCost +=
        productSet[orderedProduct.product_id.toString()].price *
        orderedProduct.quantity;
    }
    return totalCost;
  }

  private async getTotalPointConsumedOnOrder(
    products: OrderAppreciationProduct[],
  ) {
    const productList = await AppreciationProductModel.find({
      _id: { $in: products.map((product) => product.product_id) },
    });
    if (!productList.length)
      throw new BadRequestError('No valid products specified.');
    const productSet = Object.fromEntries(
      productList.map((product) => [product._id.toString(), product]),
    );
    let totalPoint = 0;
    for (const orderedProduct of products) {
      const product = productSet[orderedProduct.product_id.toString()];
      if (product.stock < orderedProduct.quantity)
        throw new BadRequestError(`Not enough stock for item: ${product.name}`);

      totalPoint +=
        productSet[orderedProduct.product_id.toString()].point *
        orderedProduct.quantity;
    }
    return totalPoint;
  }

  private async updateGiftProductStock(products: OrderAppreciationProduct[]) {
    const productList = await AppreciationProductModel.find({
      _id: { $in: products.map((product) => product.product_id) },
    });
    if (!productList.length)
      throw new BadRequestError('No valid products specified.');
    const productSet = Object.fromEntries(
      productList.map((product) => [product._id.toString(), product]),
    );
    for (const orderedProduct of products) {
      const product = productSet[orderedProduct.product_id.toString()];
      await ProductModel.findByIdAndUpdate(
        orderedProduct.product_id.toString(),
        {
          stock: product.stock - orderedProduct.quantity,
        },
        {
          new: true,
        },
      );
      if (product.stock < orderedProduct.quantity)
        throw new BadRequestError(`Not enough stock for item: ${product.name}`);
    }
  }
}
