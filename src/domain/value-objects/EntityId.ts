import { randomUUID } from "crypto";

export class EntityId {
  private constructor(private readonly value: string) {
    this.validate(value);
  }

  static generate(): EntityId {
    return new EntityId(randomUUID());
  }

  static fromString(id: string): EntityId {
    return new EntityId(id);
  }

  private validate(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error("ID cannot be empty");
    }
  }

  equals(other: EntityId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
