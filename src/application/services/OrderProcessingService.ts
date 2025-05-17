import { Order } from "../../domain/entities/Order";
import { Customer } from "../../domain/entities/Customer";
import { OrderRepository } from "../../domain/repositories/OrderRepository";
import { ProductRepository } from "../../domain/repositories/ProductRepository";
import { OrderDiscountService } from "../../domain/services/OrderDiscountService";
import { Money } from "../../domain/value-objects/Money";

// Esta interfaz representaría un servicio de la capa de infraestructura
interface EmailService {
  sendOrderConfirmation(
    order: Order,
    customer: Customer,
    discount: Money
  ): Promise<void>;
}

// Esta interfaz representaría un servicio de la capa de infraestructura
interface ShippingService {
  calculateShippingCost(order: Order): Promise<Money>;
  scheduleDelivery(order: Order): Promise<void>;
}

export class OrderProcessingService {
  constructor(
    private orderRepository: OrderRepository,
    private productRepository: ProductRepository,
    private discountService: OrderDiscountService,
    private emailService: EmailService,
    private shippingService: ShippingService
  ) {}

  /**
   * Este método orquesta todo el proceso de crear y procesar una orden:
   * 1. Crea la orden
   * 2. Calcula descuentos
   * 3. Calcula costos de envío
   * 4. Guarda la orden
   * 5. Programa el envío
   * 6. Envía confirmación por email
   */
  async processOrder(
    customer: Customer,
    items: { productId: string; quantity: number }[]
  ): Promise<Order> {
    // 1. Crear la orden (reutilizamos la lógica existente)
    const order = new Order(this.generateId(), customer);

    // Agregar items a la orden
    for (const item of items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      order.addItem(product, item.quantity);
    }

    // 2. Calcular descuentos usando el servicio de dominio
    const discount = this.discountService.calculateDiscount(order);

    // 3. Calcular costo de envío
    let shippingCost = Money.of(0);
    if (!this.discountService.isEligibleForFreeShipping(order)) {
      shippingCost = await this.shippingService.calculateShippingCost(order);
    }

    // 4. Guardar la orden
    await this.orderRepository.save(order);

    // 5. Programar envío
    await this.shippingService.scheduleDelivery(order);

    // 6. Enviar confirmación por email
    await this.emailService.sendOrderConfirmation(order, customer, discount);

    return order;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
