export class Customer {
  constructor(
    private readonly id: string,
    private name: string,
    private email: string,
    private address: string
  ) {
    this.validateEmail(email);
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getAddress(): string {
    return this.address;
  }

  updateAddress(newAddress: string): void {
    if (!newAddress.trim()) {
      throw new Error("Address cannot be empty");
    }
    this.address = newAddress;
  }
}
