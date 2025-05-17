import { Entity, PrimaryColumn, Column, OneToMany } from "typeorm";
import { OrderStatus } from "../../../../domain/entities/Order";

@Entity("orders")
export class OrderEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  customerId: string;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column()
  customerAddress: string;

  @Column()
  status: OrderStatus;

  @Column("decimal")
  totalAmount: number;

  @Column()
  createdAt: Date;
}
