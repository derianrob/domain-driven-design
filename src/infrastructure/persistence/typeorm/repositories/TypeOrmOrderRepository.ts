import { Repository } from "typeorm";
import { Order } from "../../../../domain/entities/Order";
import { Customer } from "../../../../domain/entities/Customer";
import { OrderRepository } from "../../../../domain/repositories/OrderRepository";
import { OrderEntity } from "../entities/OrderEntity";

export class TypeOrmOrderRepository implements OrderRepository {
  constructor(private readonly repository: Repository<OrderEntity>) {}

  async findById(id: string): Promise<Order | null> {
    const orderEntity = await this.repository.findOne({ where: { id } });
    if (!orderEntity) {
      return null;
    }
    return this.mapToDomain(orderEntity);
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    const orderEntities = await this.repository.find({ where: { customerId } });
    return orderEntities.map((entity) => this.mapToDomain(entity));
  }

  async save(order: Order): Promise<void> {
    const entity = this.mapToEntity(order);
    await this.repository.save(entity);
  }

  async update(order: Order): Promise<void> {
    const entity = this.mapToEntity(order);
    await this.repository.save(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private mapToDomain(entity: OrderEntity): Order {
    // Aquí necesitarías reconstruir el objeto Order con todos sus Value Objects
    // Este es un ejemplo simplificado
    const customer = new Customer(
      entity.customerId,
      entity.customerName,
      entity.customerEmail,
      entity.customerAddress
    );

    const order = new Order(entity.id, customer, entity.createdAt);
    // Aquí necesitarías reconstruir los items y el estado
    return order;
  }

  private mapToEntity(order: Order): OrderEntity {
    const entity = new OrderEntity();
    entity.id = order.getId();
    const customer = order.getCustomer();
    entity.customerId = customer.getId();
    entity.customerName = customer.getName();
    entity.customerEmail = customer.getEmail();
    entity.customerAddress = customer.getAddress();
    entity.status = order.getStatus();
    entity.totalAmount = order.getTotalAmount().getAmount();
    entity.createdAt = new Date(); // Idealmente deberías obtener esto del Order
    return entity;
  }
}
