import { Customer } from "./Customer";
import { Product } from "./Product";
import { Money } from "../value-objects/Money";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  product: Product;
  quantity: number;
  price: Money;
}

export class Order {
  private items: OrderItem[] = [];
  private totalAmount: Money = Money.of(0);
  private status: OrderStatus = "PENDING";

  constructor(
    private readonly id: string,
    private readonly customer: Customer,
    private readonly createdAt: Date = new Date()
  ) {}

  getId(): string {
    return this.id;
  }

  getCustomer(): Customer {
    return this.customer;
  }

  getItems(): OrderItem[] {
    return [...this.items];
  }

  getStatus(): OrderStatus {
    return this.status;
  }

  getTotalAmount(): Money {
    return this.totalAmount;
  }

  addItem(product: Product, quantity: number): void {
    if (quantity <= 0) {
      throw new Error("Quantity must be positive");
    }

    if (product.getStock() < quantity) {
      throw new Error("Insufficient stock");
    }

    const existingItem = this.items.find(
      (item) => item.product.getId() === product.getId()
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({
        product,
        quantity,
        price: product.getPrice(),
      });
    }

    this.recalculateTotal();
    product.updateStock(-quantity);
  }

  private recalculateTotal(): void {
    this.totalAmount = this.items.reduce(
      (total, item) => total.add(item.price.add(Money.of(item.quantity))),
      Money.of(0)
    );
  }

  confirm(): void {
    if (this.status !== "PENDING") {
      throw new Error("Order can only be confirmed when pending");
    }
    this.status = "CONFIRMED";
  }

  ship(): void {
    if (this.status !== "CONFIRMED") {
      throw new Error("Order can only be shipped when confirmed");
    }
    this.status = "SHIPPED";
  }

  deliver(): void {
    if (this.status !== "SHIPPED") {
      throw new Error("Order can only be delivered when shipped");
    }
    this.status = "DELIVERED";
  }

  cancel(): void {
    if (this.status === "DELIVERED" || this.status === "CANCELLED") {
      throw new Error("Cannot cancel delivered or already cancelled orders");
    }

    // Restore stock
    this.items.forEach((item) => {
      item.product.updateStock(item.quantity);
    });

    this.status = "CANCELLED";
  }
}
