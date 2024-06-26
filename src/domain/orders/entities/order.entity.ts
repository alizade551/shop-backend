// order.entity.ts

import { OrderStatus } from '../order-status.enum';
import { RegistryDates } from '../../../common/embedded/registry-dates.embedded';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/domain/users/entities/user.entity';
import { Payment } from 'src/domain/payments/entities/payment.entity';
import { OrderItem } from './order-item.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.AWAITING_PAYMENT,
  })
  status: OrderStatus;

  @Column(() => RegistryDates, { prefix: false })
  registryDates: RegistryDates;

  @ManyToOne(() => User, (user) => user.orders, {
    eager: false,
    nullable: true,
  })
  customer: User;

  @OneToOne(() => Payment, (payment) => payment.order, { cascade: true })
  payment: Payment;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];

  @Expose()
  get total() {
    return this.items?.reduce((total, item) => {
      return total + item.subTotal;
    }, 0);
  }
}
