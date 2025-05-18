import { Order } from "../../domain/entities/Order";
import { Product } from "../../domain/entities/Product";
import { Customer } from "../../domain/entities/Customer";
import { OrderRepository } from "../../domain/repositories/OrderRepository";
import { ProductRepository } from "../../domain/repositories/ProductRepository";
import { CreateOrderDto } from "../dtos/CreateOrderDto";
import { ValidationService } from "./ValidationService";

export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository
  ) {}

  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    // 1. Validar el DTO
    await ValidationService.validate(orderData, CreateOrderDto);

    // 2. Crear el cliente (que tiene sus propias validaciones de dominio)
    const customer = new Customer(
      orderData.customerId,
      orderData.customerName,
      orderData.customerEmail,
      orderData.customerAddress
    );

    // 3. Crear la orden usando el método factory
    const order = Order.create(customer);

    // 4. Procesar los items
    for (const item of orderData.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      order.addItem(product, item.quantity);
    }

    // 5. Persistir la orden
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
