import { Order } from "../entities/Order";
import { Money } from "../value-objects/Money";

export class OrderDiscountService {
  /**
   * Reglas de negocio para descuentos:
   * - Si la orden tiene más de 5 items, 5% de descuento
   * - Si la orden tiene más de 10 items, 10% de descuento
   * - Si el total es mayor a $1000, 7% adicional de descuento
   */
  calculateDiscount(order: Order): Money {
    let discountPercentage = 0;
    const totalItems = order
      .getItems()
      .reduce((sum, item) => sum + item.quantity, 0);

    // Descuento por cantidad de items
    if (totalItems > 10) {
      discountPercentage += 10;
    } else if (totalItems > 5) {
      discountPercentage += 5;
    }

    // Descuento por monto total
    if (order.getTotalAmount().getAmount() > 1000) {
      discountPercentage += 7;
    }

    // Calcula el descuento final
    const discountMultiplier = (100 - discountPercentage) / 100;
    const finalAmount = order.getTotalAmount().getAmount() * discountMultiplier;

    return Money.of(order.getTotalAmount().getAmount() - finalAmount);
  }

  /**
   * Verifica si una orden es elegible para envío gratuito
   * Regla de negocio: Órdenes con más de $500 tienen envío gratuito
   */
  isEligibleForFreeShipping(order: Order): boolean {
    return order.getTotalAmount().getAmount() > 500;
  }
}
