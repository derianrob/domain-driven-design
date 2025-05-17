import { Money } from "../value-objects/Money";

export class Product {
  constructor(
    private readonly id: string,
    private name: string,
    private description: string,
    private price: Money,
    private stock: number
  ) {
    if (stock < 0) {
      throw new Error("Stock cannot be negative");
    }
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getPrice(): Money {
    return this.price;
  }

  getStock(): number {
    return this.stock;
  }

  updateStock(quantity: number): void {
    const newStock = this.stock + quantity;
    if (newStock < 0) {
      throw new Error("Cannot have negative stock");
    }
    this.stock = newStock;
  }
}
