import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';
import { OrderStatus } from '../orders/order-status.enum';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  public async payOrder(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        payment: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    if (order.payment) {
      throw new NotFoundException('Order already paid');
    }
    const payment = this.paymentRepository.create();
    order.payment = payment;
    order.status = OrderStatus.AWAITING_SHIPMENT;

    return this.orderRepository.save(order);
  }
}
