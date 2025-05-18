import { Order } from "../../domain/entities/Order";
import { Product } from "../../domain/entities/Product";
import { Customer } from "../../domain/entities/Customer";
import { OrderRepository } from "../../domain/repositories/OrderRepository";
import { ProductRepository } from "../../domain/repositories/ProductRepository";

export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository
  ) {}

  async createOrder(
    customer: Customer,
    items: { productId: string; quantity: number }[]
  ): Promise<Order> {
    const order = Order.create(customer);

    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      order.addItem(product, item.quantity);
    }

    await this.orderRepository.save(order);
    return order;
  }

  async confirmOrder(orderId: string): Promise<void> {
    const order = await this.getOrderById(orderId);
    order.confirm();
    await this.orderRepository.update(order);
  }

  async shipOrder(orderId: string): Promise<void> {
    const order = await this.getOrderById(orderId);
    order.ship();
    await this.orderRepository.update(order);
  }

  async deliverOrder(orderId: string): Promise<void> {
    const order = await this.getOrderById(orderId);
    order.deliver();
    await this.orderRepository.update(order);
  }

  async cancelOrder(orderId: string): Promise<void> {
    const order = await this.getOrderById(orderId);
    order.cancel();
    await this.orderRepository.update(order);
  }

  private async getOrderById(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    return order;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
